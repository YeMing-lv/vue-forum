<script setup>
import { useRoute, useRouter } from 'vue-router';
import myrequest from '../../api/request';
import Draft from '../../components/List/Draft.vue';
import { useUserStore } from '../../store/userPinia';
import { useQueStore } from '../../store/quePinia';
import { useAnsStore } from '../../store/ansPinia';

import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const queStore = useQueStore();
const ansStore = useAnsStore();

const prop = defineProps(['editorType']); // 编辑器类别 话题编辑器 还是 回答编辑器

const emit = defineEmits(['ifCompleteAnswerEdit']); // 对 answer 编辑器 完成编辑后的隐藏

const activeIndex = ref('1'); // 导航栏
let newKey;

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef，重要！

const titleText = ref(''); // 标题 HTML
const valueHtml = ref('<p>hello</p>'); // 内容 HTML
const imageList1 = reactive([]); // 图片列表 所有插入的图片 包括编辑器里删除的图片

const saveDialogActive = ref(false); // 保存 文字提示

const ifSaveDraft = ref(false); // 当前是否已 保存草稿

// 编辑器动态样式 ???

onMounted(async () => {
    // 获取指定种类草稿箱
    userStore.fetchDraft(prop.editorType);

    console.log(localStorage.getItem("token"));
});

// 退出页面 确认是否保存草稿
// 组件销毁前，要及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    deleteNotusedImage();
    editor.destroy();
});

