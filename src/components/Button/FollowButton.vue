<script setup>
import { useUserStore } from '../../store/userPinia';
import { useQueStore } from '../../store/quePinia';
import { useArtStore } from '../../store/artPinia';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const queStore = useQueStore();
const artStore = useArtStore(); // ???

const props = defineProps(['followedId', 'type', 'parentType']);

// 判断当前关注关系是 未关注 还是 已关注
const ifFollower = (id) => userStore.ifAttention(id);

// 更改关注关系
const changeFollower = async () => {
    if (props.followedId == null && props.type == null) {
        return;
    }
    const ifF = ifFollower(props.followedId);

    if (ifF == true) { // 已关注
        await userStore.deleteAttention(props.type, props.followedId , props.parentType).then((result) => {
            // console.log(result);
            if (!result) {
                ElMessage.error("取消关注失败")
            }
        });
    } else if (ifF == false) { // 未关注
        await userStore.insertAttention(props.type, props.followedId, props.parentType).then((result) => {
            if (!result) {
                ElMessage.error("关注失败")
            }
        });
    }
}
</script>

<template>
    <el-button :type="ifFollower(props.followedId) ? 'info' : ''" @click="changeFollower" style="float: right;">
        {{ ifFollower(props.followedId) ? "已关注" : "+关注" }}
    </el-button>
</template>

<style scoped></style>