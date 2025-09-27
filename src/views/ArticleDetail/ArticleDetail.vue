<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import Answer from '../../components/List/AnswerList.vue';
import Editor from '../../components/Editor/Editor.vue';
import FollowButton from '../../components/Button/FollowButton.vue';
import { useArtStore } from '../../store/artPinia';
import { formatUTCtoLocal } from '../../utils/timeUtils';

const route = useRoute();
const artStore = useArtStore();

const artId = route.query.id;
const currentArticle = computed(() => artStore.currentArticle);
const author = computed(() => artStore.author);

const ifLoading = ref(false);
const ifEdit = ref(false); // 编辑器的显示

// 发送请求 获取指定文章数据
onMounted(async () => {

    ifLoading.value = true;
    artStore.init();

    // console.log(artId);
    await artStore.fetchCurrentArticle(artId);

    document.title = currentArticle.value.artTitle;

    ifLoading.value = false;
})

onUnmounted(() => {
    artStore.init();
})

// 控制编辑器
const handleEditor = () => {
    ifEdit.value = !ifEdit.value;
}

// 编辑完成
const editComplete = () => {
    ifEdit.value = false;
}

</script>

<template>
    <div class="articleDetail">
        <Header headerNav="0" />
        <div class="container content">
            <div v-if="currentArticle != null" class="main">
                <div class="main-title">{{ currentArticle.artTitle }}</div>
                <span class="main-author-name">{{ author.userName }}&nbsp;{{ formatUTCtoLocal(currentArticle.artTime) }}</span>
                <span class="main-content" v-html="currentArticle.artContent"></span>
                <el-divider></el-divider>
                <div class="main-answer">
                    <el-button @click="handleEditor">{{ ifEdit ? "编写评论" : "写评论" }}</el-button>
                    <div v-if="ifEdit" class="editor">
                        <Editor editor-type="answer" @ifCompleteAnswerEdit="editComplete" />
                    </div>
                    <div class="">
                        <Answer :parentId="currentArticle.artId" type="article" />
                    </div>
                </div>
            </div>
            <div class="aside">
                <div v-if="author != null" class="aside-author">
                    <div class="author-legend">关于作者</div>
                    <div class="author-top">
                        <img :src="author.userHead" alt="" style="width: 60px;border-radius: 10%;">
                        <div class="author-top-right">
                            <div class="author-name">{{ author.userName }}</div>
                            <div class="author-intro">{{ author.userIntro }}</div>
                        </div>
                    </div>
                    <div class="author-middle">
                        <div class="author-answer">回答<br>{{ author.userAnswerNum }}</div>
                        <div class="author-question">话题<br>{{ author.userQuestionNum }}</div>
                        <div class="author-followers">关注者<br>{{ author.userFollowersNum }}</div>
                    </div>
                    <div class="author-bottom">
                        <FollowButton :followedId="author.userId" type="user" parentType="article" />
                    </div>
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<style scoped>
.content {
    display: flex;
    margin-top: 10px;
    padding: 10px;
}

.main {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    margin-right: 10px;
    padding: 20px;
    width: 100%;
    max-width: 700px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.main-title {
    font-size: large;
    text-align: center;
}

.main-author-name {
    margin: 0 auto;
    font-size: small;
    font-weight: 800;
}

.main-content {
    display: flex;
    flex-direction: column;
}

/* 使用 ::v-deep 突破 scoped 样式限制 */
::v-deep .main-content img {
    max-width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
    width: auto !important;
    /* 覆盖内联 width="1000px" */
}

.main-answer .editor {
    display: flex;

    align-items: center;
}

.aside {
    min-width: 270px;
    height: 300px;
}

.aside-author {
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.author-legend {
    padding: 20px;
    padding-bottom: 10px;
    font-weight: 800;
}

.author-top {
    display: flex;
    align-items: center;
    padding: 20px;
}

.author-top-right {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.author-top-right .author-name {
    font-size: large;
    font-weight: 800;
}

.author-intro {
    font-size: small;
}

.author-middle {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
}

.author-answer {
    margin: 10px;
    margin-right: 20px;
}

.author-question {
    margin: 10px;
    margin-right: 20px;
}

.author-followers {
    margin: 10px;
    margin-right: 20px;
}

.author-bottom {
    display: flex;
    justify-content: center;
    padding: 20px;
    padding-top: 0;
}
</style>