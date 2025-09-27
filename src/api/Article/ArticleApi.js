import apiClient from "../request";

/**
 * 获取 指定作者ID 文章分页
 * @param {*} id 
 */
export async function fetchArticleByAuthorId(page, id) {
    const response = await apiClient.get(`/article/author/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 获取指定ID 文章和作者
 * @param {*} id 
 */
export async function fetchCurrentArticle(id) {
    const article = await apiClient.get(`/article/${id}`);
    // console.log(article.data);
    if (article.data.code != 200) return;

    const authorId = article.data.data.artAuthorId;
    const author = await apiClient.get(`/user/${authorId}`);
    // console.log(author.data);
    if (author.data.code != 200) return;

    const result = {
        article: article.data.data,
        author: author.data.data
    };
    console.log(result);
    return result;
}

/**
 * 获取推荐 文章列表
 * @returns 
 */
export async function fetchRecommendArticle(page) {
    const response = await apiClient.get(`/article/recommend?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 关键词搜索 文章列表
 * @param {*} keyword 
 * @returns 
 */
export async function fetchSearchArticleList(page, keyword) {
    const response = await apiClient.get(`/article/search/${keyword}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 创建 文章
 * @param {*} artAuthorId 
 * @param {*} artTitle 
 * @param {*} artContent 
 * @returns 
 */
export async function createArticle(artAuthorId, artTitle, artContent) {
    const response = await apiClient.post(`/article`, {
        artAuthorId,
        artTitle,
        artContent
    });
    return response.data;
}

/**
 * 更新文章点赞
 * @param {*} artId 
 * @param {*} artLikeNum 
 * @returns 
 */
export async function updateArticleLikeNum(artId, artLikeNum) {
    const response = await apiClient.put(`/article/like`, {
        artId,
        artLikeNum
    });
    return response.data;
}