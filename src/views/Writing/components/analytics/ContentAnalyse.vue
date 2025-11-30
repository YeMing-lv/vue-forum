<script setup>
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const router = useRoute();
// 最近多少天 数据
const timeBetween = ref(7);
const timeList = [7, 14, 30, 'all'];

onMounted(() => {
    document.title = "内容分析-创作中心";
});

// 修改 timeBetween 
const updateTimeBetween = (value) => {
    timeBetween.value = value;
}

</script>

<template>
    <el-menu default-active="all" mode="horizontal" :ellipsis="false">
        <el-menu-item index="all">
            <template #title>
                全部
            </template>
        </el-menu-item>
        <el-menu-item index="question">
            <template #title>
                话题
            </template>
        </el-menu-item>
        <el-menu-item index="article">
            <template #title>
                文章
            </template>
        </el-menu-item>
        <el-menu-item index="answer">
            <template #title>
                回答
            </template>
        </el-menu-item>
    </el-menu>
    <div class="data-overview">
        <div class="title">数据总览</div>
        <div class="overview">
            <div class="select-time">
                <span :class="{ active: ti == timeBetween.value }" v-for="ti in timeList" :key="ti"
                    @click="updateTimeBetween(ti)">
                    {{ typeof ti === 'string' ? "累计" : "最近 " + ti + " 天" }}
                </span>
            </div>
            <div class="data-list">
                <span>阅读总量</span>
                <span>赞同总量</span>
                <span>喜欢总量</span>
                <span>评论总量</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.data-overview {

    .title {
        margin: 10px 0 10px 10px;
        font-weight: 500;
    }

    .overview {
        margin: 0 10px 10px 10px;
        padding: 20px;
        min-height: 400px;
        border: 0.5px solid #d0d0d0;

        .select-time span {
            margin-right: 15px;
            padding-right: 15px;
            border-right: 2px solid #7c7c7c;
            color: #7c7c7c;
            cursor: pointer;
        }

        .select-time span .active {
            color: #409eff;
        }

        .select-time :last-child {
            border-right: none;
        }

        .data-list {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            .data {}

        }
    }
}
</style>