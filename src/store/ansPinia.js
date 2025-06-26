import { defineStore } from "pinia";
import myrequest from '../api/request';
import { ref } from "vue";

export const useAnsStore = defineStore('ans', {
    state: () => ({
        answerList: null,
        answerIsAgree: [0],
    }),
    actions: {
        cleanAnswerList() {
            this.answerList = null;
        },
        addAgreedAnswer(ansId) {
            this.answerIsAgree.push(ansId);
        },
        deleteAgreedAnswer(ansId) {
            this.answerIsAgree = this.answerIsAgree.filter(item => item !== ansId);
        },

        /**
         * 获取指定ID话题 的回答列表
         * @param {*} id 
         */
        async fetchQueAnswerList(id) {
            const result = await myrequest.fetchQueAnswerList(id);
            this.answerList = result.data;
        },

        /**
         * 创建新回答 
         * @param {} ansAuthorId 
         * @param {*} ansQueId 
         * @param {*} ansContent 
         */
        async insertAnswer(ansAuthorId, ansQueId, ansContent) {
            const result = await myrequest.insertAnswer(ansAuthorId, ansQueId, ansContent);
            this.answerList.unshift(result.data);
        },

        /**
         * 更新回答 的点赞数
         * @param {*} upOrDown 
         * @param {*} id 
         */
        async updateAnswerLikeNum(upOrDown, id) {
            const updateAnswer = ref(this.answerList[this.answerList.findIndex(item => item.answer.ansId === id)].answer);
            const likeNum = updateAnswer.value.ansLikeNum;

            if (upOrDown === "up") {
                const result = await myrequest.updateLikeNum('answer', id, likeNum + 1);
                if (result.data === 1) {
                    updateAnswer.value.ansLikeNum++;
                }
            } else if (upOrDown === "down") {
                const result = await myrequest.updateLikeNum('answer', id, likeNum - 1);
                if (result.data === 1) {
                    updateAnswer.value.ansLikeNum--;
                }
            }
        }
    },
    persist: true
})