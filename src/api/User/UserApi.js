import apiClient from "../request";


/**
 * 用户登录
 * @param {*} account 
 * @param {*} password 
 * @returns 
*/
export async function userLogin(account, password) {
    const response = await apiClient.post('/user/login', {
        userAccount: account,
        userPassword: password
    });
    return response.data;
}

/**
 * 用户注册
 * @param {*} name 
 * @param {*} account 
 * @param {*} password 
 * @returns 
 */
export async function userRegister(name, account, password) {
    const response = await apiClient.post('/user/register', {
        userName: name,
        userAccount: account,
        userPassword: password
    });
    return response.data;
}

/**
 * 更新用户头像 路径
 * @param {*} path 
 */
export async function updateUserHeadPath(id, path) {
    const response = await apiClient.put(`/user/userHead/${id}?path=${path}`);
    return response.data;
}


export async function fetchUserById(userId) {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
}