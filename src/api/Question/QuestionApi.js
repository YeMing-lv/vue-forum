import apiClient from "../request";

/**
 * 分页获取推荐 话题列表
 */
export async function fetchRecommendQuestionList(page) {
    const response = await apiClient.get(`/question/recommend?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 获取话题查询结果
 * @param {*} keyword 
 * @returns 
 */
export async function fetchSearchQuestionList(page, keyword) {
    const response = await apiClient.get(`/question/search/${keyword}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 获取指定ID话题 作者详情
 * @param {*} id 
 * @returns 
 */
export async function fetchCurrentQuestion(id) {
    const queResponse = await apiClient.get(`/question/${id}`);
    const autResponse = await apiClient.get(`/user/${queResponse.data.data.queAuthorId}`);
    const result = {
        queResponse: queResponse.data,
        autResponse: autResponse.data
    };
    return result;
}

/**
 * 获取 指定作者ID 话题分页
 * @param {*} id 
 */
export async function fetchQuestionByAuthorId(page, id) {
    const response = await apiClient.get(`/question/user/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 增加话题 的浏览数
 * @param {*} id 
 */
export async function increaseQueBrowseNum(id) {
    const response = await apiClient.put(`/question/${id}/browse`);
    return response.data;
}

/**
 * 新建 话题
 * @param {*} queTitle 
 * @param {*} queContent 
 * @param {*} queAuthorId 
 * @returns 
 */
export async function insertQuestion(queTitle, queContent, queAuthorId) {
    const response = await apiClient.post(`/question`, {
        queTitle,
        queContent,
        queAuthorId
    });
    return response.data;
}

/**
 * 更新 话题
 * @param {*} question 
 */
export async function updateQuestion(question) {
    const response = await apiClient.put(`/question`, question);
    console.log(response.data);
    return response.data;
}

/**
 * 更新 点赞数
 */
export async function updateQuestionLikeNum(id, likeNum) {
    const response = await apiClient.put(`/question/${id}/like?likeNum=${likeNum}`);
    return response.data;
}
