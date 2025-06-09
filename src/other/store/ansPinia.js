import { defineStore } from "pinia";
import myrequest from '../api/request.js';

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
        async fetchQueAnswerList(id) {
            const result = await myrequest.fetchQueAnswerList(id);
            this.answerList = result;
        },
        async updateAnswerLikeNum(upOrdown, id) {
            const result = await myrequest.updateLikeNum('answer', upOrdown, id);
            for (let i = 0; i < this.answerList.length; i++) {
                const element = this.answerList[i];
                if (element.answer.ansId == id) {
                    this.answerList[i].answer = result;
                }
            }
        }
    },
    persist: true
})