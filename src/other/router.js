import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import NotFound from "../components/NotFound.vue";
import myrequest from "../other/api/request";

// vue-router路由表
const routes = [
    {
        path: '/',
        redirect: '/main'
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import("../components/Main.vue")
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("../components/Login.vue")
    },
    {
        path: '/question',
        name: 'Question',
        component: () => import("../components/Question.vue")
    },
    {
        path: '/writting',
        name: 'Writting',
        component: () => import("../components/Writing.vue")
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("../components/NotFound.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由跳转依据 token 做登录验证
router.beforeEach(async (to, from, next) => {
    if (to.path === '/login') { // 如果跳转到登录页面就清除token和user登录用户数据
        localStorage.removeItem("token");
        next();
    } else {
        // 跳转其它页面就通过判断 token 是否有效
        // 来决定是正常跳转，还是跳转到login登录页面
        const token = localStorage.getItem("token");

        if (token === null || token === '' || !token) { // token 为空则跳转登录页面
            next({ name: 'Login', query: { redirect: to.fullPath } });
        } else {
            // 发送请求校验 token 是否正确
            const response = await myrequest.checkToken(token);

            if (response.code === '500' && response.msg === "token认证失败") {
                console.log('token校验失败');
                next({ name: 'Login', query: { redirect: to.fullPath } });
            } else {
                next();
            }
            
        }
    }
});

export default router;