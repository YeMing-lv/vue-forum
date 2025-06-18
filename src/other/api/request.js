import axios from "axios";
import { te } from "element-plus/es/locales.mjs";

//实例化axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8082',
    timemout: 1000,
    headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
apiClient.interceptors.request.use(
    config => {
        // 发请求前做的一些处理，数据转化，配置请求头，!!设置token,设置loading等，根据需求去添加

        //注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
        const token = localStorage.getItem("token"); // 取token
        if (token) {
            config.headers.token = token; // 后端要求把 token 放到 header 请求头中
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// 响应拦截器
apiClient.interceptors.response.use(
    response => {
        //接收到响应数据并成功后的一些共有的处理，关闭loading等

        return response;
    },
    error => {
        /* ****  接收到异常响应的处理开始  **** */
        // if (error && error.response) {
        //     // 1. 公共错误处理
        //     // 2. 根据响应码具体处理
        //     switch (error.response.status) {
        //         case 400:
        //             error.message = "错误请求";
        //             break;
        //         case 401:
        //             error.message = "未授权，请重新登录";
        //             break;
        //         case 403:
        //             error.message = "拒绝访问";
        //             break;
        //         case 404:
        //             error.message = "请求错误,未找到该资源";
        //             window.location.href = "/NotFound";
        //             break;
        //         case 405:
        //             error.message = "请求方法未允许";
        //             break;
        //         case 408:
        //             error.message = "请求超时";
        //             break;
        //         case 500:
        //             error.message = "服务器端出错";
        //             break;
        //         case 501:
        //             error.message = "网络未实现";
        //             break;
        //         case 502:
        //             error.message = "网络错误";
        //             break;
        //         case 503:
        //             error.message = "服务不可用";
        //             break;
        //         case 504:
        //             error.message = "网络超时";
        //             break;
        //         case 505:
        //             error.message = "http版本不支持该请求";
        //             break;
        //         default:
        //             error.message = `连接错误${error.response.status}`;
        //     }
        // } else {
        //     // 超时处理
        //     if (JSON.stringify(error).includes("timeout")) {
        //         Message.error("服务器响应超时，请刷新当前页");
        //     }
        //     error.message("连接服务器失败");
        // }

        // Message.error(error.message);

        /* ****  处理结束  **** */
        // 如果不需要错误处理，以上的处理过程都可省略
        return Promise.resolve(error.response);
    }
);

export default {

    // image接口
    async deleteImage(imagePath) {
        const response = await apiClient.delete(`/image?imagePath=${imagePath}`);
        return response.data;
    },

    // user用户接口
    async fetchUserById(userId) {
        const response = await apiClient.get(`/user/${userId}`);
        return response.data;
    },
    async userLogin(account, password) {
        const response = await apiClient.post('/user/login', {
            account,
            password
        });
        return response.data;
    },
    async userRegister(name, account, password) {
        const response = await apiClient.post('/user/register', {
            name,
            account,
            password
        });
        return response.data;
    },
    async checkToken(token) {
        const response = await apiClient.get(`/user/token`);
        return response.data;
    },

    // user的attention关注关系接口
    async fetchAttention(id) {
        const response = await apiClient.get(`/attention/following/${id}`);
        return response.data;
    },
    async updateAttention(postOrDelete, attFollower, attType, attFollowed) {
        if (postOrDelete == 'post') {
            const response = await apiClient.post(`/attention`, {
                attFollower,
                attType,
                attFollowed
            });
        } else if (postOrDelete == 'delete') {
            const response = await apiClient.delete(`/attention?attFollower=${attFollower}&attType=${attType}&attFollowed=${attFollowed}`);
        } else {
            return 'updateAttention的postOrDelete属性输入错误'
        }
    },

    // question话题接口
    async fetchQuestionList(listType) {
        let response = null;
        if (listType === "recommend") { // 获取推荐话题列表
            response = await apiClient.get(`/question/recommend`);
            return response.data;
        }
    },
    // 获取话题查询结果
    async fetchSearchQuestionList(keyword) {
        const response = await apiClient.get(`/question/search/${keyword}`);
        return response.data;
    },
    async fetchCurrentQuestion(id) {
        const queResponse = await apiClient.get(`/question/${id}`);
        const autResponse = await apiClient.get(`/user/${queResponse.data.queAuthorId}`);
        const result = { queResponse, autResponse };
        return result;
    },
    async insertQuestion(queTitle, queContent, queAuthorId) { // 新建 question
        const response = await apiClient.post(`/question`, {
            queTitle,
            queContent,
            queAuthorId
        });
        return response.data;
    },

    // question的answer回答接口
    async fetchQueAnswerList(id) {
        const response = await apiClient.get(`/answer/question/${id}`);
        return response.data;
    },
    async updateLikeNum(type, upOrdown, id) {
        if (type == 'answer') {
            if (upOrdown == 'up') {
                const response = await apiClient.post(`/answer/${id}/like`);
                return response.data;
            } else if (upOrdown == 'down') {
                const response = await apiClient.delete(`/answer/${id}/like`);
                return response.data;
            }
        } else if (type == 'question') {
            if (upOrdown == 'up') {
                const response = await apiClient.post(`/question/${id}/like`);
                return response.data;
            } else if (upOrdown == 'down') {
                const response = await apiClient.delete(`/question/${id}/like`);
                return response.data;
            }
        }
        return 'failed updateLikeNum';
    },

    // answer 回答接口
    async insertAnswer(ansAuthorId, ansQueId, ansContent) {
        const response = await apiClient.post(`/answer`,{
            ansAuthorId,
            ansQueId,
            ansContent
        });
        return response.data;
    },

    // draft 草稿接口
    async insertDraft(draAuthorId, draType, draTitle, draContent) {
        await apiClient.post(`/draft`, {
            draAuthorId,
            draType,
            draTitle,
            draContent
        });
    },
    async fetchQueDraft(userId) {
        const response = await apiClient.get(`/draft/question/${userId}`);
        return response.data;
    },
    async fetchAnsDraft(userId) {
        const response = await apiClient.get(`/draft/answer/${userId}`);
        return response.data;
    },
    async deleteDraft(draId) {
        const response = await apiClient.delete(`/draft/${draId}`);
        return response.data;
    },
    
    // article 文章接口
    async fetchRecommendArticle() {
        const response = await apiClient.get(`/article/recommend`);
        return response.data;
    },
    async fetchSearchArticleList(keyword) {
        const response = await apiClient.get(`/article/search/${keyword}`);
        return response.data;
    },
    async createArticle(artAuthorId, artTitle, artContent) {
        const response = await apiClient.post(`/article`, {
            artAuthorId,
            artTitle,
            artContent
        });
        return response.data;
    },
    async updateArticleLikeNum(artId, artLikeNum) {
        const response = await apiClient.put(`/article/like`, {
            artId,
            artLikeNum
        });
        return response.data;
    },

    // test和option 题库接口
    async fetchTestAndOption() {
        const test = await apiClient.get(`/test`);
        const option = await apiClient.get(`/option`);
        const response = { test, option };
        return response;
    }
}