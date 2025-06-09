import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import Main from "../components/Main.vue";
import Login from "../components/Login.vue";
import Question from "../components/Question.vue";
import NotFound from "../components/NotFound.vue";

const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
}

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
        meta: { requiresAuth: true }
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
        meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated()) { // 注意添加括号调用函数
            next({ name: 'Login', query: { redirect: to.fullPath } });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;