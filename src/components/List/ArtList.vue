<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useArtStore } from '../../store/artPinia';

import { throttle } from '../../utils/throttle';

const router = useRouter();
const artStore = useArtStore();

const props = defineProps(['type', 'keyword']); // 类别 和 关键词（用于调用分页查询）

const articleList = computed(() => artStore.articleList);

const ifLoading = ref(false); // 加载状态
const ifShowMore = ref(false); // 是否有更多文章可以显示

// 获取文章列表数据
onMounted(async () => {
    ifLoading.value = true; // 显示加载动画
    artStore.init();

    // 获取列表
    if (props.type === 'recommend') {
        await artStore.fetchArticleList("recommend").then(() => {
            ifLoading.value = false; // 隐藏加载动画
        });
    } else if (props.type === 'search') {
        await artStore.fetchSearchArticleList(props.keyword).then(() => {
            ifLoading.value = false;
        });
    }

    handleIfShowMore();
    // console.log(ifShowMore.value);

    // 页面下滑事件监听
    window.addEventListener('scroll', throttledScrollHandler);
})

onUnmounted(() => {
    // 数据初始化
    artStore.init();
    // 销毁监听器
    window.removeEventListener('scroll', throttledScrollHandler);
})

// 跳转到文章页面
const toArticle = (id) => {
    router.push({
        path: '/articleDetail',
        query: { id: id }
    });
}

// 滚动 显示更多的话题
const handleScrollShowMore = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    // console.log(scrollTop + clientHeight)
    // console.log(scrollHeight)

    ifLoading.value = true; // 显示加载动画
    // 当滚动到底部时触发
    // ??? 不灵敏 ???
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (ifShowMore.value) {

            // console.log("showMore")
            // 获取 新分页
            // 1.更新页面参数
            if (artStore.page.currentPage === 1) { // 第一次分页后从 第3页开始
                artStore.page.currentPage = 3;
            } else {
                artStore.page.currentPage++; // 增加页码
            }
            if (artStore.page.pageSize !== 3) { // 尺寸改为3
                artStore.page.pageSize = 3;
            }
            // 2.调用新分页函数
            if (props.type === 'recommend') {
                artStore.fetchArticleList(props.type);
            } else if (props.type === 'search') {
                artStore.fetchSearchArticleList(props.keyword);
            }

            handleIfShowMore();
        }
    }
    ifLoading.value = false; // 隐藏加载动画
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 是否还有列表数据要显示
function handleIfShowMore() {
    // console.log(articleList.value);
    // console.log(artStore.page.total);
    if (articleList.value != null) {
        if (articleList.value.length < artStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

// 处理HTML数据
const processedHTML = (htmlInput) => {
    let text = htmlInput.replace(/<[^>]+>/g, '');
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

</script>

<template>
    <div class="content-list" v-for="art in articleList">
        <div class="content-title" @click="toArticle(art.artId)">{{ art.artTitle }}</div>
        <div class="content-main" @click="toArticle(art.artId)">
            <img v-if="art.artCover != null" class="art-cover" :src="art.artCover" alt="文章封面">
            <span v-if="art.artContent != null" class="art-content"> {{ processedHTML(art.artContent) }}</span>
        </div>
        <el-divider></el-divider>
    </div>
    <el-main v-if="ifLoading">
        <el-skeleton />
    </el-main>
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