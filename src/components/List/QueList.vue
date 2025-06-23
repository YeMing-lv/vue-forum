<script setup>
import { useRoute, useRouter } from 'vue-router';
import { CaretTop } from '@element-plus/icons-vue';
import { useQueStore } from '../../store/quePinia';
import { useAnsStore } from '../../store/ansPinia';
import { computed, onMounted, ref, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const queStore = useQueStore();
const ansStore = useAnsStore();

const props = defineProps(['questionList']); // 接收话题列表数据

const answerIsAgree = computed(() => ansStore.answerIsAgree);// 已点赞的 回答

const displayQueList = ref(7); // 初始渲染的话题数

const ifShowMore = ref(false); // 是否已显示完列表 或 是否还有数据可以显示

onMounted(() => {
    // 是否还有列表数据要显示
    if (props.questionList.length > displayQueList.value) {
        ifShowMore.value = true;
    } else {
        ifShowMore.value = false;
    }
})

// 跳转到话题页面，要先获取que话题和对应ans回答数据
const toQuestion = async (id) => {
    await queStore.fetchCurrentQuestion(id).then(
        ansStore.fetchQueAnswerList(id)
    )
    router.push('/question');
}

// 赞同点击事件
const agree = async (ansId) => {
    if (answerIsAgree.value.includes(ansId)) { // 已经点赞过了
        await queStore.updateAnswerLikeNum('down', ansId);
        ansStore.deleteAgreedAnswer(ansId);
    } else { // 还没点赞过
        await queStore.updateAnswerLikeNum('up', ansId);
        ansStore.addAgreedAnswer(ansId);
    }
}

// 显示更多的话题
const showMoreQueList = () => {
    const listLength = props.questionList.length;
    
    if (listLength <= displayQueList.value) return; // 没有更多列表数据了

    displayQueList.value = displayQueList.value + 4;
}

// 监听 是否还有显示数据
watch(displayQueList, (newV, oldV) => {
    if (props.questionList.length > newV) {
        ifShowMore.value = true;
    } else {
        ifShowMore.value = false;
    }
})

</script>

<template>
    <div class="content-list" v-for="que in props.questionList.slice(0, displayQueList)">
        <div class="content-title" @click="toQuestion(que.question.queId)">{{ que.question.queTitle }}</div>
        <div class="content-answer" @click="toQuestion(que.question.queId)">
            <div v-if="que.user != null" class="content-answer-user">
                <img :src="que.user.userHead" style="width: 40px;margin-right: 10px;" alt="userHead">
                {{ que.user.userName }}:
            </div>
            <span v-if="que.answer != null" class="ans-content" v-html="que.answer.ansContent"></span>
        </div>
        <el-button v-if="que.answer != null" type="primary" plain @click="agree(que.answer.ansId)">
            <el-icon style="margin-right: 5px;">
                <CaretTop />
            </el-icon>
            赞同{{ que.answer.ansLikeNum }}
        </el-button>
        <el-divider></el-divider>
    </div>
    <div v-if="ifShowMore === true" class="list-more" @click="showMoreQueList">
        查看更多话题
    </div>
    <div v-if="ifShowMore === false" class="list-end">
        已经到底了
    </div>
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
    margin-bottom: 5px;
    font-size: 14px;
    cursor: pointer;
}

.content-answer:hover {
    color: rgb(99, 99, 99);
}

.content-answer-user {
    display: flex;
    align-items: center;
}

.content-answer .ans-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    word-break: break-all;
    /* 允许单词内断行（可选） */
}

.list-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    font-weight: 300;
    background: #fff;
    cursor: pointer;
}

.list-more:hover {
    font-weight: 550;
}

.list-end {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    background: #fff;
}
</style>