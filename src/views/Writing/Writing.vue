<script setup>
import { useRoute } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import MainWrite from './components/main/MainWrite.vue'
import Editor from '../../components/Editor/Editor.vue';
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/userPinia';
import { UserFilled } from '@element-plus/icons-vue';

const route = useRoute();
const userStore = useUserStore();

const user = computed(() => userStore.user);

const activeMenuIndex = computed(() => {
    return route.path
})

onMounted(() => {
    // console.log(localStorage.getItem("token"));
});

</script>

<template>
    <div class="writting">
        <el-backtop :right="100" :bottom="100" />
        <Header headerNav="3" />
        <div class="main">
            <el-menu class="main-menu" :default-active="activeMenu" router>
                <div class="user">
                    <img style="width: 60px;border-radius: 6px;" :src="user.userHead" alt="">&nbsp;{{ user.userName }}
                </div>
                <el-divider></el-divider>
                <el-menu-item index="/writting/main">
                    <el-icon>
                        <UserFilled />
                    </el-icon>主页
                </el-menu-item>
                <el-sub-menu>
                    <template #title>内容创作</template>
                    <el-menu-item index="/writting/create/question">话题</el-menu-item>
                    <el-menu-item index="/writting/create/article">文章</el-menu-item>
                </el-sub-menu>
                <el-sub-menu>
                    <template #title>回答话题</template>
                    <el-menu-item index="3-1">话题分类</el-menu-item>
                    <el-menu-item index="3-2">话题搜索</el-menu-item>
                </el-sub-menu>
                <el-sub-menu>
                    <template #title>内容管理</template>
                    <el-menu-item index="4-1">内容管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu>
                    <template #title>数据分析</template>
                    <el-menu-item index="5-1">数据分析</el-menu-item>
                </el-sub-menu>
            </el-menu>
            <div class="content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
%containerDetail {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.writting {

    .main {
        display: flex;
        position: relative;
        margin: 0 auto;
        max-width: 1230px;

        .main-menu {
            @extend %containerDetail;
            position: sticky;
            align-self: flex-start;

            margin-right: 10px;

            min-width: 200px;
            min-height: 700px;
            font-weight: bolder;

            .user {
                display: flex;
                align-items: center;
                padding: 10px;
                font-size: large;
                font-weight: 800;
            }

            .sub-menu {
                margin: 0;
                padding: 0;
            }
        }

        .content {
            @extend %containerDetail;

            width: 100%;
            min-height: 700px;

            margin-right: 10px;
        }
    }
}
</style>