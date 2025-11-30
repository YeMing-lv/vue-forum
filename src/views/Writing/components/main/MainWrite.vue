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
    <el-row class="row" :gutter="20">
        <el-col :span="6" class="col">
            <div class="col-content"> <el-statistic title="近 7 日浏览数" :value="212019"></el-statistic>
            </div>
        </el-col>
        <el-col :span="6" class="col">
            <div class="col-content">
                <el-statistic title="近 7 日点赞数" :value="2019"></el-statistic>
            </div>
        </el-col>
        <el-col :span="6" class="col">
            <div class="col-content">
                <el-statistic title="近 7 日关注增长数" :value="19"></el-statistic>
            </div>
        </el-col>
        <el-col :span="6" class="col">
            <div class="col-content">
                <el-statistic>
                    <template #title>
                        <span>近 7 日发表话题 / 文章</span>
                    </template>
                    <template #suffix>/10</template>
                </el-statistic>
            </div>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.row {
    padding: 20px;

    .col {

        .col-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100px;
            min-width: 150px;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
    }

}
</style>