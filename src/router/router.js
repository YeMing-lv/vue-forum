import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import { checkToken } from "../api/token";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";

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
        component: () => import("../views/Writing/Writing.vue"),
        redirect: '/writting/main',
        children: [
            {
                path: 'main',
                name: 'WrittingMain',
                component: () => import("../views/Writing/components/main/MainWrite.vue")
            },
            {
                path: 'create/:type',
                name: 'Create',
                component: () => import("../views/Writing/components/create/Create.vue")
            },
            {
                path: 'analytics/:type',
                name: 'Analytics',
                component: () => import("../views/Writing/components/analytics/ContentAnalyse.vue")
            },
            {
                path: 'followers',
                name: 'Followers',
                component: () => import("../views/Writing/components/analytics/Followers.vue")
            }
        ]
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import("../views/Search/Search.vue")
    },
    {
        path: '/userCenter',
        name: 'UserCenter',
        component: () => import("../views/UserCenter/UserCenter.vue")
    },

    {
        path: '/A',
        name: 'A',
        component: () => import("@/test_vue2/A.vue")
    },

    
    {
        path: '/:pathMatch(.*)',
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
    next();

    // if (to.path === '/login') { // 如果跳转到登录页面就清除token 登录用户数据就没法在这改了
    //     localStorage.removeItem("token");
    //     next();
    // } else {
    //     // 跳转其它页面就通过判断 token 是否有效
    //     // 来决定是正常跳转，还是跳转到login登录页面
    //     const token = localStorage.getItem("token");

    //     if (token === null || token === '' || !token) { // token 为空则跳转登录页面
    //         next({ name: 'Login', query: { redirect: to.fullPath } });
    //     } else {
    //         // 发送请求校验 token 是否正确
    //         try {
    //             const result = await checkToken();
    //             if (result.code != 200) {
    //                 console.error('token校验失败:', result.message);
    //                 next({ name: 'Login', query: { redirect: to.fullPath } });
    //             } else {
    //                 next();
    //             }
    //         } catch (error) {
    //             console.error("请求检验token失败:", error);
    //             next({ name: 'Login', query: { redirect: to.fullPath } });
    //         }

    //     }
    // }
});

export default router;