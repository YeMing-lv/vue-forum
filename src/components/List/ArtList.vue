<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArtStore } from '../../store/artPinia';
import { useAnsStore } from '../../store/ansPinia';

const route = useRoute();
const router = useRouter();
const artStore = useArtStore();
const ansStore = useAnsStore();

const props = defineProps(['articleList']); // 接收文章列表数据

const displayArtList = ref(5); // 显示部分列表的索引

const ifShowMore = ref(false); // 是否有更多文章可以显示

onMounted(() => {
    // 是否还有列表数据要显示
    if (props.articleList.length > displayArtList.value) {
        ifShowMore.value = true;
    } else {
        ifShowMore.value = false;
    }
})

// 跳转到文章页面
const toArticle = async (article) => {
    artStore.currentArticle = article;
    await artStore.fetchArticleAuthor(article.artAuthorId).then(
        ansStore.fetchQueAnswerList(article.artId) // 获取文章的评论
    )
    router.push('/articleDetail');
}

// 显示更多的话题
const showMoreArtList = () => {
    const listLength = props.articleList.length;

    if (listLength <= displayArtList.value) return; // 没有更多列表数据了

    displayArtList.value = displayArtList.value + 4;
}

// 监听 是否还有显示数据
watch(displayArtList, (newV, oldV) => {
    if (props.articleList.length > newV) {
        ifShowMore.value = true;
    } else {
        ifShowMore.value = false;
    }
})

// 处理HTML数据
const processedHTML = (htmlInput) => {
    let text = htmlInput.replace(/<[^>]+>/g, '');
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

</script>

<template>
    <div class="content-list" v-for="art in props.articleList.slice(0, displayArtList)">
        <div class="content-title" @click="toArticle(art)">{{ art.artTitle }}</div>
        <div class="content-main" @click="toArticle(art)">
            <img v-if="art.artCover != null" class="art-cover" :src="art.artCover" alt="文章封面">
            <span v-if="art.artContent != null" class="art-content"> {{ processedHTML(art.artContent) }}</span>
        </div>
        <el-divider></el-divider>
    </div>
    <div v-if="ifShowMore === true" class="list-more" @click="showMoreArtList">
        查看更多文章
    </div>
    <div v-if="ifShowMore === false" class="list-end">
        已经到底了
    </div>
</template>

<style scoped>

.content-list {
    padding: 0 10px;
    min-width: 100%;
    max-width: 600px;
}

.content-main {
    cursor: pointer;
}

.content-title {
    margin-bottom: 5px;
    font-size: large;
    font-weight: 800;
    cursor: pointer;
}

.content-main {
    display: flex;
    padding: 10px;
}

.content-main .art-cover {
    margin-right: 5px;
    border-radius: 10px;
    width: 200px;
}

.content-main .art-content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    word-break: break-all;
    /* 允许单词内断行（可选） */
}

.list-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    font-weight: 300;
    background: #fff;
    cursor: pointer;
}

.list-more:hover {
    font-weight: 550;
}

.list-end {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    font-size: 14px;
    background: #fff;
}
</style>