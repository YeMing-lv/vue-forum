<script setup>
import { useRouter } from 'vue-router';
import { useAnsStore } from '../../../store/ansPinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { throttle } from '../../../utils/throttle';
import { formatUTCtoLocal } from '../../../utils/timeUtils';
import { Collection, ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';

const router = useRouter();
const ansStore = useAnsStore();

const props = defineProps(['userId']);
const answerList = computed(() => ansStore.answerList);

const ifDESC = ref(true);
const ifNull = ref(false);
const ifLoading = ref(false);
const ifShowMore = ref(false);

onMounted(async () => {
    ifLoading.value = true;

    ansStore.init();
    await ansStore.fetchAnswerListByAuthorId(props.userId, 'DESC');

    handleIfNull();

    ifLoading.value = false;
})

onUnmounted(() => {
    ansStore.init();
})

const handleScrollShowMore = async () => {
    if (ifShowMore.value) {
        // 调用分页查询
        if (ifDESC) {
            await ansStore.fetchAnswerListByAuthorId(props.userId, 'DESC');
        } else {
            await ansStore.fetchAnswerListByAuthorId(props.userId, 'ASC');
        }

        handleIfShowMore();
    }
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 切换 时间排序
const handleOrder = async () => {
    ifLoading.value = true;

    // 修改排序参数
    ifDESC.value = !ifDESC.value;
    let order = null;
    if (ifDESC.value) {
        order = 'DESC';
    } else {
        order = 'ASC';
    }

    // 初始化列表
    ansStore.init();
    await ansStore.fetchAnswerListByAuthorId(props.userId, order).then((result) => {
        if (result) {
            ifLoading.value = false;
        }
    })
}

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

// 判断列表是否为空
function handleIfNull() {
    if (answerList.value.length === 0) {
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

const replaceHTMLToText = (html) => {
    return html.replace(/<[^>]+>/g, '');
}
</script>

<template>
    <div class="top">
        <el-button style="margin-left: auto;" text @click="handleOrder()">
            {{ ifDESC ? '按照时间升序排序' : '按照时间降序排序' }}
            <el-icon v-if="ifDESC">
                <ArrowUpBold />
            </el-icon>
            <el-icon v-if="!ifDESC">
                <ArrowDownBold />
            </el-icon>
        </el-button>
    </div>
    <div v-infinite-scroll="throttledScrollHandler" class="userAnswer-list">
        <div v-if="!ifNull" class="list-item" v-for="a in answerList">
            <div class="content">
                <span>{{ formatUTCtoLocal(a.answer.ansTime) }}</span>
                <div class="title" v-if="a.queTitle != null">
                    <span>{{ a.queTitle }}</span>
                </div>
                <div class="title" v-if="a.artTitle != null">
                    {{ a.artTitle }}
                </div>
                <div class="ansContent">
                    我的回答：{{ replaceHTMLToText(a.answer.ansContent) }}
                </div>
            </div>
            <el-button type="primary" disabled style="margin-top: 5px;">点赞数{{ a.answer.ansLikeNum }}</el-button>
            <el-divider></el-divider>
        </div>
        <div v-if="ifNull" class="null">
            <el-icon size="100px">
                <Collection />
            </el-icon>
            你还没有写过回答！
        </div>
        <el-skeleton v-if="ifLoading" />
    </div>
</template>

<style lang="scss" scoped>
.top {
    display: flex;
    position: relative;
}

.userAnswer-list {
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

            .ansContent {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }

        .foot {
            margin-top: 5px;
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