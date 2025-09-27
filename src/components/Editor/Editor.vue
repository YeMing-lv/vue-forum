<script setup>
import { useRouter } from 'vue-router';
import { insertQuestion } from '../../api/Question/QuestionApi';
import { insertDraft, updateDarft } from '../../api/Draft/DraftApi';
import { deleteImage } from '../../api/image';
import Draft from '../../components/List/Draft.vue';
import { useUserStore } from '../../store/userPinia';
import { useQueStore } from '../../store/quePinia';
import { useAnsStore } from '../../store/ansPinia';
import { extractImagePath } from '../../utils/imageUtils';

import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive, computed, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const queStore = useQueStore();
const ansStore = useAnsStore();

const prop = defineProps(['editorType']); // 编辑器类别 话题编辑器 还是 回答编辑器
const emit = defineEmits(['ifCompleteAnswerEdit']); // 对 answer 编辑器 完成编辑后的隐藏

const activeIndex = ref('1'); // 导航栏
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef，重要！
const titleText = ref(''); // 标题 HTML
const valueHtml = ref('<p>hello</p>'); // 内容 HTML
const editDraft = ref(); // 当前编辑器的草稿，初始空，用来判断数据库中是否已有相同ID草稿
const imageList1 = reactive([]); // 图片列表 所有插入的图片 包括编辑器里删除的图片

//============================生命周期钩子=======================
onMounted(async () => {
    // console.log(localStorage.getItem("token"));
});

// 退出页面 确认是否保存草稿
// 组件销毁前，要及时销毁编辑器，重要！
onBeforeUnmount(() => {
    initEditContent();
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
});
//=============================编辑器配置========================
// 工具栏配置 和 编辑器配置
const toolbarConfig = {
    excludeKeys: ['group-video']

};
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: { // 图片上传
            fieldName: 'file',
            server: `http://localhost:8082/image/upload?type=queAndAns`,
            headers: {
                Authorization: localStorage.getItem("token")
            },
            maxFileSize: 2 * 1024 * 1024,
        },
        insertImage: {
            onInsertedImage(imageNode) {
                if (imageNode == null) return;
                const { src, alt, url, href } = imageNode;
                console.log(imageList1);
                // 记录所有上传到后端的图片 用于后续比对 删除未存于 valueHtml 的图片
                imageList1.push({
                    src,
                    alt,
                    url,
                    href
                });
            }
        }
    }
};

// 编辑器回调函数
const handleCreated = (editor) => {
    // 查看所有实现的 菜单
    // const allMenuKeys = editor.getAllMenuKeys();
    // console.log('created', allMenuKeys);
    editorRef.value = editor; // 记录 editor 实例，重要！！！！
};
const handleChange = (editor) => {
    editorRef.value = editor;
    // console.log('change:', editor.getHtml());
};
// 编辑器销毁之前 进行保存草稿判断处理
const handleDestroyed = (editor) => {
    // console.log(editDraft.value);
    if (editDraft.value != null) { // 如果是对已有的草稿进行编辑
        // 则判断是否有对原草稿的修改
        if (ifNewInput(editDraft.value.draTitle, editDraft.value.draContent)) {
            ElMessageBox.confirm('是否要保存草稿?', '有未保存的修改',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '拒绝',
                    type: 'warning'
                }
            ).then(() => {
                saveWrite();
            }).catch(() => {
                // 删除没有保存的图片资源
                deleteNotusedImage();
            });
        }
    } else {
        if (ifNewInput()) { // 编辑器已有输入 并且还未保存过
            ElMessageBox.confirm('是否要保存草稿?', '有未保存的修改',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '拒绝',
                    type: 'warning'
                }
            ).then(() => {
                saveWrite();
            }).catch(() => {
                // 删除没有保存的图片资源
                deleteNotusedImage();
            });
        }
    }
    editorRef.value = editor; // 记录 editor 实例，重要！！！！
};

