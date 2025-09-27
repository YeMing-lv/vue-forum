import { defineStore } from "pinia";
import { fetchAnswerListByAuthorId, fetchAnswerList, insertAnswer } from "../api/Answer/AnswerApi";

export const useAnsStore = defineStore('ans', {
    state: () => ({
        answerList: [],
        page: {
            currentPage: 0,
            pageSize: 0,
            total: 0,
            order: null
        },
    }),
    actions: {
        init() {
            this.answerList = [];
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                order: null
            };
        },

        /**
         * 获取指定种类、ID 的回答列表
         * @param {*} id 
         */
        async fetchAnswerList(type, id) {
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

            const result = await fetchAnswerList(type, this.page, id);

            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.判断 还有没有数据
                if (this.answerList != []) {
                    if (this.page.total > this.answerList.length) {
                        this.answerList = [...this.answerList, ...result.data.records];
                    }
                } else {
                    this.answerList = result.data.records;
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
            // console.log(this.answerList);
        },

        async fetchAnswerListByAuthorId(authorId, order) {
            this.page.order = order;
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

            const result = await fetchAnswerListByAuthorId(authorId, this.page);

            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.判断 还有没有数据
                if (this.answerList != []) {
                    if (this.page.total > this.answerList.length) {
                        this.answerList = [...this.answerList, ...result.data.records];
                    }
                } else {
                    this.answerList = result.data.records;
                }
                return true;
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
            // console.log(this.answerList);
            return false;
        },

        /**
         * 创建新回答 
         * @param {} ansAuthorId 
         * @param {*} ansQueId 
         * @param {*} ansContent 
         */
        async insertAnswer(ansAuthorId, ansQueId, ansContent) {
            const result = await insertAnswer(ansAuthorId, ansQueId, ansContent);
            if (result.code === 200) {
                this.answerList.unshift(result.data);
                return true;
            }
            return false;
        },

    },
    persist: true
})