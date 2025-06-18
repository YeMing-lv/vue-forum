<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Header from './other/Header.vue';
import QueList from './other/QueList.vue';
import ArtList from './other/ArtList.vue';
import { useNavStore } from '../other/store/navPinia';
import { useQueStore } from '../other/store/quePinia';
import { useArtStore } from '../other/store/artPinia';

const navStore = useNavStore();
const queStore = useQueStore();
const artStore = useArtStore();

const searchKeyword = computed(() => navStore.searchKeyword);

const questionList = computed(() => queStore.questionList);

const articleList = computed(() => artStore.articleList);

const activeMenuIndex = ref(0);

const hasSearch = ref(false);

onMounted(() => {
    activeMenuIndex.value = 2;
    navStore.headerNavActive = 0;
    if (questionList.value != null) {
        hasSearch.value = true;
    }
})

onUnmounted(() => {
    navStore.searchKeyword = null;
})

// 导航栏 选择
const handleSelect = async (key, keyPath) => {
    if (key == 3 && searchKeyword.value != null) { // 搜索 文章列表
        await artStore.fetchSearchArticleList(searchKeyword.value);
        activeMenuIndex.value = key;
    }
    activeMenuIndex.value = key;
}
</script>

<template>
    <div class="search">
        <el-backtop :right="100" :bottom="100" />
        <div class="header">
            <Header />
        </div>
        <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" disabled>综合</el-menu-item>
            <el-menu-item index="2">话题</el-menu-item>
            <el-menu-item index="3">文章</el-menu-item>
            <el-menu-item index="4" disabled>用户</el-menu-item>
        </el-menu>
        <div class="container content">
            <div class="search-list">
                <QueList v-if="hasSearch && activeMenuIndex === '2'" :question-list="questionList" />
                <ArtList v-if="hasSearch && activeMenuIndex === '3'" :article-list="articleList" />
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