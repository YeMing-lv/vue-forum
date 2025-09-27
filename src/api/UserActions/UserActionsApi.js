import apiClient from "../request";

/**
 * 获取 用户动态列表
 * @param {*} id 
 * @param {*} page 
 */
export async function fetchUserActions(id, page) {
    const response = await apiClient.get(`/userActions/user/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
    return response.data;
}

/**
 * 插入 或 更新用户动态
 * @param {*} userId1 
 * @param {*} eventType 
 * @param {*} elementId 
 * @param {*} elementName 
 */
export async function insertOrUpdateUserActions(userId, eventType, elementId, elementName) {
    const response = await apiClient.post(`/userActions`, {
        userId: userId,
        eventType: eventType,
        elementId: elementId,
        elementName: elementName
    });
    return response.data;
}

/**
 * 删除 用户动态
 * @param {*} userId 
 * @param {*} eventType 
 * @param {*} elementId 
 * @param {*} elementName 
 * @returns 
 */
export async function deleteUserActions(userId, eventType, elementId, elementName) {
    const response = await apiClient.delete(`/userActions?userId=${userId}&eventType=${eventType}&elementId=${elementId}&elementName=${elementName}`);
    return response.data;
}

