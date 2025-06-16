<script setup>
import { useRoute, useRouter } from 'vue-router';
import myrequest from '../other/api/request';
import Header from './other/Header.vue';
import Editor from './other/Editor.vue';
import { useNavStore } from '../other/store/navPinia';

import { onBeforeUnmount, ref, shallowRef, onBeforeMount, reactive } from 'vue';


const route = useRoute();
const router = useRouter();
const navStore = useNavStore();

onBeforeMount(async () => {
    navStore.headerNavActive = 3;
    console.log(localStorage.getItem("token"));

});

</script>

<template>
    <div class="writting">
        <el-backtop :right="100" :bottom="100" />
        <Header />
        <Editor editor-type="question" />
    </div>
</template>

<style scoped>
.writting {
    min-height: 100vh;
    /* 确保容器高度至少占满视口 */
    overflow: visible;
    /* 防止溢出限制定位 */
}

</style>