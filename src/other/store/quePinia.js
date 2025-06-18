import { defineStore } from "pinia";
import myrequest from '../api/request.js';

export const useQueStore = defineStore('que', {
    state: () => ({
        questionList: null,
        currentQuestion: null,
        author: null,
        questionIsAgree: [0],
        searchAutoCompleteQuestionList: null,
    }),
    actions: {
        initQuestionList() {
            this.questionList = null;
        },
        cleanCurrentQuestion() {
            this.currentQuestion = null;
        },
        addAgreedQuestion(queId) {
            this.questionIsAgree.push(queId);
        },
        deleteAgreedQuestion(queId) {
            this.questionIsAgree = this.questionIsAgree.filter(item => item !== queId);
        },
        // 获取 指定种类 话题列表数据
        async fetchQuestionList(listType) {
            const result = await myrequest.fetchQuestionList(listType);
            this.questionList = result;

            // 获取搜索框 补全输入列表
            if (listType === 'recommend') {
                const myResult = result.slice(0, 6);
                this.searchAutoCompleteQuestionList = myResult.map(item => item.question);
            }
            return result;
        },
        // 获取 搜索 话题列表
        async fetchSearchQuestionList(keyword) {
            const result = await myrequest.fetchSearchQuestionList(keyword);
            this.questionList = result;
            console.log(this.questionList);
        },
        async fetchCurrentQuestion(id) {
            const result = await myrequest.fetchCurrentQuestion(id);
            this.currentQuestion = result.queResponse.data;
            this.author = result.autResponse.data;
        },
        async updateQuestionLikeNum(upOrdown, id) {
            const result = await myrequest.updateLikeNum('question', upOrdown, id);
            this.currentQuestion.queLikeNum = result.queLikeNum;
        },
        async updateAnswerLikeNum(upOrdown, id, listType) {
            const result = await myrequest.updateLikeNum('answer', upOrdown, id);
            this.questionList[this.questionList.findIndex(item => item.answer.ansId === id)].answer = result;
        }
    },
    persist: true
})