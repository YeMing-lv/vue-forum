import { defineStore } from "pinia";
import myrequest from '../api/request.js';

export const useQueStore = defineStore('que', {
    state: () => ({
        questionList: null,
        currentQuestion: null,
        author: null,
        questionIsAgree: [0],
    }),
    actions: {
        cleanCurrentQuestion() {
            this.currentQuestion = null;
        },
        addAgreedQuestion(queId) {
            this.questionIsAgree.push(queId);
        },
        deleteAgreedQuestion(queId) {
            this.questionIsAgree = this.questionIsAgree.filter(item => item !== queId);
        },
        async fetchCurrentQuestion(id) {
            try {
                const result = await myrequest.fetchCurrentQuestion(id);
                this.currentQuestion = result.queResponse.data;
                this.author = result.autResponse.data;
            } catch (error) {
                console.log("Error pinia FetchCurrentQuestion: " + error);
            }
        },
        async updateQuestionLikeNum(upOrdown, id) {
            const result = await myrequest.updateLikeNum('question', upOrdown, id);
            this.currentQuestion.queLikeNum = result.queLikeNum;
        }
    },
    persist: true
})