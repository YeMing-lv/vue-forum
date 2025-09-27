<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LikeButton from '../../../components/Button/LikeButton.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/userPinia';
import { throttle } from '../../../utils/throttle';
import { formatUTCtoLocal } from '../../../utils/timeUtils';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps(['activeMenu'])
const userActions = computed(() => userStore.userActions);

const ifLoading = ref(false);
const ifShowMore = ref(false);

onMounted(async () => {
    ifLoading.value = true;

    // 获取 用户动态 数据列表
    userStore.initUserActions();
    await userStore.fetchUserActions();

    handleIfShowMore();
    ifLoading.value = false;
})

onUnmounted(() => {
    userStore.initUserActions();
})

const handleScrollShowMore = async () => {
    if (ifShowMore.value) {
        // 调用分页查询
        await userStore.fetchUserActions();

        handleIfShowMore();
    }
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 是否还有列表数据要显示
function handleIfShowMore() {
    // console.log(questionList.value);
    // console.log(queStore.page.total);
    if (userActions.value != null) {
        if (userActions.value.length < userStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

// 辨别 动态类别 英文改为中文
const distinguishEventType = (eventType) => {
    let result = '';
    switch (eventType) {
        case 'follow':
            result = '关注';
            break;
        case 'like':
            result = '点赞';
            break;
        case 'create':
            result = '创建';
            break;
        default:
            result = '';
    }
    return result;
}

// 辨别 动态操作对象类型
const distinguishElementName = (elementName) => {
    let result = '';
    switch (elementName) {
        case 'question':
            result = '话题';
            break;
        case 'answer':
            result = '回答';
            break;
        case 'article':
            result = '文章';
            break;
        case 'user':
            result = '用户';
            break;
        default:
            result = '';
    }
    return result;
}

// HTML格式改为纯文本
const changeHTMLToText = (html) => {
    return html.replace(/<[^>]+>/g, '');
}

// 跳转 话题页面
const toQuestion = (id) => {
    router.push({
        path: '/question',
        query: { id: id }
    })
}

// 跳转 文章页面
const toArticle = (id) => {
    router.push({
        path: '/article',
        query: { id: id }
    })
}

</script>

<template>
    <div v-infinite-scroll="throttledScrollHandler">
        <div class="userActions-list" v-for="ua in userActions">
            <div class="top">
                <span>{{ distinguishEventType(ua.eventType) }}了{{ distinguishElementName(ua.elementName) }}</span>
                <span>{{ formatUTCtoLocal(ua.time) }}</span>
            </div>
            <div class="content answer" v-if="ua.questionWithFirstAnswer != null" @click="toQuestion(ua.questionWithFirstAnswer.queId)">
                <span class="title">{{ ua.questionWithFirstAnswer.queTitle }}</span>
                <div class="ans-author">
                    <img class="ans-head" :src="ua.questionWithFirstAnswer.answerWithUser.userHead" alt="ansAuthorHead">
                    <div class="ans-name">{{ ua.questionWithFirstAnswer.answerWithUser.userName }}</div>
                </div>
                <span class="ans-content">{{ changeHTMLToText(ua.questionWithFirstAnswer.answerWithUser.ansContent)
                    }}</span>
                <div class="ans-time">编辑于：{{ formatUTCtoLocal(ua.questionWithFirstAnswer.answerWithUser.ansTime) }}
                </div>
                <LikeButton v-model="ua.questionWithFirstAnswer.answerWithUser.ansLikeNum"
                    :likeId="ua.questionWithFirstAnswer.answerWithUser.ansId" type="answer" />
                <br>
            </div>

            <div class="content" v-if="ua.voQuestion != null" @click="toQuestion(ua.voQuestion.queId)">
                <span class="title">{{ ua.voQuestion.queTitle }}</span>
            </div>
            <div class="content" v-if="ua.voArticle != null">
                <span class="title">{{ ua.voArticle.artTitle }}</span>
            </div>
            <div class="content voUser" v-if="ua.voUser != null" @click="toArticle(ua.voArticle.artId)">
                <img style="width: 40px;" :src="ua.voUser.userHead" alt="avator">
                <span>{{ ua.voUser.userName }}<br>{{ ua.voUser.userIntro }}</span>
            </div>
            <el-divider></el-divider>
        </div>
        <el-skeleton v-if="ifLoading" />
    </div>
</template>

<style lang="scss" scoped>
.userActions-list {
    display: flex;
    flex-direction: column;

    .top {
        display: flex;
        font-size: 14px;
        font-weight: 200px;
    }

    .top span:last-child {
        margin-left: auto;
    }

    .content {
        cursor: pointer;
    }

    .title {
        font-size: large;
        font-weight: bolder;
    }

    .answer {
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
            display: -webkit-flex;
            flex-direction: column;
            -webkit-line-clamp: 3;
            overflow: hidden;
            margin-bottom: 5px;
            line-height: 30px;

        }

        .ans-time {
            margin-bottom: 10px;
            font-size: small;
            font-weight: 200;
        }
    }

    .voUser {
        display: flex;
    }

}

.userActions-list:nth-child(1) {
    margin-top: 10px;
}
</style>