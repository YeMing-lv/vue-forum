<script setup>
import { useRouter } from 'vue-router';
import { useQueStore } from '../../../store/quePinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { throttle } from '../../../utils/throttle';
import { formatUTCtoLocal } from '../../../utils/timeUtils';

const router = useRouter();
const queStore = useQueStore();

const props = defineProps(['userId']);
const questionList = computed(() => queStore.questionList);

const ifNull = ref(false);
const ifLoading = ref(false);
const ifShowMore = ref(false);

onMounted(async () => {
    ifLoading.value = true;

    queStore.initList();
    await queStore.fetchQuestionByAuthorId(props.userId);

    handleIfNull();

    ifLoading.value = false;
})

onUnmounted(() => {
    queStore.initList();
})

const handleScrollShowMore = async () => {
    if (ifShowMore.value) {
        // 调用分页查询
        await queStore.fetchQuestionByAuthorId(props.userId);

        handleIfShowMore();
    }
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 是否还有列表数据要显示
function handleIfShowMore() {
    if (questionList.value != null) {
        if (questionList.value.length < queStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

// 判断列表是否为空
function handleIfNull() {
    if (questionList.value.length === 0) {
        ifNull.value = true;
    } else {
        ifNull.value = false;
    }
}

// 跳转 话题页面
const toQuestion = (id) => {
    router.push({
        path: '/question',
        query: { id: id }
    })
}
</script>

<template>
    <div v-infinite-scroll="throttledScrollHandler" class="userQuetion-list">
        <div v-if="!ifNull" class="list-item" v-for="q in questionList">
            <div class="content" @click="toQuestion(q.queId)">
                <span class="title">{{ q.queTitle }}</span>
            </div>
            <div class="foot">
                <span>{{ formatUTCtoLocal(q.time) }}；{{ q.queAtteNum }}个关注；{{ q.queAnsNum }}个回答；{{ q.queLikeNum
                }}个点赞</span>
            </div>
            <el-divider></el-divider>
        </div>
        <div v-if="ifNull" class="null">
            <el-icon size="100px">
                <Collection />
            </el-icon>
            你还没有创建话题！
        </div>
        <el-skeleton v-if="ifLoading" />
    </div>
</template>

<style lang="scss" scoped>
.userQuetion-list {
    display: flex;
    position: relative;
    flex-direction: column;

    .list-item {
        margin-top: 10px;

        .content {
            margin-top: 5px;
            cursor: pointer;

            .title {
                font-size: large;
                font-weight: bolder;
            }
        }

        .foot {
            display: flex;
            font-size: 14px;
            font-weight: 200px;
        }
    }

    .null {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

}
</style>