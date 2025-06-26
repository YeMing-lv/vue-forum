<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from '../../components/Container/Header.vue';
import Editor from '../../components/Editor/Editor.vue';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

onMounted(() => {
    console.log(localStorage.getItem("token"));
});

</script>

<template>
    <div class="writting">
        <el-backtop :right="100" :bottom="100" />
        <Header headerNav="3"/>
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