<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import Header from './other/Header.vue';
import { useNavStore } from '../other/store/navPinia';
import { useTesStore } from '../other/store/testPinia';
import { ElMessage } from 'element-plus';

const navStore = useNavStore();
const tesStore = useTesStore();

const testList = computed(() => tesStore.testList);
const options = computed(() => tesStore.options);

const testAnswer = ref([]);

const answers = ref([]); // 答案

const ifSubmmit = ref(false);

const subResult = ref([]);

onMounted(async () => {
    navStore.headerNavActive = 4;
    await tesStore.fetchTestAndOption().then(() => {
        initTestAnswer()
    })
})

// 计算属性：将 options 按 optTestId 分组
const groupedOptions = computed(() => {
    const map = new Map();
    for (const opt of options.value) {
        if (!map.has(opt.optTestId)) {
            map.set(opt.optTestId, []);
        }
        map.get(opt.optTestId).push(opt);
    }
    return map;
});

// 计算属性：将 testList 与对应的 options 关联
const testsWithOptions = computed(() => {
    if (testList.value != null) {
        return testList.value.map(test => ({
            ...test,
            options: groupedOptions.value.get(test.tesId) || []
        }));
    }
    return;
});

// 根据每个题目种类 初始化testAnswerh和answers
function initTestAnswer() {
    for (const test of testList.value) {
        if (test.tesType === '单选') {
            testAnswer.value.push("5");
        } else if (test.tesType === '多选') {
            testAnswer.value.push([]);
        } else {
            testAnswer.value.push("2");
        }
    }
    const newAnswer = [];
    for (let i = 0; i < testsWithOptions.value.length; i++) {
        const tes = testsWithOptions.value[i];
        if (tes.tesType === '单选') {
            for (let j = 0; j < tes.options.length; j++) {
                if (tes.options[j].optIsCorrect) {
                    newAnswer.push(j.toString());
                    break;
                }
            }
        } else if (tes.tesType === '多选') {
            const correctIndices = [];
            for (let j = 0; j < tes.options.length; j++) {
                if (tes.options[j].optIsCorrect) {
                    correctIndices.push(j.toString());
                }
            }
            newAnswer.push(correctIndices);
        } else {
            for (let j = 0; j < tes.options.length; j++) {
                if (tes.options[j].optIsCorrect) {
                    newAnswer.push(j.toString());
                    break;
                }
            }
        }
    }
    answers.value = newAnswer; // 替换整个数组
}

// 显示答案
const showAnswer = () => {
    testAnswer.value = answers.value;
}

// 提交答卷
const subbmitAnswers = () => {
    const results = []; // 存储每一题的答题情况 true Or false
    let score = 0; // 答对题目数量
    for (let i = 0; i < testAnswer.value.length; i++) {
        const testA = testAnswer.value[i];
        if (testA === answers.value[i]) {
            score++;
            results.push(true);
        } else {
            results.push(false);
        }
    }
    ElMessage.success("共答对" + score + "道题目！");
    subResult.value = results;
    ifSubmmit.value = true;
}

</script>

<template>
    <div class="test">
        <div>
            <Header />
        </div>
        <div class="container test-container">
            <div class="test-list" v-for="(tes, index) in testsWithOptions">
                <div class="test-top">
                    <span>{{ index + 1 }} 、({{ tes.tesType }}) {{ tes.tesQuestion }}</span>
                    <img v-if="ifSubmmit" class="test-result"
                        :src="subResult[index] ? '../../public/image/true.png' : '../../public/image/false.png'" alt="">
                </div>
                <el-radio-group v-if="tes.tesType === '单选'" v-model="testAnswer[index]" class="test-options">
                    <el-radio value="0">{{ tes.options[0].optContent }}</el-radio>
                    <el-radio value="1">{{ tes.options[1].optContent }}</el-radio>
                    <el-radio value="2">{{ tes.options[2].optContent }}</el-radio>
                    <el-radio value="3">{{ tes.options[3].optContent }}</el-radio>
                </el-radio-group>
                <el-checkbox-group v-if="tes.tesType === '多选'" v-model="testAnswer[index]" class="test-options">
                    <el-checkbox value="0">{{ tes.options[0].optContent }}</el-checkbox>
                    <el-checkbox value="1">{{ tes.options[1].optContent }}</el-checkbox>
                    <el-checkbox value="2">{{ tes.options[2].optContent }}</el-checkbox>
                    <el-checkbox value="3">{{ tes.options[3].optContent }}</el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-if="tes.tesType === '判断'" v-model="testAnswer[index]" class="test-options">
                    <el-radio value="0">{{ tes.options[0].optContent }}</el-radio>
                    <el-radio value="1">{{ tes.options[1].optContent }}</el-radio>
                </el-radio-group>
            </div>
            <div class="test-submmit">
                <el-button @click="showAnswer">查看答案</el-button>
                <el-button type="primary" @click="subbmitAnswers">提交</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.test-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.test-list {
    margin-bottom: 10px;
}

.test-top {
    display: flex;
    align-items: center;
}

.test-result {
    width: 30px;
}

.test-options {
    display: flex;
    flex-direction: column;
    align-items: baseline;
}

.test-submmit {
    display: flex;
    justify-content: center;
}
</style>