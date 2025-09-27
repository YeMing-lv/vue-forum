import apiClient from '../request';
// 草稿管理

/**
 * 获取指定用户 种类草稿箱
 * 话题草稿箱 ？ 文章草稿箱
 * @param {*} userId
 * @returns 
 */
export async function getDraftList(params) {
    const response = await apiClient({
        url: `/draft/list`,
        method: 'get',
        params
    });
    return response.data;
}

/**
 * 插入 草稿
 * @param {*} draAuthorId 
 * @param {*} draType 
 * @param {*} draTitle 
 * @param {*} draContent 
 */
export async function insertDraft(draAuthorId, draType, draTitle, draContent) {
    const response = await apiClient.post(`/draft`, {
        draAuthorId,
        draType,
        draTitle,
        draContent
    });
    return response.data;
}

/**
 * 更新 草稿
 * @param {*} draft 
 * @returns 
 */
export async function updateDarft(draft) {
    const response = await apiClient.put(`/draft/${draft.draId}`, draft);
    return response.data;
}

/**
 * 删除 草稿
 * @param {*} draId 
 * @returns 
 */
export async function deleteDraft(draId) {
    const response = await apiClient.delete(`/draft/${draId}`);
    return response.data;
}