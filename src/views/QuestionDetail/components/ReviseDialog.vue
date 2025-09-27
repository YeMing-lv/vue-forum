<script setup>
import myrequest from '../../../api/request';

import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, shallowRef, reactive, ref } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import { ElMessage } from 'element-plus';
import { updateQuestion } from '../../../api/Question/QuestionApi';

const props = defineProps(['question']); // 直接修改传入的完整Question
const dialogVisible = defineModel();

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef，重要！
const input = reactive({
    title: props.question.queTitle,
    content: props.question.queContent
})

const ifLoading = ref(false);

// 组件销毁前，要及时销毁编辑器，重要！
onBeforeUnmount(() => {
    editorRef.value = null;
});

// 工具栏配置 和 编辑器配置
const toolbarConfig = {
    toolbarKeys: [
        'bold', 'underline', 'header1', '|',
        'bulletedList', 'numberedList', '|',
        'blockquote', 'codeBlock', '|',
        'divider', 'undo'
    ]
};
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
    }
};

// 编辑器回调函数
const handleCreated = (editor) => {
    // 查看所有实现的 菜单
    const allMenuKeys = editor.getAllMenuKeys();
    console.log('created', allMenuKeys);
    editorRef.value = editor; // 记录 editor 实例，重要！！！！
};

// 话题 或 回答 提交事件处理
const publish = async () => {
    ifLoading.value = true;
    if (!ifInputNew()) {
        ElMessage("请先输入新内容！")
        ifLoading.value = false;
        return;
    } // 是否有新输入
    if (!ifInputNull()) {
        ifLoading.value = false;
        return; // 输入规范
    }

    // 设置下 修改后的 Question对象
    let question = props.question;
    question.queTitle = input.title;
    question.queContent = input.content;

    // 更新 话题数据
    await updateQuestion(question).then((result) => {
        if (result.success) { // 后端更新成功
            ElMessage.success("修改话题成功！");
            // 前端自行更新
            props.question.queTitle = input.title;
            props.question.queContent = input.content;
        }
        ifLoading.value = false;
        // 关闭 对话框
        dialogVisible.value = false;
    });
}

// 输入规范
function ifInputNull() {
    if (input.title === '') {
        ElMessage("请输入标题！");
        return false;
    } else if (input.title.length < 6) {
        ElMessage("标题字数过少！");
        return false;
    } else if (input.content === '') {
        ElMessage("请输入内容！");
        return false;
    } else if (input.content.length < 10) {
        ElMessage("内容过少！");
        return false;
    }
    return true;
}

// 判断是否有新内容
function ifInputNew() {
    if (input.title === props.question.queTitle && input.content === props.question.queContent) { // 等于初始状态
        return false;
    }
    return true;
}

</script>

<template>
    <el-dialog v-loading="ifLoading" v-model="dialogVisible" class="dialog">
        <el-input v-model="input.title">
            <template #prepend>
                标题
            </template>
        </el-input>
        <div class="describe-legend">话题描述:</div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="input.content"
            style="min-height: 250px; overflow-y: hidden;border-bottom: 1px solid #ccc" @onCreated="handleCreated" />
        <div class="buttons">
            <el-button type="primary" @click="publish">提交</el-button>
            <el-button type="danger" @click="() => dialogVisible = false">关闭</el-button>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.dialog {
    display: flex;
    flex-direction: column;

    .describe-legend {
        margin: 10px 0;
        font-size: large;
        font-weight: bolder;
    }

    .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
    }
}
</style>