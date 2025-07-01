<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useUserStore } from '../../store/userPinia';

import { formatUTCtoLocal } from '../../utils/timeUtils';

const userStore = useUserStore();

const draftList = computed(() => {
    if (prop.draftType === 'question') {
        return userStore.queDraft;
    } else {
        return userStore.ansDraft;
    }
});

const prop = defineProps(['draftType']);
const emit = defineEmits(['editDraft']);

const activeNullDraft = ref(false);

onMounted(async () => {
    userStore.initDraft();
    // 获取登录用户的 草稿
    await userStore.fetchDraft(prop.draftType).then(() => {
        console.log(userStore.ansDraft);
        console.log(userStore.queDraft);
        if (userStore.queDraft.length == 0 && userStore.ansDraft.length == 0) { // 没有草稿
            activeNullDraft.value = true;
        }
    });
})

onUnmounted(() => {
    userStore.initDraft();
})

// 编辑 点击事件
const edit = (draft) => {
    emit("editDraft", draft);
}

// 删除 点击事件
const deleteDraft = async (draId) => {
    await userStore.deleteDraft(prop.draftType, draId);

    // 删除后判断是否还有草稿
    if (prop.draftType === 'question') {
        if (userStore.queDraft.length == 0) { // 没有草稿
            activeNullDraft.value = true;
        }
    } else {
        if (userStore.ansDraft.length == 0) { // 没有草稿
            activeNullDraft.value = true;
        }
    }
}

</script>

<template>
    <div class="draft-list" v-for="draft in draftList">
            <div class="content">
                <div class="con-left">
                    <div class="title">标题：{{ draft.draTitle }}</div>
                    <div v-html="draft.draContent"></div>
                    <span class="time">更新时间：{{ formatUTCtoLocal(draft.draUpdatedAt) }}</span>
                    <br>
                    <span class="time">创建时间：{{ formatUTCtoLocal(draft.draCreatedAt) }}</span>
                </div>
                <div>
                    <el-button type="primary" style="float: right;" @click="edit(draft)">编辑</el-button>
                    <el-popconfirm title="确认删除该话题草稿？" placement="top" @confirm="deleteDraft(draft.draId)">
                        <template #reference>
                            <el-button type="danger" plain style="float: right;margin-right: 10px;">删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
            <el-divider></el-divider>
        </div>
        <div v-if="activeNullDraft" class="null-draft">
            <span>你还没有草稿呢！</span>
        </div>
    <!-- <div class="draft">
        
    </div> -->
</template>

<style scoped>
.draft {
    /* border: 1px solid; */
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 20px;
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
</style>