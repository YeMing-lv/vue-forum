<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import QueList from '../../components/List/QueList.vue';
import { useQueStore } from '../../store/quePinia';
import { computed, onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const queStore = useQueStore();

// 在页面挂载前 获取数据
onMounted(async () => {
    await queStore.fetchQuestionList("recommend");
})

const questionList = computed(() => queStore.questionList);

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
                <QueList :question-list="questionList" />
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
        <el-footer style="border: 1px solid">Footer</el-footer>
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