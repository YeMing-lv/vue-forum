import { defineStore } from "pinia";
import { fetchUserBrowseHistory } from "../api/BrowseHistory/BrowseHistoryApi";

export const useBrowHistoryStore = defineStore('browHistory', {
    state: () => ({
        browseHistoryList: [],
        page: {
            currentPage: 0,
            pageSize: 0,
            total: 0,
            order: null
        }
    }),
    actions: {
        init() {
            this.browseHistoryList = [];
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0,
                order: null
            };
        },

        /**
         * 获取登录用户浏览历史列表
         * @param {*} type 
         * @param {*} dateBetween 
         * @param {*} id 
         */
        async fetchUserBrowseHistory(type, dateBetween, id) {
            // 更新页面参数
            if (this.page.currentPage === 0 && this.page.pageSize === 0) { // 初始参数改为 1；4
                this.page.currentPage = 1;
                this.page.pageSize = 4;
            } else if (this.page.currentPage === 1 && this.page.pageSize === 4) { // 1；4分页查询后
                this.page.currentPage = 3;
                this.page.pageSize = 2;
            } else {
                this.page.currentPage++;
            }

            const result = await fetchUserBrowseHistory(type, this.page, dateBetween, id);

            console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.判断 还有没有数据
                if (this.browseHistoryList != []) {
                    if (this.page.total > this.browseHistoryList.length) {
                        // 存储
                        this.browseHistoryList = [...this.browseHistoryList, ...result.data.records];
                    }
                } else {
                    this.browseHistoryList = result.data.records;
                }
                this.dateBetween = {
                    startTime: 0,
                    endTime: 0
                };
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
                this.dateBetween = {
                    startTime: 0,
                    endTime: 0
                };
                return false;
            }

            // console.log(this.page);
            // console.log(this.answerList);
        }

    }
})