<script setup>
import { useRouter } from 'vue-router';
import { useArtStore } from '../../../store/artPinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { throttle } from '../../../utils/throttle';
import { formatUTCtoLocal } from '../../../utils/timeUtils';
import { Collection } from '@element-plus/icons-vue';

const router = useRouter();
const artStore = useArtStore();

const props = defineProps(['userId']);
const articleList = computed(() => artStore.articleList);

const ifNull = ref(false);
const ifLoading = ref(false);
const ifShowMore = ref(false);

onMounted(async () => {
    ifLoading.value = true;

    artStore.initList();
    await artStore.fetchArticleByAuthorId(props.userId);

    handleIfNull();

    ifLoading.value = false;
})

onUnmounted(() => {
    artStore.initList();
})

const handleScrollShowMore = async () => {
    if (ifShowMore.value) {
        // 调用分页查询
        await artStore.fetchArticleByAuthorId(props.userId);

        handleIfShowMore();
    }
}
const throttledScrollHandler = throttle(handleScrollShowMore, 1000);

// 是否还有列表数据要显示
function handleIfShowMore() {
    // console.log(questionList.value);
    // console.log(queStore.page.total);
    if (articleList.value != null) {
        if (articleList.value.length < artStore.page.total) {
            ifShowMore.value = true;
        } else {
            ifShowMore.value = false;
        }
    }
}

// 判断列表是否为空
function handleIfNull() {
    if (articleList.value.length === 0) {
        ifNull.value = true;
    } else {
        ifNull.value = false;
    }
}

// 跳转 文章页面
const toArticle = (id) => {
    router.push({
        path: '/article',
        query: { id: id }
    })
}
</script>

<template>
    <div v-infinite-scroll="throttledScrollHandler" class="userQuetion-list">
        <div v-if="!ifNull" class="list-item" v-for="a in articleList">
            <div class="content" @click="toArticle(a.artId)">
                <span class="title">{{ a.artTitle }}</span>
            </div>
            <div class="foot">
                <span>{{ formatUTCtoLocal(a.artTime) }}；{{ a.artLikeNum }}个点赞</span>
            </div>
            <el-divider></el-divider>
        </div>
        <div v-if="ifNull" class="null">
            <el-icon size="100px">
                <Collection />
            </el-icon>
            你还没有创建文章！
        </div>
        <el-skeleton v-if="ifLoading" />
    </div>
</template>

<style lang="scss" scoped>
.userQuetion-list {
    display: flex;
    position: relative;
    flex-direction: column;

    min-height: 300px;

    .list-item {
        margin-top: 10px;

        .content {
            margin-top: 5px;
            cursor: pointer;

            .title {
                font-size: large;
                font-weight: bolder;
            }
        }

        .foot {
            display: flex;
            font-size: 14px;
            font-weight: 200px;
        }
    }

    .null {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

}
</style>