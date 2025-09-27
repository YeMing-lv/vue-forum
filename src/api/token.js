import apiClient from './request'


/**
 * 检查Token
 * @returns 
 */
export async function checkToken() {
    const response = await apiClient.post(`/checkToken`);
    // console.log(response);
    return response.data;
}