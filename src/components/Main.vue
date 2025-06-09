<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from './other/Header.vue';
import { useQueStore } from '../other/store/quePinia';
import { useAnsStore } from '../other/store/ansPinia';
import { useNavStore } from '../other/store/navPinia';
import { computed, onBeforeMount, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const queStore = useQueStore();
const ansStore = useAnsStore();
const navStore = useNavStore();

const currentQueId = computed(() => queStore.currentQuestion.value.queId);

// 跳转到话题页面，要先获取que话题和对应ans回答数据
const toQuestion = async (id) => {
    await queStore.fetchCurrentQuestion(id).then(
        ansStore.fetchQueAnswerList(id)
    )
    router.push('/question');
}

onMounted(() => navStore.headerNavActive = 1);

</script>

<template>
    <div class="main">
        <Header />
        <div class="container content">
            <div class="content-question">
                话题部分<el-button @click="toQuestion(101103)">测试话题组件</el-button>
            </div>
            <div class="content-aside">
                <div>
                    小创作中心
                </div>
                <div>
                    贴吧推荐
                </div>
                <div>
                    推荐关注
                </div>
            </div>
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

.content-aside {
    padding: 10px;
    box-shadow: 0 1px 8px #d0d0d0;

}
</style>