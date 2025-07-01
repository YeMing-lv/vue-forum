<script setup>
import { computed } from 'vue';
import { useQueStore } from '../../store/quePinia';
import { useAnsStore } from '../../store/ansPinia';

import { CaretTop } from '@element-plus/icons-vue';

const queStore = useQueStore();
const ansStore = useAnsStore();

const answerIsAgree = computed(() => ansStore.answerIsAgree);
const questionIsAgree = computed(() => queStore.questionIsAgree);

// 话题点赞、回答点赞
const props = defineProps(['likeNum', 'likeId', 'type']);
// que.answerWithUser.ansLikeNum

// 赞同点击事件
const agree = async () => {
    if (props.likeId === null && props.type === null) return;

    if (props.type === 'question') { // 点赞话题
        if (questionIsAgree.value.includes(props.likeId)) {
            await queStore.updateQuestionLikeNum('down', props.likeId);
            queStore.deleteAgreedQuestion(props.likeId);
        } else {
            await queStore.updateQuestionLikeNum('up', props.likeId);
            queStore.addAgreedQuestion(props.likeId);
        }
    } else if (props.type === 'answer') { // 点赞回答
        if (answerIsAgree.value.includes(props.likeId)) { // 已经点赞过了
            await ansStore.updateAnswerLikeNum('down', props.likeId);
            ansStore.deleteAgreedAnswer(props.likeId);
        } else { // 还没点赞过i
            await ansStore.updateAnswerLikeNum('up', props.likeId);
            ansStore.addAgreedAnswer(props.likeId);
        }
    } else if (props.type === 'queListAnswer') { // 点赞话题列表中 回答
        if (answerIsAgree.value.includes(props.likeId)) { // 已经点赞过了
            await queStore.updateQueListAnswerLikeNum('down', props.likeId);
            ansStore.deleteAgreedAnswer(props.likeId);
        } else { // 还没点赞过i
            await queStore.updateQueListAnswerLikeNum('up', props.likeId);
            ansStore.addAgreedAnswer(props.likeId);
        }
    }
}
</script>

<template>
    <!-- 回答点赞的按钮 -->
    <el-button v-if="props.likeNum != null && props.type != null && props.type != 'question'" type="primary" plain
        @click="agree">
        <el-icon style="margin-right: 5px;">
            <CaretTop />
        </el-icon>
        赞同{{ props.likeNum }}
    </el-button>

    <!-- 话题点赞的按钮 -->
    <el-button v-if="props.likeNum != null && props.type != null && props.type === 'question'" text @click="agree">
        <img class="que-like-img" src="/public/image/like.png" alt="like">
        点赞{{ props.likeNum }}
    </el-button>
</template>

<style scoped>
.que-like-img {
    margin: auto 5px;
    width: 20px;
    height: 20px;
}
</style>