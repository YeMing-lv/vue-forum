<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../../other/store/userPinia';
import { useNavStore } from '../../other/store/navPinia';
import { useRoute, useRouter } from 'vue-router';
import { Search, BellFilled, Comment, Avatar, Setting, SwitchButton } from '@element-plus/icons-vue';

const userStore = useUserStore();
const navStore = useNavStore();
const route = useRoute();
const router = useRouter();

const headerNavActive = computed(() => navStore.headerNavActive);
const userHeadImage = computed(() => userStore.user.userHead);

const outLogin = () => {
    localStorage.setItem('isLoggedIn', false);
    userStore.cleanUser();
    const redirectPath = route.query.redirect || '/login';
    router.push(redirectPath);
}

// onMounted(() => console.log(headerNavActive.value))

</script>

<template>
    <div class="header">
        <div class="header-container">
            <div class="header-logo">
                <router-link to="/"><img src="../../../public/image/forumLogo.png" alt="forumLogo"></router-link>
            </div>
            <div class="header-nav">
                <ul>
                    <li :class="{ active: headerNavActive === 1 }"><router-link to="/main"
                            style="color: inherit;">首页</router-link></li>
                    <li :class="{ active: headerNavActive === 2 }"><router-link to=""
                            style="color: inherit;">文章</router-link></li>
                    <li :class="{ active: headerNavActive === 3 }"><router-link to=""
                            style="color: inherit;">创作</router-link></li>
                </ul>
            </div>
            <div class="header-search">
                <el-autocomplete :suffix-icon="Search" />
            </div>
            <div class="header-user">
                <ul>
                    <li><el-icon>
                            <BellFilled />
                        </el-icon>消息</li>
                    <li><el-icon>
                            <Comment />
                        </el-icon>私信</li>
                    <li>
                        <el-popover placement="bottom" trigger="click">
                            <div class="header-user-head"><el-icon>
                                    <Avatar />
                                </el-icon>我的主页</div>
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