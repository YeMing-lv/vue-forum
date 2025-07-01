import { defineStore } from "pinia";
import myrequest from '../api/request';

export const useArtStore = defineStore('article', {
    state: () => ({
        articleList: [],
        page: {
            // 第一次先拿6个，后面再换成3的尺寸，从第3页开始
            currentPage: 1,
            pageSize: 6,
            total: 0,
        },
        currentArticle: null,
        author: null,
        articleIsAgree: [0],
    }),
    actions: {
        // 初始化
        init() {
            this.articleList = [];
            this.page = {
                currentPage: 1,
                pageSize: 6,
                total: 0,
            };
            this.currentArticle = null;
            this.author = null;
        },
        // 添加点赞过的文章ID
        addAgreedArticle(artId) {
            this.articleIsAgree.push(artId);
        },
        // 删除点赞过的文章ID
        deleteAgreedArticle(artId) {
            this.articleIsAgree = this.articleIsAgree.filter(item => item !== artId);
        },
        /**
         * 获取指定ID 文章详情和作者
         * @param {*} id 
         */
        async fetchCurrentArticle(id) {
            const result = await myrequest.fetchCurrentArticle(id);
            this.currentArticle = result.article;
            this.author = result.author;
            console.log(this.currentArticle);
            console.log(this.author);
        },
        // 获取指定种类的文章列表
        async fetchArticleList(listType) {
            if (listType === 'recommend') {
                const result = await myrequest.fetchRecommendArticle(this.page);

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
                }
                // console.log(this.page);
                // console.log(this.articleList);
            }
        },
        // 获取关键词搜索到的文章列表
        async fetchSearchArticleList(keyword) {
            const result = await myrequest.fetchSearchArticleList(this.page, keyword);
            
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
            }
            // console.log(this.page);
            // console.log(this.articleList)
        },
        // 更新文章点赞数 ????????
        async updateArticleLikeNum(artId, artLikeNum) {
            const result = await myrequest.updateArticleLikeNum(artId, artLikeNum);
            if (result.code === 200) {
                this.currentArticle.artLikeNum = artLikeNum;
            }
        }
    },
    persist: true
})