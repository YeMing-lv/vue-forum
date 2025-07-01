import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import myrequest from '../api/request';

/** vue-router路由表
 * 路由用 query 传递参数
 * */
const routes = [
    {
        path: '/',
        redirect: '/main'
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import("../views/Main/Main.vue")
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("../views/Login/Login.vue")
    },
    {
        path: '/question',
        name: 'Question',
        component: () => import("../views/QuestionDetail/QuestionDetail.vue")
    },
    {
        path: '/article',
        name: 'Article',
        component: () => import("../views/Article/Article.vue")
    },
    {
        path: '/articleDetail',
        name: 'ArticleDetail',
        component: () => import("../views/ArticleDetail/ArticleDetail.vue")
    },
    {
        path: '/writting',
        name: 'Writting',
        component: () => import("../views/Writing/Writing.vue")
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import("../views/Search/Search.vue")
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("../views/NotFound/NotFound.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由跳转依据 token 做登录验证
router.beforeEach(async (to, from, next) => {
    if (to.path === '/login') { // 如果跳转到登录页面就清除token 登录用户数据就没法在这改了
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
            await myrequest.checkToken().then((response) => {
                if (response.code != 200) {
                    console.log('token校验失败');
                    next({ name: 'Login', query: { redirect: to.fullPath } });
                } else {
                    next();
                }
            });
        }
    }
});

export default router;