import { defineStore } from "pinia";
import { fetchArticleByAuthorId, fetchCurrentArticle, fetchRecommendArticle, fetchSearchArticleList } from "../api/Article/ArticleApi";

export const useArtStore = defineStore('article', {
    state: () => ({
        articleList: [],
        page: {
            // 第一次先拿6个，后面再换成3的尺寸，从第3页开始
            currentPage: 0,
            pageSize: 0,
            total: 0,
        },
        currentArticle: null,
        author: null,
    }),
    actions: {
        // 初始化
        init() {
            this.articleList = [];
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0,
            };
            this.currentArticle = null;
            this.author = null;
        },
        initList() {
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0,
            };
            this.articleList = [];
        },

        /**
         * 获取指定ID 文章详情和作者
         * @param {*} id 
         */
        async fetchCurrentArticle(id) {
            const result = await fetchCurrentArticle(id);
            this.currentArticle = result.article;
            this.author = result.author;
        },
        
        // 获取指定种类的文章列表
        async fetchArticleList(listType) {
            if (listType === 'recommend') {
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

                const result = await fetchRecommendArticle(this.page);

                // console.log(result);
                if (result.code === 200) {
                    // 1.存储数据总数
                    this.page.currentPage = result.data.current;
                    this.page.total = result.data.total;

                    // 2.判断 还有没有数据
                    if (this.articleList != []) {
                        if (this.page.total > this.articleList.length) {
                            this.articleList = [...this.articleList, ...result.data.records];
                        }
                    } else {
                        this.articleList = result.data.records;
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
                // console.log(this.articleList);
            }
        },

        /**
         * 获取指定作者ID 文章分页
         * @param {*} id 
         */
        async fetchArticleByAuthorId(id) {
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

            const result = await fetchArticleByAuthorId(this.page, id);

            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.存储 并 判断 还有没有数据
                if (this.articleList != []) {
                    if (this.page.total > this.articleList.length) {
                        this.articleList = [...this.articleList, ...result.data.records];
                    }
                } else {
                    this.articleList = result.data.records;
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
            // console.log(this.articleList);
        },

        // 获取关键词搜索到的文章列表
        async fetchSearchArticleList(keyword) {
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

            const result = await fetchSearchArticleList(this.page, keyword);

            // console.log(result);
            if (result.code === 200) {
                // 1.第一次获取时 存储数据总数
                this.page.total = result.data.total;
                this.page.currentPage = result.data.currentPage;

                // 2.判断 还有没有数据
                if (this.articleList != []) {
                    if (this.page.total > this.articleList.length) {
                        this.articleList = [...this.articleList, ...result.data.records];
                    }
                } else {
                    this.articleList = result.data.records;
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
            // console.log(this.articleList)
        },
    },
    persist: true
})