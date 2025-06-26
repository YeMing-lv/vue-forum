import { defineStore } from "pinia";
import myrequest from '../api/request';

export const useArtStore = defineStore('article', {
    state: () => ({
        articleList: null,
        currentArticle: null,
        author: null,
        articleIsAgree: [0],

    }),
    actions: {
        // 初始化文章列表
        initArticleList() {
            this.articleList = null;
        },
        // 添加点赞过的文章ID
        addAgreedArticle(artId) {
            this.articleIsAgree.push(artId);
        },
        // 删除点赞过的文章ID
        deleteAgreedArticle(artId) {
            this.articleIsAgree = this.articleIsAgree.filter(item => item !== artId);
        },
        // 获取文章作者
        async fetchArticleAuthor(artAuthorId) {
            const result = await myrequest.fetchUserById(artAuthorId);
            if (result.code === 200) {
                this.author = result.data;
            }
        },
        // 获取指定种类的文章列表
        async fetchArticleList(listType) {
            if (listType === 'recommend') {
                const result = await myrequest.fetchRecommendArticle();
                if (result.code === 200) {
                    this.articleList = result.data;
                }
            }
        },
        // 获取关键词搜索到的文章列表
        async fetchSearchArticleList(keyword) {
            const result = await myrequest.fetchSearchArticleList(keyword);
            if (result.code === 200) {
                this.articleList = result.data;
            }
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