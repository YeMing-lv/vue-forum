import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Main from "../components/Main.vue";
import Login from "../components/Login.vue";
import Question from "../components/Question.vue";
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
        component: Main,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/question',
        name: 'Question',
        component: Question,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由跳转依据 token 做登录验证
router.beforeEach((to, from, next) => {
    if (to.path === '/login') { // 如果跳转到登录页面就清除token和user登录用户数据
        localStorage.removeItem("token");
        next();
    } else {
        // 跳转其它页面就通过判断 token 是否有效
        // 来决定是正常跳转，还是跳转到login登录页面
        let token = localStorage.getItem("token");
        if (token === null || token === '') { // token 为空则跳转登录页面
            next({ name:'Login', query:{ redirect: to.fullPath } });
        } else {
            // 发送请求校验 token 是否正确
            myrequest.checkToken(token).then((response) => {
                if(!response) {
                    console.log('token校验失败');
                    next({ name:'Login', query:{ redirect: to.fullPath } });
                }
            })
            next();
        }
    }
});

export default router;