<script setup>
import { computed, onMounted } from 'vue';
import { CaretTop } from '@element-plus/icons-vue';
import { formatUTCtoLocal } from '../other/utils/timeUtils.js';
import { useAnsStore } from '../other/store/ansPinia';
import { useUserStore } from '../other/store/userPinia.js';

const ansStore = useAnsStore();
const userStore = useUserStore();

const answerList = computed(() => ansStore.answerList);
const answerIsAgree = computed(() => ansStore.answerIsAgree);

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

// onMounted(() => console.log(answerList.value));

// ？？？？？？做个模块？？？？？？？
// 赞同点击事件
const agree = async (ansId) => {
    // console.log(answerIsAgree.value)
    for (let i = 0; i < answerList.value.length; i++) {
        const elementI = answerList.value[i];
        for (let j = 0; j < answerIsAgree.value.length; j++) {
            const elementJ = answerIsAgree.value[j];
            if (elementI.answer.ansId == ansId && elementJ == ansId) {
                // elementI.answer.ansLikeNum--;
                await ansStore.updateAnswerLikeNum('down', ansId);
                ansStore.deleteAgreedAnswer(ansId);
                break;
            } else if (elementI.answer.ansId == ansId && j == answerIsAgree.value.length-1 && elementJ != ansId) {
                // elementI.answer.ansLikeNum++;
                await ansStore.updateAnswerLikeNum('up', ansId);
                ansStore.addAgreedAnswer(ansId);
                break;
            }
        }
    }
}
</script>

<template>
    <div class="answer">
        <div class="ans-number">{{ answerList.length }}个回答</div>
        <hr style="width: 98%;margin: 0 auto;">
        <div class="ans-container" v-for="ans in answerList">
            <div class="ans-author">
                <img class="ans-head" :src="ans.user.userHead" alt="ansAuthorHead">
                <div class="ans-name">{{ ans.user.userName }}</div>

                <el-button :type="ifFollower(ans.user.userId) ? 'info' : ''" @click="changeFollower('user', ans.user.userId)" style="float: right;">
                    {{ ifFollower(ans.user.userId) ? "已关注" : "+关注" }}
                </el-button>

            </div>
            <div class="ans-content">{{ ans.answer.ansContent }}</div>
            <div class="ans-time">编辑于：{{ formatUTCtoLocal(ans.answer.ansTime) }}</div>
            <el-button type="primary" plain @click="agree(ans.answer.ansId)">
                <el-icon style="margin-right: 5px;"><CaretTop /></el-icon>
                赞同{{ ans.answer.ansLikeNum }}
            </el-button>
            <br>
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
    line-height: 30px;
}

.ans-time {
    font-size: small;
    font-weight: 200;
}
</style>