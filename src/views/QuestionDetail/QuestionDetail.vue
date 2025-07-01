<script setup>
import { useRoute } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import AnswerList from '../../components/List/AnswerList.vue';
import Editor from '../../components/Editor/Editor.vue';
import FollowButton from '../../components/Button/FollowButton.vue';
import LikeButton from '../../components/Button/LikeButton.vue';

import { useQueStore } from '../../store/quePinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { EditPen } from '@element-plus/icons-vue';

const route = useRoute();
const queStore = useQueStore();

const queId = route.query.id;

// 当前话题的数据
const currentQuestion = computed(() => queStore.currentQuestion);
const tagList = computed(() => {
    return currentQuestion.value?.queTag?.split(',') || []; // ????????
});
const author = computed(() => queStore.author);

const ifLoading = ref(false);
const ifEdit = ref(false); // 控制编辑器显示


// 获取话题详情
onMounted(async () => {

    queStore.initDetail();
    // 获取数据
    await queStore.fetchCurrentQuestion(queId);

    // 进入详情页自动增加话题浏览数
    if (queStore.currentQuestion != null) {
        queStore.increaseQueBrowseNum(queId);
    }
});

onUnmounted(() => {
    // 销毁数据
    queStore.initDetail();
})

// 完成回答编辑 隐藏编辑器
const handleEditor = (data) => {
    ifEdit.value = !ifEdit.value;
}

</script>

<template>
    <div class="question">
        <Header headerNav="0" />

        <div v-if="currentQuestion" class="que-header">
            <div class="que-header-left">
                <el-tag v-for="tag in tagList" :key="tag" style="margin: 0 10px 10px 0;">
                    {{ tag }}
                </el-tag>
                <div class="title">{{ currentQuestion.queTitle }}</div>
                <div class="content" v-html="currentQuestion.queContent"></div>
                <div class="other">
                    <FollowButton :followedId="currentQuestion.queId" type="question"/>

                    <el-button @click="handleEditor"><el-icon>
                            <EditPen />
                        </el-icon>{{ ifEdit ? "编辑回答" : "写回答" }}</el-button>
                        
                    <div class="like">
                        <LikeButton :likeNum="currentQuestion.queLikeNum" :likeId="currentQuestion.queId" type="question" />
                    </div>
                </div>
            </div>
            <div class="que-header-right">
                <div class="attention">关注者<br><span style="font-weight: 800;">{{ currentQuestion.queAtteNum }}</span>
                </div>
                <div>浏览数<br><span style="font-weight: 800;">{{ currentQuestion.queBrowseNum }}</span></div>
            </div>
        </div>

        <div class="container">
            <Editor v-if="ifEdit" editor-type="answer" @if-complete-answer-edit="handleEditor" />
        </div>

        <div class="container que-content">
            <div class="que-answer">
                <AnswerList :parentId="queId" type="question"/>
            </div>
            <div class="que-aside">
                <div v-if="author" class="aside-author">
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
                        <FollowButton :followedId="author.userId" type="user" parentType="question"/>
                    </div>
                </div>
                <div>
                    推荐
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<style scoped>
.que-header {
    display: flex;
    margin: 0 auto 10px auto;
    padding: 10px 150px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.que-header-left {
    flex-grow: 2;
    margin-right: 10px;
    padding: 10px;
}

.que-header-left .title {
    margin: 10px auto 0 auto;
    font-weight: 800;
    font-size: 24px;
}

.que-header-left .content {
    margin: 10px auto 0 auto;
}

.que-header-left .other {
    display: inline-flex;
    align-items: center;
    margin: 10px auto 0 auto;
}

.que-header-left .like {
    display: inline-flex;
    margin: auto 10px;
    align-items: center;
    cursor: pointer;
}

.que-header-right {
    display: inline-flex;
    padding: 10px;
    text-align: center;
    min-width: 200px;
}

.que-header-right .attention {
    display: inline;
    height: 50px;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px #d0d0d0 solid;
}

.que-content {
    display: flex;
    width: 1050px;
    margin: 0 auto;
}

.que-answer {
    min-width: 770px;
    margin-right: 10px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.que-aside {
    min-width: 270px;
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

.author-name {
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