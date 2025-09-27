import apiClient from "../request";

/**
 * 获取 用户所有关注关系
 * @param {*} id 
 * @returns 
 */
export async function fetchAttention(id) {
    const response = await apiClient.get(`/attention/following/${id}`);
    return response.data;
}

/**
 * 插入或删除 关注关系
 * @param {*} attFollower 
 * @param {*} attType 
 * @param {*} attFollowed 
 * @returns 
 */
export async function insertAttention(attFollower, attType, attFollowed) {
    // console.log(attFollowed, attFollower, attType)
    const response = await apiClient.post(`/attention`, {
        attFollower: attFollower,
        attType: attType,
        attFollowed: attFollowed
    });
    return response.data;
}

/**
 * 删除 关注关系
 * @param {*} attId 
 */
export async function deleteAttention(attId) {
    const response = await apiClient.delete(`/attention/${attId}`);
    return response.data;
}