import { defineStore } from "pinia";
import myrequest from '../api/request';
import { ref } from "vue";

export const useQueStore = defineStore('que', {
    state: () => ({
        questionList: [],
        page: {
            // 第一次先拿6个，后面再换成3的尺寸，从第3页开始
            currentPage: 1,
            pageSize: 6,
            total: 0,
        },
        searchAutoCompleteQuestionList: [],

        currentQuestion: null,
        author: null,

        questionIsAgree: [0],

    }),
    actions: {
        // 初始化话题列表数据
        initList() {
            this.questionList = [];
            this.page.currentPage = 1;
            this.page.pageSize = 6;
            this.page.total = 0;
            this.searchAutoCompleteQuestionList = [];
            // console.log("init")
        },
        // 初始化话题详情数据
        initDetail() {
            this.currentQuestion = null;
            this.author = null;
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
            if (listType === 'recommend') { // 获取 推荐列表
                const result = await myrequest.fetchRecommendQuestionList(this.page);

                // console.log(result);
                if (result.code === 200) {
                    // 1.第一次获取时 存储数据总数 补全搜索框输入列表
                    if (this.page.currentPage === 1) {
                        this.page.total = result.data.total;
                        this.searchAutoCompleteQuestionList = result.data.records.map((item) => {
                            return {
                                queId: item.queId,
                                queTitle: item.queTitle
                            }
                        });
                    }
                    this.page.currentPage = result.data.current;
                    this.page.total = result.data.total;

                    // 2.判断 还有没有数据
                    if (this.questionList != []) {
                        if (this.page.total > this.questionList.length) {
                            this.questionList = [...this.questionList, ...result.data.records];
                        }
                    } else {
                        this.questionList = result.data.records;
                    }
                }
                // console.log(this.page);
                // console.log(this.questionList)
            }
        },

        /**
         * 获取搜索 话题列表
         * @param {*} keyword 
         */
        async fetchSearchQuestionList(keyword) {
            const result = await myrequest.fetchSearchQuestionList(this.page, keyword);
            if (result.code === 200) {
                // 1.第一次获取时 存储数据总数
                if (this.page.currentPage === 1) {
                    this.page.total = result.data.total;
                }
                // 2.判断 还有没有数据
                if (this.questionList != []) {
                    if (this.page.total > this.questionList.length) {
                        this.questionList = [...this.questionList, ...result.data.records];
                    }
                } else {
                    this.questionList = result.data.records;
                }
            }
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
         * 更新话题列表中 回答的点赞数
         * @param {*} upOrDown 
         * @param {*} id 
         */
        async updateQueListAnswerLikeNum(upOrdown, id) {
            const item = ref(this.questionList.find(item => item.answerWithUser.ansId === id));
            if (upOrdown === 'up') {
                const result = await myrequest.updateLikeNum('answer', id, item.value.answerWithUser.ansLikeNum + 1);
                if (result.code === 200) {
                    item.value.answerWithUser.ansLikeNum++;
                }
            } else if (upOrdown === 'down') {
                const result = await myrequest.updateLikeNum('answer', id, item.value.answerWithUser.ansLikeNum - 1);
                if (result.code === 200) {
                    item.value.answerWithUser.ansLikeNum--;
                }
            }
        },

        /**
         * 更新当前话题的点赞数
         * @param {} upOrdown 
         * @param {*} id 
         */
        async updateQuestionLikeNum(upOrdown, id) {
            const likeNum = ref(this.currentQuestion);
            if (upOrdown === 'up') {
                const result = await myrequest.updateLikeNum('question', id, likeNum.value.queLikeNum + 1);
                if (result.code === 200) {
                    likeNum.value.queLikeNum++;
                }
            } else if (upOrdown === 'down') {
                const result = await myrequest.updateLikeNum('question', id, likeNum.value.queLikeNum - 1);
                if (result.code === 200) {
                    likeNum.value.queLikeNum--;
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