import { defineStore } from "pinia";
import { fetchQuestionByAuthorId, fetchRecommendQuestionList, fetchSearchQuestionList,
    fetchCurrentQuestion, increaseQueBrowseNum
 } from "../api/Question/QuestionApi";

export const useQueStore = defineStore('que', {
    state: () => ({
        questionList: [],
        page: {
            // 第一次先拿6个，后面再换成3的尺寸，从第3页开始
            currentPage: 0,
            pageSize: 0,
            total: 0,
        },
        searchAutoCompleteQuestionList: [],

        currentQuestion: null,
        author: null,
    }),
    actions: {
        // 初始化话题列表数据
        initList() {
            this.questionList = [];
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0,
            };
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
                // 更新页面参数
                if (this.page.currentPage === 0 && this.page.pageSize === 0) { // 初始参数改为 1；6
                    this.page.currentPage = 1;
                    this.page.pageSize = 6;
                } else if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 1；6分页查询后
                    this.page.currentPage = 3;
                    this.page.pageSize = 3;
                } else {
                    this.page.currentPage++;
                }
                const result = await fetchRecommendQuestionList(this.page);

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
                } else { // 查询分页失败，复原page
                    if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 初始参数改为 1；6
                        this.page.currentPage = 0;
                        this.page.pageSize = 0;
                    } else if (this.page.currentPage === 3 && this.page.pageSize === 3) { // 1；6分页查询后
                        this.page.currentPage = 1;
                        this.page.pageSize = 6;
                    } else {
                        this.page.currentPage--;
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
            // 更新页面参数
            if (this.page.currentPage === 0 && this.page.pageSize === 0) { // 初始参数改为 1；6
                this.page.currentPage = 1;
                this.page.pageSize = 6;
            } else if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 1；6分页查询后
                this.page.currentPage = 3;
                this.page.pageSize = 3;
            } else {
                this.page.currentPage++;
            }
            const result = await fetchSearchQuestionList(this.page, keyword);
            if (result.code === 200) {
                // 1.更新页面参数
                this.page.currentPage = result.data.currentPage;
                this.page.total = result.data.total;

                // 2.判断 还有没有数据
                if (this.questionList != []) {
                    if (this.page.total > this.questionList.length) {
                        this.questionList = [...this.questionList, ...result.data.records];
                    }
                } else {
                    this.questionList = result.data.records;
                }
            } else { // 查询分页失败，复原page
                if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 初始参数改为 1；6
                    this.page.currentPage = 0;
                    this.page.pageSize = 0;
                } else if (this.page.currentPage === 3 && this.page.pageSize === 3) { // 1；6分页查询后
                    this.page.currentPage = 1;
                    this.page.pageSize = 6;
                } else {
                    this.page.currentPage--;
                }
            }
        },

        /**
         * 获取 指定作者ID 话题分页
         * @param {*} id 
         */
        async fetchQuestionByAuthorId(id) {
            // 更新页面参数
            if (this.page.currentPage === 0 && this.page.pageSize === 0) { // 初始参数改为 1；6
                this.page.currentPage = 1;
                this.page.pageSize = 6;
            } else if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 1；6分页查询后
                this.page.currentPage = 3;
                this.page.pageSize = 3;
            } else {
                this.page.currentPage++;
            }
            // console.log(this.page);
            const result = await fetchQuestionByAuthorId(this.page, id);

            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.存储 并 判断 还有没有数据
                if (this.questionList != []) {
                    if (this.page.total > this.questionList.length) {
                        this.questionList = [...this.questionList, ...result.data.records];
                    }
                } else {
                    this.questionList = result.data.records;
                }
            } else { // 查询分页失败，复原page
                if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 初始参数改为 1；6
                    this.page.currentPage = 0;
                    this.page.pageSize = 0;
                } else if (this.page.currentPage === 3 && this.page.pageSize === 3) { // 1；6分页查询后
                    this.page.currentPage = 1;
                    this.page.pageSize = 6;
                } else {
                    this.page.currentPage--;
                }
            }
            // console.log(this.page);
            // console.log(this.questionList);
        },

        /**
         * 获取指定ID话题详情
         * @param {*} id 
         */
        async fetchCurrentQuestion(id) {
            const result = await fetchCurrentQuestion(id);
            this.currentQuestion = result.queResponse.data;
            this.author = result.autResponse.data;
        },

        /**
         * 增加话题 的浏览数
         * @param {*} id 
         */
        async increaseQueBrowseNum(id) {
            const result = await increaseQueBrowseNum(id);

            if (result.code === 200) {
                if (result.data > 0) {
                    this.currentQuestion.queBrowseNum++;
                }
            }
        }
    },
    persist: true
})