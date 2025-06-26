import { defineStore } from "pinia";
import myrequest from '../api/request';
import { ref } from "vue";

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

        /**
         * 获取指定种类 话题列表 及对应最新回答
         * @param {*} listType 
         * @returns 
         */
        async fetchQuestionList(listType) {
            const result = await myrequest.fetchQuestionList(listType);
            this.questionList = result.data;

            // 获取搜索框 补全输入列表
            if (listType === 'recommend') {
                const myResult = result.data.slice(0, 6);
                this.searchAutoCompleteQuestionList = myResult.map(item => item.question);
            }
        },

        /**
         * 获取搜索 话题列表
         * @param {*} keyword 
         */
        async fetchSearchQuestionList(keyword) {
            const result = await myrequest.fetchSearchQuestionList(keyword);
            this.questionList = result.data;
        },
        
        /**
         * 获取指定ID话题详情
         * @param {*} id 
         */
        async fetchCurrentQuestion(id) {
            const result = await myrequest.fetchCurrentQuestion(id);
            this.currentQuestion = result.queResponse.data;
            this.author = result.autResponse.data;
        },

        /**
         * 更新话题的点赞数
         * @param {} upOrdown 
         * @param {*} id 
         */
        async updateQuestionLikeNum(upOrdown, id) {
            const likeNum = ref(this.currentQuestion);
            if (upOrdown === 'up') {
                const result = await myrequest.updateLikeNum('question', id, likeNum.value.queLikeNum + 1);
                if (result.data === 1) {
                    likeNum.value.queLikeNum ++;
                }
            } else if (upOrdown === 'down') {
                const result = await myrequest.updateLikeNum('question', id, likeNum.value.queLikeNum - 1);
                if (result.data === 1) {
                    likeNum.value.queLikeNum --;
                }
            }
        },

        /**
         * 更新回答的点赞数
         * @param {*} upOrDown 
         * @param {*} id 
         */
        async updateAnswerLikeNum(upOrDown, id) {
            const updateAnswer = ref(this.questionList[this.questionList.findIndex(item => item.answer.ansId === id)].answer);
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
        },

        /**
         * 增加话题 的浏览数
         * @param {*} id 
         */
        async increaseQueBrowseNum(id) {
            const result = await myrequest.increaseQueBrowseNum(id);

            if (result.code === 200) {
                if (result.data > 0) {
                    this.currentQuestion.queBrowseNum++;
                }
            }
        }
    },
    persist: true
})