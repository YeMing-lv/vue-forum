<script setup>
import { computed, onMounted, onBeforeMount, ref } from 'vue';

import { useUserStore } from '../../other/store/userPinia';

import { formatUTCtoLocal } from '../../other/utils/timeUtils';

const userStore = useUserStore();

const draftList = computed(() => {
    if (prop.draftType === 'question') {
        return userStore.queDraft;
    } else {
        return userStore.ansDraft;
    }
});

const prop = defineProps(['draftType']);
const emit = defineEmits(['editDraft']);

const activeNullDraft = ref(false);

// 编辑 点击事件
const edit = (draft) => {
    emit("editDraft", draft);
}

// 删除 点击事件
const deleteDraft = async (draId) => {
    await userStore.deleteDraft(draId);
}

onBeforeMount(async () => {
    // 获取登录用户的 草稿
    if (prop.draftType === 'question') {
        await userStore.fetchQueDraft().then(() => {
            if (userStore.queDraft.length == 0) { // 没有草稿
                activeNullDraft.value = true;
            }
        });
    } else {
        await userStore.fetchAnsDraft().then(() => {
            if (userStore.ansDraft.length == 0) { // 没有草稿
                activeNullDraft.value = true;
            }
        });
    }
})

</script>

<template>
    <div class="draft">
        <div class="draft-list" v-for="draft in draftList">
            <div class="title">标题：{{ draft.draTitle }}</div>
            <div v-html="draft.draContent"></div>
            <div class="time">更新时间：{{ formatUTCtoLocal(draft.draUpdatedAt) }}</div>
            <div class="time">
                创建时间：{{ formatUTCtoLocal(draft.draCreatedAt) }}
                <el-button type="primary" style="float: right;" @click="edit(draft)">编辑</el-button>
                <el-popconfirm title="确认删除该话题草稿？" placement="top" @confirm="deleteDraft(draft.draId)">
                    <template #reference>
                        <el-button type="danger" plain style="float: right;margin-right: 10px;">删除</el-button>
                    </template>
                </el-popconfirm>
                <el-divider></el-divider>
            </div>
        </div>
        <div v-if="activeNullDraft" class="null-draft">
            <span>你还没有草稿呢！</span>
        </div>
    </div>
</template>

<style scoped>
.draft {
    padding: 20px;
    background: #fff;
}

.draft-list {
    margin-bottom: 20px;
}

.title {
    font-size: large;
    font-weight: 800;
    margin-bottom: 5px;
}

.time:nth-child(1 of .time) {
    margin-top: 10px;
    color: #409eff;
}

.time {
    justify-content: center;
    font-size: small;
    font-weight: 300;
}

.null-draft {
    display: flex;
    height: 600px;
    background: #fff;
    justify-content: center;
    align-items: center;
}

.null-draft span {
    padding: 10px;
    border-bottom: 3px solid #409eff;
}
</style>