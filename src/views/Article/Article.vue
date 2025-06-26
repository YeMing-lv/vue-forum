<script setup>
import { computed, onMounted, ref } from 'vue';
import Header from '../../components/Container/Header.vue';
import ArtList from '../../components/List/ArtList.vue';
import { useArtStore } from '../../store/artPinia';

const artStore = useArtStore();

const articleList = computed(() => artStore.articleList);

const activeMenuIndex = ref('2'); // 内容列表导航栏索引

onMounted(async () => {
    await artStore.fetchArticleList('recommend');
})

// 内容列表导航栏 选择处理
const handleSelect = () => {

}

</script>

<template>
    <div class="article">
        <div>
            <Header headerNav="2" />
        </div>
        <div class="container content">
            <div class="content-article">
                <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal"
                    @select="handleSelect()">
                    <el-menu-item index="1" disabled>关注</el-menu-item>
                    <el-menu-item index="2">推荐</el-menu-item>
                    <el-menu-item index="3" disabled>热榜</el-menu-item>
                </el-menu>
                <ArtList :article-list="articleList" />
            </div>
            <div class="content-aside">
                其它
                <!-- <div>
                    小创作中心
                </div> -->
                <!-- <div>
                    文章推荐
                </div>
                <div>
                    推荐关注
                </div> -->
            </div>
            <el-backtop :right="100" :bottom="100" />
        </div>
    </div>

</template>

<style scoped>
.content {
    display: flex;
    width: 1050px;
    margin: 10px auto;
}

.content-article {
    flex-grow: 2;
    margin-right: 10px;
    padding: 10px;
    box-shadow: 0 1px 8px #d0d0d0;
}

.content-menu {
    height: 40px;
}

.content-aside {
    min-width: 270px;
    padding: 10px;
    box-shadow: 0 1px 8px #d0d0d0;
}
</style>