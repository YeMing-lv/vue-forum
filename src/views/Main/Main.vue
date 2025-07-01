<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import QueList from '../../components/List/QueList.vue';
import { onUnmounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();

/** 目前 目前首页 又或者是所有页面
 * 大多都不需要进行数据的获取，发送请求
 * 因为数据的展示大多都在固定的组件，所以也为了方便直接获取数据、设置加载动画等
 * 要求数据获取、处理等多在组件，而不是页面
 * 页面只需要 props 传参数设置，接收 emits 等即可
 * 有了Pinia，project都没什么用。
 * 对了
 * 记得组件对于经常要复用的变量，要在组件取消挂载式，销毁数据
 * 节省内存
 */

/**
 * 这生命周期钩子函数，在页面刷新的时候不会调用的！！！！！
 */
// onUnmounted()

const activeMenuIndex = ref('2');

// 导航栏 选择处理
const handleSelect = () => {

}

</script>

<template>
    <div class="main">
        <Header headerNav="1" />
        <div class="container content">
            <div class="content-question">
                <el-menu :default-active="activeMenuIndex" class="content-menu" mode="horizontal"
                    @select="handleSelect()">
                    <el-menu-item index="1" disabled>关注</el-menu-item>
                    <el-menu-item index="2">推荐</el-menu-item>
                    <el-menu-item index="3" disabled>热榜</el-menu-item>
                </el-menu>
                <QueList type="recommend" />
            </div>
            <div class="content-aside">
                <div>
                    小创作中心
                </div> -->
                <div>
                    文章推荐
                </div>
                <div>
                    推荐关注
                </div>
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

.content-question {
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