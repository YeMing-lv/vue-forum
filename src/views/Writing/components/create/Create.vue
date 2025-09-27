<script setup>
import { useRoute } from 'vue-router';
import Editor from '../../../../components/Editor/Editor.vue';
import { ref, computed, watch } from 'vue';

const route = useRoute();
const editorType = computed(() => route.params.type);
const ifLoading = ref(false);

watch(editorType, (newV, oldV) => {
    ifLoading.value = true;
    setTimeout(() => {
        ifLoading.value = false
    }, 800);
})
</script>

<template>
    <el-row v-loading="ifLoading">
        <Editor v-if="!ifLoading" :editorType="editorType" />
    </el-row>
</template>

<style lang="scss" scoped></style>