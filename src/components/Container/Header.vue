<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../../store/userPinia';
import { useQueStore } from '../../store/quePinia';
import { useRouter } from 'vue-router';
import { Search, BellFilled, Avatar, Setting, SwitchButton, Clock } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const queStore = useQueStore();

//                          导航栏索引   搜索框历史输入
const props = defineProps(['headerNav', 'history']);
const userHeadImage = computed(() => userStore.user.userHead);
const autoComQuestionList = computed(() => queStore.searchAutoCompleteQuestionList);

// 输入框输入
const searchInput = ref(props.history); // 显示上一次的 历史搜索

onMounted(() => {
    // console.log(headerNavActive.value)
})

// 退出登录
const outLogin = () => {
    userStore.initUser(); // 清除 UserStore
    router.push('/login'); // 跳到登录页面时 会自动清除token的
}

// 获取补全输入数据列表
const handleQuestionSearch = (queryString, cb) => {
    const result = queryString ? autoComQuestionList.value.filter(
        (item) => {
            return (item.queTitle.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        }
    )
        : autoComQuestionList.value;
    cb(result);
}

// 选择补全列表的话题 跳转话题页面
const handleSearchSelect = (item) => {
    // 过滤数据类型
    if (typeof item.value === "undefined") { // 点击补全输入框里的话题
        router.push({
            path: '/question',
            query: { id: item.queId }
        });
    } else if (item.value !== '') { // 输入关键词搜索
        // queStore.fetchSearchQuestionList(item.value);
        router.push({
            name: 'Search',
            query: { keyword: item.value } // 路由传参数keyword
        });
    }
}

</script>

<template>
    <div class="header">
        <div class="header-container">
            <div class="header-logo">
                <router-link to="/"><img src="../../../public/image/forumLogo.png" alt="forumLogo"></router-link>
            </div>
            <div class="header-nav">
                <ul>
                    <li :class="{ active: props.headerNav === '1' }"><router-link to="/main"
                            style="color: inherit;">首页</router-link></li>
                    <li :class="{ active: props.headerNav === '2' }"><router-link to="/article"
                            style="color: inherit;">文章</router-link></li>
                    <li :class="{ active: props.headerNav === '3' }"><router-link to="/writting"
                            style="color: inherit;">创作</router-link></li>
                </ul>
            </div>
            <div class="header-search">
                <el-autocomplete :suffix-icon="Search" v-model="searchInput" value-key="queTitle"
                    :fetch-suggestions="handleQuestionSearch" clearable class="search-input" placeholder="请输入关键词"
                    @select="handleSearchSelect" select-when-unmatched />
            </div>
            <div class="header-user">
                <ul>
                    <li>
                        <el-icon>
                            <BellFilled />
                        </el-icon>消息
                    </li>
                    <li>
                        <el-icon>
                            <Clock />
                        </el-icon>历史
                    </li>
                    <li>
                        <el-popover placement="bottom" trigger="click">
                            <div class="header-user-head"><router-link to="/usercenter"
                                    style="color: inherit;"><el-icon>
                                        <Avatar />
                                    </el-icon>我的主页</router-link>
                            </div>
                            <div class="header-user-head"><el-icon>
                                    <Setting />
                                </el-icon>设置</div>
                            <div class="header-user-head" @click="outLogin"><el-icon>
                                    <SwitchButton />
                                </el-icon>退出</div>
                            <template #reference>
                                <el-avatar :src="userHeadImage" />
                            </template>
                        </el-popover>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    min-width: 100vw;
    height: 50px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.header-container {
    display: flex;
    margin: auto 151px;
    height: 50px;
    align-items: center;
}

.header-logo {
    float: left;
    margin-right: 40px;
}

.header-logo img {
    width: 45px;
    height: 45px;
    cursor: pointer;
}

/* .header-nav {} */

.header-nav ul {
    list-style-type: none;
}

.header-nav li {
    float: left;
    margin: auto 20px;
    color: #a0a0a0;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    transition: all 0.6s;
}

.header-nav li:hover {
    color: black;
}

.header-nav li.active {
    color: black;
    border-bottom: 5px #409EFF solid;
}

.header-search {
    flex-grow: 2;
    margin: 0 40px;
}

.header-user {}

.header-user ul {
    list-style-type: none;
}

.header-user li {
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto 15px;
    color: #707070;
    font-size: 14px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    cursor: pointer;
}

.header-user li:hover {
    color: #505050;
}

.header-user li img {
    width: 20px;
    height: 20px;
}

.header-user-head {
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 16px;
    cursor: pointer;
}

.header-user-head:hover {
    background: #d0d0d0;
}
</style>