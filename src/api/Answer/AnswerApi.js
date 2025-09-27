import apiClient from "../request";

/**
 * 获取指定种类、ID answer回答列表
 * @param {*} type 
 * @param {*} page 
 * @param {*} id 
 * @returns 
 */
export async function fetchAnswerList(type, page, id) {
    if (type === 'question') {
        const response = await apiClient.get(`/answer/question/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    } else if (type === 'article') {
        const response = await apiClient.get(`/answer/article/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    }
}

/**
 * 获取指定作者ID 话题列表
 * @param {*} authorId 
 * @param {*} pageParam 
 * @returns 
 */
export async function fetchAnswerListByAuthorId(authorId, pageParam) {
    const response = await apiClient.get(`/answer/author/${authorId}
            ?currentPage=${pageParam.currentPage}&pageSize=${pageParam.pageSize}&order=${pageParam.order}`);
    // console.log(response.data);
    return response.data;
}

/**
 * 插入新回答
 * @param {*} ansAuthorId 
 * @param {*} ansQueId 
 * @param {*} ansContent 
 * @returns 
 */
export async function insertAnswer(ansAuthorId, ansQueId, ansContent) {
    const response = await apiClient.post(`/answer`, {
        ansAuthorId,
        ansQueId,
        ansContent
    });
    return response.data;
}

/**
 * 更新 点赞数
 */
export async function updateAnswerLikeNum(id, likeNum) {
    const response = await apiClient.put(`/answer/${id}/like?likeNum=${likeNum}`);
    return response.data;
}