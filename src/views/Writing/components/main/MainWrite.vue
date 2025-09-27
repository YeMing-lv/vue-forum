<script setup>
import { onMounted, ref, watch } from 'vue';
import { formatUTCtoLocal } from '../../../../utils/timeUtils';

const value1 = ref(Date.now() + 1000 * 60 * 60 * 7);
const value2 = ref(formatUTCtoLocal(new Date()));

const ifLoading = ref(false);

onMounted(() => {
    ifLoading.value = true;


    ifLoading.value = false;
})

</script>

<template>
    <el-row class="row">
        <el-col :span="6" class="col">
            <el-statistic title="近日浏览数" :value="212019"></el-statistic>
        </el-col>
        <el-col :span="4" class="col">
            <el-statistic>
                <template #title>
                    <div>插槽标题</div>
                </template>
                <template #suffix>/100</template>
            </el-statistic>
        </el-col>
        <el-col :span="6" class="col">
            <el-statistic :value="value2"></el-statistic>
            <el-countdown title="Remaining VIP time" format="HH:mm:ss" :value="value1" />
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.row {
    padding: 20px;

    .row el-col {
        background: #d0d0d0;
    }

    .col {}
}
</style>