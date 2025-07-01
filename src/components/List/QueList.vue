<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useQueStore } from '../../store/quePinia';
import { useAnsStore } from '../../store/ansPinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { throttle } from '../../utils/throttle';

import LikeButton from '../Button/LikeButton.vue';

const route = useRoute();
const router = useRouter();
const queStore = useQueStore();

const props = defineProps(['type', 'keyword']); // 类别 和 关键词（用于调用分页查询）

const questionList = computed(() => queStore.questionList); // 话题列表

const ifLoading = ref(false); // 加载状态
const ifShowMore = ref(false); // 是否还有数据可以显示

// 获取话题列表数据
onMounted(async () => {
    ifLoading.value = true; // 显示加载动画
    queStore.initList();

    // 获取列表
    if (props.type === 'recommend') {
        await queStore.fetchQuestionList("recommend").then(() => {
            ifLoading.value = false; // 隐藏加载动画

        });
    } else if (props.type === 'search') {
        await queStore.fetchSearchQuestionList(props.keyword).then(() => {
            ifLoading.value = false;
        })
    }

    handleIfShowMore();
    // console.log(ifShowMore.value);

    // 页面下滑事件监听
    window.addEventListener('scroll', throttledScrollHandler);
})

onUnmounted(() => {
    // 数据初始化
    queStore.initList();
    // 销毁监听器
    window.removeEventListener('scroll', throttledScrollHandler);
})

// 跳转到话题页面，要先获取que话题和对应ans回答数据
const toQuestion = (id) => {
    router.push({
        path: '/question',
        query: { id: id }
    });
}

// 滚动 显示更多的话题
const handleScrollShowMore = async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    // console.log(scrollTop + clientHeight)
    // console.log(scrollHeight)

    ifLoading.value = true; // 显示加载动画
    // 当滚动到底部时触发
    // ??? 不灵敏 ???
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (ifShowMore.value) {

            // console.log("showMore")
            // 获取 新分页
            // 1.更新页面参数
            if (queStore.page.currentPage === 1) { // 第一次分页后从 第3页开始
                queStore.page.currentPage = 3;
            } else {
                queStore.page.currentPage++; // 增加页码
            }
            if (queStore.page.pageSize !== 3) { // 尺寸改为3
                queStore.page.pageSize = 3;
            }
            // 2.调用新分页函数
            if (props.type === 'recommend') {
                await queStore.fetchQuestionList(props.type);
            } else if (props.type === 'search') {
                await queStore.fetchSearchQuestionList(props.keyword);
            }

            handleIfShowMore();


        }
    }
    ifLoading.value = false; // 隐藏加载动画
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 是否还有列表数据要显示
function handleIfShowMore() {
    // console.log(questionList.value);
    // console.log(queStore.page.total);
    if (questionList.value != null) {
        if (questionList.value.length < queStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

// HTML改为纯文字
const changeHTMLToText = (html) => {
    return html.replace(/<[^>]+>/g, '');
}

</script>

<template>
    <div class="content-list" v-for="que in questionList" :key="que.queId">
        <div class="content-title" @click="toQuestion(que.queId)">{{ que.queTitle }}</div>
        <div v-if="que.answerWithUser.ansId != null" class="content-answer" @click="toQuestion(que.queId)">
            <div class="ans-head">
                <img :src="que.answerWithUser.userHead" style="width: 40px;border-radius: 10%;" alt="userHead">
            </div>
            <span class="ans-content">{{ que.answerWithUser.userName }}：{{
                changeHTMLToText(que.answerWithUser.ansContent) }}</span>
        </div>
        <LikeButton :likeNum="que.answerWithUser.ansLikeNum" :likeId="que.answerWithUser.ansId" type="queListAnswer"/>
        <el-divider style="width: 97%;"></el-divider>
    </div>
    <el-main v-loading="ifLoading"></el-main>
</template>

<style scoped>
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
    display: flex;
    margin-bottom: 5px;
    font-size: 14px;
    cursor: pointer;
}

.content-answer:hover {
    color: rgb(99, 99, 99);
}

.content-answer .ans-head {
    width: 60px;
    height: auto;
    margin-right: 10px;
}

.content-answer .ans-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    word-break: break-all;
}
</style>