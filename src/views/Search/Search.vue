<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import QueList from '../../components/List/QueList.vue';
import ArtList from '../../components/List/ArtList.vue';

const route = useRoute();
const router = useRouter();

const searchKeyword = route.query.keyword;

const activeMenuIndex = ref('2');

// 导航栏 选择
const handleSelect = async (key, keyPath) => {
    activeMenuIndex.value = key;
}
</script>

<template>
    <div class="search">
        <el-backtop :right="100" :bottom="100" />
        <div class="header">
            <Header headerNav="0" :history="searchKeyword" />
        </div>
        <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" disabled>综合</el-menu-item>
            <el-menu-item index="2">话题</el-menu-item>
            <el-menu-item index="3">文章</el-menu-item>
            <el-menu-item index="4" disabled>用户</el-menu-item>
        </el-menu>
        <div class="container content">
            <div class="search-list">
                <QueList v-if="activeMenuIndex === '2'"
                    type="search" keyword="{{ searchKeyword }}" />
                <ArtList v-if="activeMenuIndex === '3'" type="search" :keyword="searchKeyword" />
            </div>
            <div class="aside">
                其它
            </div>
        </div>
    </div>

</template>

<style scoped>
.content-menu {
    padding: 0 155px;
}

.content {
    display: flex;
    padding: 10px;
}

.search-list {
    flex-grow: 2;
    margin-right: 10px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.aside {
    min-width: 270px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}
</style>