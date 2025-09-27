import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
// 实例化axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8082',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
apiClient.interceptors.request.use(
    config => {
        // 发请求前做的一些处理，数据转化，配置请求头，!!设置token,设置loading等，根据需求去添加
        //注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
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
        const res = response.data
        // 如果返回的是文件流，直接返回
        if (response.config.responseType === 'blob') {
            return response
        }
        // 正常返回数据
        if (res.code === 200) {
            return response
        }

        // 处理特定错误码
        if (res.code === 401) {
            ElMessage.error('登录已过期，请重新登录')
            localStorage.removeItem('token')
            router.push('/login')
        } else {
            ElMessage.error(res.message || '请求失败')
        }

        return response
    },
    error => {
        console.error('响应错误:', error)

        // 处理401错误
        if (error.response && error.response.status === 401) {
            ElMessage.error('登录已过期，请重新登录')
            localStorage.removeItem('token')
            router.push('/login')
        } else {
            const errorMsg = error.response?.data?.message || error.message || '请求失败，请稍后重试'
            ElMessage.error(errorMsg)
        }

        return {
            success: false,
            data: null,
            message: error.message || '请求失败，请稍后重试'
        }
    }
);

export default apiClient;