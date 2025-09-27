<script setup>
import { uselikeRecordsStore } from '../../store/likeRecordsPinia';
import { insertOrUpdateUserActions } from '../../api/UserActions/UserActionsApi';
import { updateAnswerLikeNum } from '../../api/Answer/AnswerApi';
import { updateQuestionLikeNum } from '../../api/Question/QuestionApi';
import { CaretTop } from '@element-plus/icons-vue';
import { useUserStore } from '../../store/userPinia';

const likeRecordsPinia = uselikeRecordsStore();
const userStore = useUserStore();
const userId = userStore.user.userId;

// 话题点赞、回答点赞
const props = defineProps(['likeId', 'type']);
const likeNum = defineModel();

// 赞同点击事件
const agree = async () => {
    if (props.likeId === null && props.type === null) return;

    // 判断是否有点赞记录 修改likeNum点赞数
    if (likeRecordsPinia.haveLikeRecord(props.likeId)) { // 有点赞记录，进行取消点赞
        if (props.type == 'answer') {
            const result = await updateAnswerLikeNum(props.likeId, likeNum.value - 1)
            if (result.code === 200) { // 取消点赞 成功，前端点赞数 - 1
                likeNum.value = likeNum.value - 1;
                // 前端删除点赞记录
                likeRecordsPinia.deleteLikeRecord(props.likeId);
            }
        } else if (props.type == 'question') {
            const result = await updateQuestionLikeNum(props.likeId, likeNum.value - 1)
            if (result.code === 200) { // 取消点赞 成功，前端点赞数 - 1
                likeNum.value = likeNum.value - 1;
                // 前端删除点赞记录
                likeRecordsPinia.deleteLikeRecord(props.likeId);
            }
        }
    } else { // 没有点赞记录，创建点赞
        if (props.type == 'answer') {
            const result = await updateAnswerLikeNum(props.likeId, likeNum.value + 1)
            if (result.code === 200) { // 创建点赞成功，前端点赞数 + 1
                likeNum.value = likeNum.value + 1;
                // 更新或插入用户动态
                insertOrUpdateUserActions(userId, 'like', props.likeId, props.type);
                // 前端添加点赞记录
                likeRecordsPinia.addLikeRecord(props.likeId);
            }
        } else if (props.type == 'question') {
            const result = await updateQuestionLikeNum(props.likeId, likeNum.value + 1)
            if (result.code === 200) { // 创建点赞成功，前端点赞数 + 1
                likeNum.value = likeNum.value + 1;
                // 更新或插入用户动态
                insertOrUpdateUserActions(userId, 'like', props.likeId, props.type);
                // 前端添加点赞记录
                likeRecordsPinia.addLikeRecord(props.likeId);
            }
        }
    }
}
</script>

<template>
    <!-- 回答点赞的按钮 -->
    <el-button v-if="likeNum != null && props.type != null && props.type != 'question'" type="primary" plain
        @click="agree">
        <el-icon style="margin-right: 5px;">
            <CaretTop />
        </el-icon>
        赞同{{ likeNum }}
    </el-button>

    <!-- 话题点赞的按钮 -->
    <el-button v-if="likeNum != null && props.type != null && props.type === 'question'" text @click="agree">
        <img class="que-like-img" src="/public/image/like.png" alt="like">
        点赞{{ likeNum }}
    </el-button>
</template>

<style scoped>
.que-like-img {
    margin: auto 5px;
    width: 20px;
    height: 20px;
}
</style>