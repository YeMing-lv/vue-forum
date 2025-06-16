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
        async insertAnswer(ansAuthorId, ansQueId, ansContent) {
            const result = await myrequest.insertAnswer(ansAuthorId, ansQueId, ansContent);
            this.answerList.unshift(result);
        },
        async updateAnswerLikeNum(upOrdown, id) {
            const result = await myrequest.updateLikeNum('answer', upOrdown, id);
            this.answerList[this.answerList.findIndex(item => item.answer.ansId === id)].answer = result;
        }
    },
    persist: true
})