// 工具栏配置 和 编辑器配置
const toolbarConfig = {};
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: { // 图片上传
            fieldName: 'file',
            server: `http://localhost:8082/image/upload?type=queAndAns`,
            headers: {
                token: localStorage.getItem("token")
            }
        },
        insertImage: {
            onInsertedImage(imageNode) {
                if (imageNode == null) return;
                const { src, alt, url, href } = imageNode;
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
    const allMenuKeys = editor.getAllMenuKeys();
    // console.log('created', allMenuKeys);
    editorRef.value = editor; // 记录 editor 实例，重要！！！！
};
const handleChange = (editor) => {
    editorRef.value = editor;
    // console.log('change:', editor.getHtml());
};
const handleDestroyed = (editor) => {
    // console.log('destroyed', editor);
};
const handleFocus = (editor) => {
    // console.log('focus', editor);
};
const handleBlur = (editor) => {
    // console.log('blur', editor);
};
const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`);
};
// 粘贴事件处理 实现自己的粘贴逻辑
const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event);

    const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本

    // 自定义插入内容
    editor.insertText(text);

    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(false); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
};


// 话题 或 回答 提交事件处理
const publish = async () => {
    if (!ifInput()) {
        ElMessage("请先输入新内容！")
        return;
    } // 是否有新输入
    if (!ifInputNull()) return; // 输入规范

    if (prop.editorType === 'question') {
        // 上传新的话题数据
        await myrequest.insertQuestion(titleText.value, valueHtml.value, userStore.user.userId).then(async (response) => {
            if (response != null) {
                // 跳转到 Question 页面并显示新话题
                await queStore.fetchCurrentQuestion(response.data.queId).then(
                    ansStore.fetchQueAnswerList(response.data.queId)
                );// 获取新话题的数据

                router.push('/question');
            }
        })
    } else if (prop.editorType === 'answer') {
        // 上传新的回答数据
        await ansStore.insertAnswer(userStore.user.userId, queStore.currentQuestion.queId, valueHtml.value).then(() => {
            ElMessage.success("发表成功");

            // emit 返回话题组件 收起编辑器
            emit('ifCompleteAnswerEdit', true);
        })
    }
}

// 保存草稿事件处理
const saveWrite = async () => {

    if (!ifInput()) {
        ElMessage("请先输入新内容！")
        return;
    }

    // 上传草稿
    await myrequest.insertDraft(userStore.user.userId, prop.editorType, titleText.value, valueHtml.value).then(() => {
        ElMessage.success("保存成功");
    });

    saveDialogActive.value = false;

    ifSaveDraft.value = true;

    if (activeIndex.value === '2') {
        initEditContent();
    }
}

// 导航栏跳转
const handleSelect = (key, keyPath) => {
    if (activeIndex.value === '1') { // 从编辑器 切换到 草稿箱时
        if (ifInput() && ifSaveDraft.value === false) { // 编辑器已有输入 并且还未保存过
            saveDialogActive.value = true; // 文字提示 保存草稿处理
            newKey = key; // 取出导航栏索引 用于不保存处理 跳转组件
            if (saveDialogActive.value === false) { // 等文字提示处理完 再跳转
                activeIndex.value = key;
            }
        } else {
            activeIndex.value = key;
        }
    } else {
        activeIndex.value = key;
    }
}

// 监听输入变化 判断是否需要保存
watch(titleText, (newV, oldV) => {
    ifSaveDraft.value = false;
})

watch(valueHtml, (newV, oldV) => {
    ifSaveDraft.value = false;
})

// 保存的文字提示 不保存处理
const cancelSave = () => {
    saveDialogActive.value = false;
    activeIndex.value = newKey;
    // 初始化编辑器内容
    initEditContent();
}

// 从 草稿箱 编辑事件返回
const handleEditDraft = (data) => {
    titleText.value = data.draTitle;
    valueHtml.value = data.draContent;
    handleSelect("1", ["1"]);
}

// 输入规范
function ifInputNull() {
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
function ifInput() {
    if (titleText.value === '' && valueHtml.value === '<p>hello</p>') { // 等于初始状态
        return false;
    }
    return true;
}

// 初始化编辑器内容
function initEditContent() {
    titleText.value = '';
    valueHtml.value = '<p>hello</p>';
}

// 删除未使用图片
async function deleteNotusedImage() {
    const editor = editorRef.value;
    if (editor == null) return;

    // 对比图片列表
    const imageList2 = editor.getElemsByType('image');
    const result = compareImageList(imageList1, imageList2);
    if (result != null || result !== []) { // 删除未使用图片
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            const deletePath = extractPart(element.src);
            await myrequest.deleteImage(deletePath);
        }
    }
}

// 图片列表对比处理
function compareImageList(list1, list2) {
    const srcInList1 = new Set(list1.map(item => item.src));
    const srcInList2 = new Set(list2.map(item => item.src));

    return [
        ...list1.filter(item => !srcInList2.has(item.src)),
        ...list2.filter(item => !srcInList1.has(item.src))
    ];
}

// 提取 URL 部分 相对路径
function extractPart(originalUrl) {
    const urlParts = originalUrl.split('/');
    let extractedPart = "";
    if (urlParts.length > 4) {
        extractedPart = `${urlParts[4]}/${urlParts[5]}`;
    } else {
        extractedPart = 'Invalid URL';
    }
    return extractedPart;
}


</script>

<template>
    <div class="writting">
        <div class="container editor">
            <el-menu :default-active="activeIndex" class="editor-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">{{ prop.editorType === 'quesion' ? "编写话题" : "编写回答" }}</el-menu-item>
                <el-menu-item index="2">草稿箱</el-menu-item>
            </el-menu>
            <div v-if="activeIndex === '1'" style="border: 1px solid #ccc;margin-top: 10px;">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
                    style="border-bottom: 1px solid #ccc" />
                <textarea v-if="prop.editorType === 'question'" class="editor-title" v-model="titleText"
                    placeholder="请输入标题（100字以内）"></textarea>
                <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml"
                    style="height: 400px; overflow-y: hidden;border-bottom: 1px solid #ccc" @onCreated="handleCreated"
                    @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur"
                    @customAlert="customAlert" @customPaste="customPaste" />
            </div>
            <div class="draft" v-if="activeIndex === '2'">
                <Draft @editDraft="handleEditDraft" :draft-type="prop.editorType" />
            </div>
            <el-dialog v-model="saveDialogActive" title="有新的输入内容未保存" destroy-on-close>
                <span>是否要先保存草稿？</span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="cancelSave()">不保存</el-button>
                        <el-button type="primary" @click="saveWrite()">
                            保存
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <div v-if="prop.editorType === 'answer' && activeIndex === '1'" class="answer-footer">
                <el-button @click="saveWrite()">保存草稿</el-button>
                <el-button type="primary" @click="publish()">发表回答</el-button>
            </div>
        </div>
        <div class="footer" v-if="activeIndex === '1' && prop.editorType === 'question'">
            <div class="container footer-container">
                <el-button @click="saveWrite()">保存草稿</el-button>
                <el-button type="primary" @click="publish()">发布话题</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.writting {
    min-height: 100vh;
    /* 确保容器高度至少占满视口 */
    overflow: visible;
    /* 防止溢出限制定位 */
}

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

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    background: white;
    border-top: 1px solid #d0d0d0;
}

.footer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}
</style>