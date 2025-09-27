<script setup>
import { onMounted, ref, watch } from 'vue';
import { getDraftList, deleteDraft } from '../../api/Draft/DraftApi.js';
import { deleteImage } from '../../api/image.js';
import { useUserStore } from '../../store/userPinia';
import { getImagePathFromHTML, extractImagePath } from '../../utils/imageUtils.js';
import { formatUTCtoLocal } from '../../utils/timeUtils';
import { ElMessage } from 'element-plus';

//======================数据定义=========================
const prop = defineProps(['draftType']);
const emit = defineEmits(['editDraft']);
const userStore = useUserStore();
const authorId = userStore.user.userId;
// 草稿列表
const draftList = ref();
const currentPage = ref(1);
const pageSize = ref(prop.draftType === 'answer' ? 4 : 6);
const total = ref(0);
const size = ref('default')
const ifNull = ref(false); // 是否为空
const ifLoading = ref(false); // 是否加载

// 组件挂载获取数据
onMounted(async () => {
    // 获取登录用户的 草稿
    fetchDraftList();
})

//=========================数据获取=============================
// 获取草稿列表
const fetchDraftList = async () => {
    try {
        ifLoading.value = true;
        // 设置参数
        const params = {
            currentPage: currentPage.value,
            pageSize: pageSize.value,
            authorId: authorId,
            type: prop.draftType
        }
        // 发送请求
        const result = await getDraftList(params);
        if (result.success) {
            draftList.value = result.data.records || [];
            currentPage.value = result.data.current || currentPage.value;
            pageSize.value = result.data.size || pageSize.value;
            total.value = result.data.total || total.value;
        } else {
            ElMessage.error("请求用户的草稿箱失败:", result.message);
        }
    } catch (error) {
        console.error("请求用户的草稿箱失败:", error);
        ElMessage.error("请求用户的草稿箱失败");
    } finally {
        ifLoading.value = false;
    }
}
//======================CRUD======================
// 编辑 点击事件
const edit = (draft) => {
    emit("editDraft", draft);
}
// 删除 点击事件
const handleDeleteDraft = async (draId) => {
    try {
        // 1.先提取 文件、图片等资源路径
        const html = draftList.value.find(item => item.draId === draId).draContent;
        const imagePath = getImagePathFromHTML(html);
        // 2.接着删除 草稿
        const result = await deleteDraft(draId);
        if (result.success) {
            // 3.删除草稿成功后，才删除资源
            if (!handleDeleteImage(imagePath)) {
                ElMessage.error("删除图片资源失败");
                return;
            }

            ElMessage.success("删除成功");
            fetchDraftList(); // 重置草稿箱
            handleIfNull();
        } else {
            ElMessage.error("删除失败" || result.message);
        }
    } catch (error) {
        ElMessage.error("删除草稿失败");
        console.error("删除草稿失败：", error);
    }
}
// 判断 是否有草稿
const handleIfNull = () => {
    if (draftList.value == null || draftList.value == []) { // 没有草稿
        ifNull.value = true;
    }
    ifNull.value = false;
}
//========================分页==========================
// 处理分页尺寸大小改变
const handleSizeChange = (size) => {
    pageSize.value = size;
    fetchDraftList();
}
// 处理页码改变
const handleCurrentChange = (page) => {
    currentPage.value = page;
    fetchDraftList();
}
// =======================其它=========================
// 删除 图片资源
const handleDeleteImage = async (pathList) => {
    if (pathList == null || pathList == []) {
        return false;
    }
    for (let i = 0; i < pathList.length; i++) {
        const element = pathList[i];
        const deletePath = extractImagePath(element.src); // 提取相对路径
        await deleteImage(deletePath);
    }
    return true;
}

</script>

<template>
    <el-main class="draft" v-loading="ifLoading">
        <div class="draft-list" v-for="draft in draftList">
            <div class="content">
                <div class="con-left">
                    <div class="title">标题：{{ draft.draTitle }}</div>
                    <div class="draft-content" v-html="draft.draContent"></div>
                    <span class="time">更新时间：{{ formatUTCtoLocal(draft.draUpdatedAt) }}</span>
                    <br>
                    <span class="time">创建时间：{{ formatUTCtoLocal(draft.draCreatedAt) }}</span>
                </div>
                <div>
                    <el-button type="primary" style="float: right;" @click="edit(draft)">编辑</el-button>
                    <el-popconfirm title="确认删除该话题草稿？" placement="top" @confirm="handleDeleteDraft(draft.draId)">
                        <template #reference>
                            <el-button type="danger" plain style="float: right;margin-right: 10px;">删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
        <div v-if="activeNullDraft" class="null-draft">
            <span>你还没有草稿呢！</span>:
        </div>
        <div class="pagination-container">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage"
                :page-size="pageSize" :size="size" :page-sizes="[6, 10, 30]" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </el-main>
</template>

<style lang="scss" scoped>
.draft {
    /* border: 1px solid; */
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-height: 400px;
    background: #fff;
}

.draft-list {
    width: 100%;
}

.content {
    display: flex;
    width: 100%;
}

.con-left {
    flex-grow: 2;
}

.title {
    font-size: large;
    font-weight: 800;
    margin-bottom: 5px;
}

.draft-content {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    ::v-deep img {
        max-width: 80px;
        max-height: 120px;
    }
}

.time:nth-child(1 of .time) {
    margin-top: 10px;
    color: #409eff;
}

.time {
    justify-content: center;
    font-size: small;
    font-weight: 300;
}

.bottom {
    display: flex;
    justify-content: space-between;
    /* 左右对齐 */
    align-items: center;
    /* 垂直居中 */
}

.bottom-time {
    flex-grow: 2;
}

.bottom .button {

    margin-left: 10px;
    /* 按钮间距 */
}

.null-draft {
    display: flex;
    height: 600px;
    background: #fff;
    justify-content: center;
    align-items: center;
}

.null-draft span {
    padding: 10px;
    border-bottom: 3px solid #409eff;
}

.pagination-container {
    position: sticky;
    bottom: 0px;
}
</style>