// ==========================保存、导航栏跳转======================
// 话题 或 回答 提交事件处理
const publish = async () => {
    if (!ifNewInput()) { // 是否有新输入
        ElMessage.info("请先输入新内容！")
        return;
    }
    if (!ifInputNull()) return; // 输入规范

    if (prop.editorType === 'question') {
        // 上传新的话题数据
        await insertQuestion(titleText.value, valueHtml.value, userStore.user.userId).then((result) => {
            if (result.code === 200) {
                router.push({
                    path: '/question',
                    query: { id: response.data.queId }
                });
            } else {
                ElMessage.error(result.data || '新建话题失败');
            }
        })
    } else if (prop.editorType === 'answer') {
        // 上传新的回答数据
        const result = await ansStore.insertAnswer(userStore.user.userId, queStore.currentQuestion.queId, valueHtml.value);
        if (result) {
            ElMessage.success("发表成功");
            // emit 返回话题组件 收起编辑器
            emit('ifCompleteAnswerEdit', true);
        } else {
            ElMessage.error("发表失败，请稍后再试!");
        }
    }
}

// 导航栏跳转
const handleSelect = (key, keyPath) => {
    if (activeIndex.value === '1') {
        if (editDraft.value != null) { // 如果是对已有的草稿进行编辑
            // 则判断是否有对原草稿的修改
            if (ifNewInput(editDraft.value.draTitle, editDraft.value.draContent)) {
                ElMessageBox.confirm('是否要保存草稿?', '有未保存的修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '拒绝',
                        type: 'warning'
                    }
                ).then(() => {
                    saveWrite().then(() => {
                        initEditContent();
                        activeIndex.value = key;
                    });
                }).catch(() => {
                    // 删除没有保存的图片资源
                    deleteNotusedImage();
                    // 初始化编辑器内容
                    initEditContent();
                    activeIndex.value = key;
                });
            } else { // 没有修改
                initEditContent();
                activeIndex.value = key;
            }
        } else {
            if (ifNewInput()) { // 编辑器已有输入 并且还未保存过
                ElMessageBox.confirm('是否要保存草稿?', '有未保存的修改',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '拒绝',
                        type: 'warning'
                    }
                ).then(() => {
                    saveWrite().then(() => {
                        initEditContent();
                        activeIndex.value = key;
                    });
                }).catch(() => {
                    // 删除没有保存的图片资源
                    deleteNotusedImage();
                    // 初始化编辑器内容
                    initEditContent();
                    activeIndex.value = key;
                });
            } else {
                initEditContent();
                activeIndex.value = key;
            }
        }
    } else {
        activeIndex.value = key;
    }
}

// ===========================草稿保存管理===========================
// 保存草稿事件处理
const saveWrite = async () => {
    if (!ifNewInput()) {
        ElMessage("请先输入新内容！")
        return;
    }
    if (!ifInputNull()) return;

    // 根据是否已有过草稿，来选择新建草稿，还是根据ID更新草稿
    if (editDraft.value != null) { // 更新草稿
        try {
            // 更新数据
            const draft = { ...editDraft.value };
            draft.draTitle = titleText.value;
            draft.draContent = valueHtml.value;
            // 发送请求 
            const result = await updateDarft(draft);
            if (result.success) {
                ElMessage.success("保存成功");
                editDraft.value.draTitle = titleText.value;
                editDraft.value.draContent = valueHtml.value;
            } else {
                ElMessage.error("保存失败")
            }
        } catch (error) {
            console.error("更新草稿失败:", error);
            ElMessage.error("更新草稿失败");
        }
    } else {
        try {
            // 上传草稿
            const result = await insertDraft(userStore.user.userId, prop.editorType, titleText.value, valueHtml.value);
            if (result.success) {
                ElMessage.success("保存成功");
                editDraft.value = result.data;
            }
        } catch (error) {
            console.error("保存草稿失败:", error);
            ElMessage.error("保存草稿失败");
        }
    }
    deleteNotusedImage();
}

