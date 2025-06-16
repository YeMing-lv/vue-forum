<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { CaretTop } from '@element-plus/icons-vue';
import { formatUTCtoLocal } from '../other/utils/timeUtils.js';
import { useAnsStore } from '../other/store/ansPinia';
import { useUserStore } from '../other/store/userPinia.js';
import { fa } from 'element-plus/es/locales.mjs';

const ansStore = useAnsStore();
const userStore = useUserStore();

const answerList = computed(() => ansStore.answerList);
const answerIsAgree = computed(() => ansStore.answerIsAgree);

// 要显示的 部分answerList 的索引
const displayIndex = ref();

const ifShowMore = ref(false);

onMounted(() => {
    // console.log(answerList.value);

    // 初始显示的回答数
    if (answerList.value.length <= 2) {
        displayIndex.value = answerList.value.length;
    } else {
        displayIndex.value = 2;
        ifShowMore.value = true;
    }
});

// 关注按钮的处理  ？？？？？？做个模块？？？？？？
// 判断当前关注关系是 未关注 还是 已关注
const ifFollower = (id) => userStore.ifAttention(id);
// 更改关注关系
const changeFollower = async (attType, id) => {
    const ifF = ifFollower(id);
    if (ifF == true) {
        await userStore.updateAttention('delete', attType, id);
    } else if (ifF == false) {
        await userStore.updateAttention('post', attType, id);
    }
}

// ？？？？？？做个模块？？？？？？？
// 赞同点击事件
const agree = async (ansId) => {
    if (answerIsAgree.value.includes(ansId)) { // 已经点赞过了
        await ansStore.updateAnswerLikeNum('down', ansId);
        ansStore.deleteAgreedAnswer(ansId);
    } else { // 还没点赞过
        await ansStore.updateAnswerLikeNum('up', ansId);
        ansStore.addAgreedAnswer(ansId);
    }
}

// 显示更多的回答
const addMoreAnswer = () => {
    if (displayIndex.value === answerList.value.length-1) { // 剩余 1 个回答
        displayIndex.value = displayIndex.value + 1;
        ifShowMore.value = false;
    } else if (displayIndex.value === answerList.value.length-2) { // 剩余 2 个回答
        displayIndex.value = displayIndex.value + 2;
        ifShowMore.value = false;
    } else { // 剩余回答数大于 2
        displayIndex.value = displayIndex.value + 2;
    }
}

</script>

<template>
    <div class="answer">
        <div class="ans-number">全部{{ answerList.length }}个回答</div>
        <hr style="width: 98%;margin: 0 auto;">
        <div class="ans-container" v-for="ans in answerList.slice(0, displayIndex)">
            <div class="ans-author">
                <img class="ans-head" :src="ans.user.userHead" alt="ansAuthorHead">
                <div class="ans-name">{{ ans.user.userName }}</div>
                <el-button :type="ifFollower(ans.user.userId) ? 'info' : ''"
                    @click="changeFollower('user', ans.user.userId)" style="float: right;">
                    {{ ifFollower(ans.user.userId) ? "已关注" : "+关注" }}
                </el-button>
            </div>
            <span class="ans-content" v-html="ans.answer.ansContent"></span>
            <div class="ans-time">编辑于：{{ formatUTCtoLocal(ans.answer.ansTime) }}</div>
            <el-button type="primary" plain @click="agree(ans.answer.ansId)">
                <el-icon style="margin-right: 5px;">
                    <CaretTop />
                </el-icon>
                赞同{{ ans.answer.ansLikeNum }}
            </el-button>
            <br>
        </div>
        <el-divider></el-divider>
        <div v-if="ifShowMore === true" class="ans-more" @click="addMoreAnswer">
            查看更多回答
        </div>
        <div v-if="ifShowMore === false" class="ans-end">
            已经到底了
        </div>
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