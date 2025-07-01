import axios from "axios";

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
            config.headers.Authorization = token; // 后端要求把 token 放到 header 请求头中
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

    // =========================image接口=======================
    async deleteImage(imagePath) {
        const response = await apiClient.delete(`/image?imagePath=${imagePath}`);
        return response.data;
    },

    // ========================user用户接口====================
    async fetchUserById(userId) {
        const response = await apiClient.get(`/user/${userId}`);
        return response.data;
    },

    /**
     * 用户登录
     * @param {*} account 
     * @param {*} password 
     * @returns 
    */
    async userLogin(account, password) {
        const response = await apiClient.post('/user/login', {
            userAccount: account,
            userPassword: password
        });
        return response.data;
    },

    /**
     * 用户注册
     * @param {*} name 
     * @param {*} account 
     * @param {*} password 
     * @returns 
     */
    async userRegister(name, account, password) {
        const response = await apiClient.post('/user/register', {
            userName: name,
            userAccount: account,
            userPassword: password
        });
        return response.data;
    },

    /**
     * 检查Token
     * @returns 
     */
    async checkToken() {
        const response = await apiClient.post(`/checkToken`);
        console.log(response);
        return response.data;
    },

    // user的attention关注关系接口
    async fetchAttention(id) {
        const response = await apiClient.get(`/attention/following/${id}`);
        return response.data;
    },

    /**
     * 插入或删除 关注关系
     * @param {*} attFollower 
     * @param {*} attType 
     * @param {*} attFollowed 
     * @returns 
     */
    async insertAttention(attFollower, attType, attFollowed) {
        // console.log(attFollowed, attFollower, attType)
        const response = await apiClient.post(`/attention`, {
            attFollower: attFollower,
            attType: attType,
            attFollowed: attFollowed
        });
        return response.data;
    },

    /**
     * 删除 关注关系
     * @param {*} attId 
     */
    async deleteAttention(attId) {
        const response = await apiClient.delete(`/attention/${attId}`);
        return response.data;
    },

    // ============================question话题接口==================
    /**
     * 获取指定种类 话题列表
     * @param {*} listType 
     * @returns 
     */
    async fetchRecommendQuestionList(page) {
        const response = await apiClient.get(`/question/recommend?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    },

    /**
     * 获取话题查询结果
     * @param {*} keyword 
     * @returns 
     */
    async fetchSearchQuestionList(page, keyword) {
        const response = await apiClient.get(`/question/search/${keyword}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    },

    /**
     * 获取指定ID话题 作者详情
     * @param {*} id 
     * @returns 
     */
    async fetchCurrentQuestion(id) {
        const queResponse = await apiClient.get(`/question/${id}`);
        const autResponse = await apiClient.get(`/user/${queResponse.data.data.queAuthorId}`);
        const result = {
            queResponse: queResponse.data,
            autResponse: autResponse.data
        };
        return result;
    },

    /**
     * 新建 话题
     * @param {*} queTitle 
     * @param {*} queContent 
     * @param {*} queAuthorId 
     * @returns 
     */
    async insertQuestion(queTitle, queContent, queAuthorId) {
        const response = await apiClient.post(`/question`, {
            queTitle,
            queContent,
            queAuthorId
        });
        return response.data;
    },

    /**
     * 增加话题 的浏览数
     * @param {*} id 
     */
    async increaseQueBrowseNum(id) {
        const response = await apiClient.put(`/question/${id}/browse`);
        return response.data;
    },

    /**
     * 更新指定对象 点赞数
     */
    async updateLikeNum(type, id, likeNum) {
        if (type == 'answer') {
            const response = await apiClient.put(`/answer/${id}/like?likeNum=${likeNum}`);
            return response.data;
        } else if (type == 'question') {
            const response = await apiClient.put(`/question/${id}/like?likeNum=${likeNum}`);
            return response.data;
        }
        return 'failed updateLikeNum';
    },

    // ========================answer 回答接口==========================

    /**
     * 获取指定种类、ID answer回答列表
     * @param {*} type 
     * @param {*} page 
     * @param {*} id 
     * @returns 
     */
    async fetchAnswerList(type, page, id) {
        if (type === 'question') {
            const response = await apiClient.get(`/answer/question/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
            return response.data;
        } else if (type === 'article') {
            const response = await apiClient.get(`/answer/article/${id}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
            return response.data;
        }
        console.log(response.data);
    },

    /**
     * 插入新回答
     * @param {*} ansAuthorId 
     * @param {*} ansQueId 
     * @param {*} ansContent 
     * @returns 
     */
    async insertAnswer(ansAuthorId, ansQueId, ansContent) {
        const response = await apiClient.post(`/answer`, {
            ansAuthorId,
            ansQueId,
            ansContent
        });
        return response.data;
    },

    // ====================draft 草稿接口============================
    async insertDraft(draAuthorId, draType, draTitle, draContent) {
        await apiClient.post(`/draft`, {
            draAuthorId,
            draType,
            draTitle,
            draContent
        });
    },

    /**
     * 获取指定 种类草稿箱
     * @param {*} userId 
     * @returns 
     */
    async fetchDraft(id, type) {
        const response = await apiClient.get(`/draft?authorId=${id}&type=${type}`);
        return response.data;
    },

    /**
     * 删除 草稿
     * @param {*} draId 
     * @returns 
     */
    async deleteDraft(draId) {
        const response = await apiClient.delete(`/draft/${draId}`);
        return response.data;
    },

    // ===========================article 文章接口==========================
    /**
     * 获取指定ID 文章和作者
     * @param {*} id 
     */
    async fetchCurrentArticle(id) {
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
    },

    /**
     * 获取推荐 文章列表
     * @returns 
     */
    async fetchRecommendArticle(page) {
        const response = await apiClient.get(`/article/recommend?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    },

    /**
     * 关键词搜索 文章列表
     * @param {*} keyword 
     * @returns 
     */
    async fetchSearchArticleList(page, keyword) {
        const response = await apiClient.get(`/article/search/${keyword}?currentPage=${page.currentPage}&pageSize=${page.pageSize}`);
        return response.data;
    },

    /**
     * 创建 文章
     * @param {*} artAuthorId 
     * @param {*} artTitle 
     * @param {*} artContent 
     * @returns 
     */
    async createArticle(artAuthorId, artTitle, artContent) {
        const response = await apiClient.post(`/article`, {
            artAuthorId,
            artTitle,
            artContent
        });
        return response.data;
    },

    /**
     * 更新文章点赞
     * @param {*} artId 
     * @param {*} artLikeNum 
     * @returns 
     */
    async updateArticleLikeNum(artId, artLikeNum) {
        const response = await apiClient.put(`/article/like`, {
            artId,
            artLikeNum
        });
        return response.data;
    }

}