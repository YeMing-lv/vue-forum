<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { formatUTCtoLocal } from '../../utils/timeUtils.js';
import { useAnsStore } from '../../store/ansPinia.js';
import { throttle } from '../../utils/throttle';
import FollowButton from '../Button/FollowButton.vue';
import LikeButton from '../Button/LikeButton.vue';

const ansStore = useAnsStore();

const props = defineProps(['parentId', 'type']);
const answerList = computed(() => ansStore.answerList); // 回答列表
const total = computed(() => ansStore.page.total);

const ifLoading = ref(false);
const ifShowMore = ref(false);

onMounted(async () => {
    ifLoading.value = true; // 显示加载动画
    ansStore.init();

    // 获取列表
    await ansStore.fetchAnswerList(props.type, props.parentId).then(() => {
        ifLoading.value = false; // 隐藏加载动画
    });

    // console.log(answerList.value);

    handleIfShowMore();
    // 页面下滑事件监听
    window.addEventListener('scroll', throttledScrollHandler);
});

onUnmounted(() => {
    // 数据初始化
    ansStore.init();
    // 销毁监听器
    window.removeEventListener('scroll', throttledScrollHandler);
})

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
            // 调用新分页函数
            await ansStore.fetchAnswerList(props.type, props.parentId);

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
    if (answerList.value != null) {
        if (answerList.value.length < ansStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

</script>

<template>
    <div class="answer">
        <div class="ans-number">全部{{ total }}个回答</div>
        <hr style="width: 98%;margin: 0 auto;">
        <div class="ans-container" v-for="ans in answerList">
            <div class="ans-author">
                <img class="ans-head" :src="ans.userHead" alt="ansAuthorHead">
                <div class="ans-name">{{ ans.userName }}</div>
                <FollowButton :followedId="ans.userId" type="user" parentType="answer" />
            </div>
            <span class="ans-content" v-html="ans.ansContent"></span>
            <div class="ans-time">编辑于：{{ formatUTCtoLocal(ans.ansTime) }}</div>
            <LikeButton v-model="ans.ansLikeNum" :likeId="ans.ansId" type="answer" />
            <br>
        </div>
        <el-divider></el-divider>
        <el-main v-if="ifLoading">
            <el-skeleton />
        </el-main>
    </div>
</template>

<style scoped>
.answer {
    margin: 0 auto;
}

.ans-number {
    padding: 20px;
    font-weight: 800;
}

.ans-container {
    padding: 20px;
}

.ans-author {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.ans-head {
    width: 40px;
    border-radius: 10%;
}

.ans-name {
    flex-grow: 2;
    margin: 0 10px;
}

.ans-content {
    margin-bottom: 5px;
    line-height: 30px;
}

.ans-time {
    margin-bottom: 10px;
    font-size: small;
    font-weight: 200;
}

.ans-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    font-weight: 300;
    background: #fff;
    cursor: pointer;
}

.ans-more:hover {
    font-weight: 550;
}

.ans-end {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    background: #fff;
}
</style>