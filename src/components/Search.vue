<script setup>
import { ref, computed } from 'vue';
import Header from './other/Header.vue';
import QueList from './other/QueList.vue';
import { useQueStore } from '../other/store/quePinia';

const queStore = useQueStore();

const questionList = computed(() => queStore.questionList);

const activeMenuIndex = ref(2);
</script>

<template>
    <div class="search">
        <el-backtop :right="100" :bottom="100" />
        <div class="header">
            <Header />
        </div>
        <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal" @select="handleSelect()">
            <el-menu-item index="1" disabled>综合</el-menu-item>
            <el-menu-item index="2">话题</el-menu-item>
            <el-menu-item index="3" disabled>文章</el-menu-item>
            <el-menu-item index="4" disabled>用户</el-menu-item>
        </el-menu>
        <div class="container content">
            <div class="search-list">
                <QueList :question-list="questionList" />
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