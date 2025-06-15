<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from './other/Header.vue';
import { CaretTop } from '@element-plus/icons-vue';
import { useQueStore } from '../other/store/quePinia';
import { useAnsStore } from '../other/store/ansPinia';
import { useNavStore } from '../other/store/navPinia';
import { computed, onBeforeMount, onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const queStore = useQueStore();
const ansStore = useAnsStore();
const navStore = useNavStore();

const questionList = computed(() => queStore.questionList);

const answerIsAgree = computed(() => ansStore.answerIsAgree);

const displayQuestionList = ref(questionList.value.slice(0, 10));

const activeMenuIndex = ref('2');


onBeforeMount(async () => {
    await queStore.fetchQuestionList("recommend");
})

onMounted(() => navStore.headerNavActive = 1);

// 跳转到话题页面，要先获取que话题和对应ans回答数据
const toQuestion = async (id) => {
    await queStore.fetchCurrentQuestion(id).then(
        ansStore.fetchQueAnswerList(id)
    )
    router.push('/question');
}

// 导航栏 选择处理
const handleSelect = () => {

}

// 赞同点击事件
const agree = async (ansId) => {
    if (answerIsAgree.value.includes(ansId)) { // 已经点赞过了
        await queStore.updateAnswerLikeNum('down', ansId);
        displayQuestionList.value[displayQuestionList.value.findIndex(item => item.answer.ansId === ansId)].answer.ansLikeNum--;
        ansStore.deleteAgreedAnswer(ansId);
    } else { // 还没点赞过
        await queStore.updateAnswerLikeNum('up', ansId);
        displayQuestionList.value[displayQuestionList.value.findIndex(item => item.answer.ansId === ansId)].answer.ansLikeNum++;
        ansStore.addAgreedAnswer(ansId);
    }
}

</script>

<template>
    <div class="main">
        <Header />
        <div class="container content">
            <div class="content-question">
                <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal"
                    @select="handleSelect()">
                    <el-menu-item index="1">关注</el-menu-item>
                    <el-menu-item index="2">推荐</el-menu-item>
                    <el-menu-item index="3">热榜</el-menu-item>
                </el-menu>
                话题部分<el-button @click="toQuestion(101103)">测试话题组件</el-button>
                <div class="content-list" v-for="que in displayQuestionList">
                    <div class="content-title" @click="toQuestion(que.question.queId)">{{ que.question.queTitle }}</div>
                    <div class="content-answer" @click="toQuestion(que.question.queId)">
                        {{ que.userName }}:
                        <span class="ans-content" v-html="que.answer.ansContent"></span>
                    </div>
                    <el-button type="primary" plain @click="agree(que.answer.ansId)">
                        <el-icon style="margin-right: 5px;">
                            <CaretTop />
                        </el-icon>
                        赞同{{ que.answer.ansLikeNum }}
                    </el-button>
                    <el-divider></el-divider>
                </div>
            </div>
            <div class="content-aside">
                <div>
                    小创作中心
                </div>
                <!-- <div>
                    文章推荐
                </div>
                <div>
                    推荐关注
                </div> -->
            </div>
            <el-backtop :right="100" :bottom="100" />
        </div>
        <!-- <el-footer style="border: 1px solid">Footer</el-footer> -->
    </div>
</template>

<style scoped>
.content {
    display: flex;
    width: 1050px;
    margin: 10px auto;
}

.content-question {
    flex-grow: 2;
    margin-right: 10px;
    padding: 10px;
    box-shadow: 0 1px 8px #d0d0d0;

}

.content-list {
    padding: 0 10px;
    min-width: 100%;
}

.content-title {
    margin-bottom: 5px;
    font-size: large;
    font-weight: 800;
    cursor: pointer;
}

.content-title:hover {
    color: #409eff;
}

.content-answer {
    margin-bottom: 5px;
    font-size: 14px;
    cursor: pointer;
}

.content-answer:hover {
    color: rgb(99, 99, 99);
}

.content-answer .ans-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    word-break: break-all;
    /* 允许单词内断行（可选） */
}

.content-aside {
    min-width: 270px;
    padding: 10px;
    box-shadow: 0 1px 8px #d0d0d0;

}
</style>