//==============================编辑器管理===========================
// 对草稿进行编辑
const handleEditDraft = (data) => {
    // 接收草稿对象
    editDraft.value = data;
    titleText.value = data.draTitle;
    valueHtml.value = data.draContent;
    // 跳转到编辑器
    handleSelect("1", ["1"]);
}

// 输入规范
const ifInputNull = () => {
    if (titleText.value === '' && prop.editorType === 'question') {
        ElMessage("请输入标题！");
        return false;
    } else if (titleText.value.length < 6 && prop.editorType === 'question') {
        ElMessage("标题字数过少！");
        return false;
    } else if (valueHtml.value === '') {
        ElMessage("请输入内容！");
        return false;
    } else if (valueHtml.value.length < 10) {
        ElMessage("内容过少！");
        return false;
    }
    return true;
}

// 判断是否有新内容
const ifNewInput = (title, content) => {
    if (prop.editorType === 'answer' && valueHtml.value === '<p>hello</p>') { // 等于默认状态
        return false;
    } else if (prop.editorType != 'answer' && titleText.value === '' && valueHtml.value === '<p>hello</p>') {
        return false;
    }
    if (title != null && content != null) {
        if (titleText.value === title && valueHtml.value === content) { // 草稿编辑 等于初始状态
            return false;
        }
    }
    return true;
}

// 初始化编辑器内容
function initEditContent() {
    editDraft.value = null;
    titleText.value = '';
    valueHtml.value = '<p>hello</p>';
    imageList1.values = [];
}

// ===========================图片管理============================
// 删除未使用图片
async function deleteNotusedImage() {
    const editor = editorRef.value;
    if (editor == null) return;

    // 对比图片列表
    const imageList2 = editor.getElemsByType('image');
    const result = compareImageList(imageList1, imageList2);
    console.log(result);
    if (result != null || result !== []) { // 删除未使用图片
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const deletePath = extractImagePath(element.src); // 提取相对路径
            await deleteImage(deletePath);
        }
    }
}
// 图片列表对比处理
function compareImageList(list1, list2) {
    const srcInList1 = new Set(list1.map(item => item.src));
    const srcInList2 = new Set(list2.map(item => item.src));

    const list = [
        ...list2.filter(item => !srcInList1.has(item.src)),
        ...list1.filter(item => !srcInList2.has(item.src))
    ];
    return list;
}

watch

</script>

<template>
    <div class="writting">
        <div class="editor">
            <el-menu :default-active="activeIndex" class="editor-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">{{ prop.editorType === 'question' ? "编写话题" : prop.editorType === 'answer' ? "编写回答" : "编写文章" }}</el-menu-item>
                <el-menu-item index="2">草稿箱</el-menu-item>
            </el-menu>
            <div v-if="activeIndex === '1'" style="border: 1px solid #ccc;margin-top: 10px;">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
                    style="border-bottom: 1px solid #ccc" />
                <textarea v-if="prop.editorType != 'answer'" class="editor-title" v-model="titleText"
                    placeholder="请输入标题"></textarea>
                <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml"
                    style="height: 400px; overflow-y: hidden;border-bottom: 1px solid #ccc" @onCreated="handleCreated"
                    @onChange="handleChange" @onDestroyed="handleDestroyed()" />
            </div>

            <div v-if="activeIndex === '1'" class="answer-footer">
                <el-button @click="saveWrite()">保存草稿</el-button>
                <el-button type="primary" @click="publish()">发表回答</el-button>
            </div>
        </div>
        <Draft v-if="activeIndex === '2'" @editDraft="handleEditDraft" :draft-type="prop.editorType" />
    </div>
</template>

<style scoped>
.writting {
    padding: 10px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.editor {}

.editor-menu {
    margin-top: 5px;
    background: none;
}

.editor-title {
    width: 100%;
    height: auto;
    font-size: 25px;
    border: none;
    border-bottom: 1px solid #d0d0d0;
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    resize: vertical;
}

.answer-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding: 10px 0;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}
</style>