<template>
    <div>
        <!-- <h2>Vue2 不能检测数组和对象的变化</h2>
		<el-button @click="handleClick">点击修改A，修改原有方法</el-button><br>
		A: <el-input v-model="detail.a" /> B:
		<el-input v-model="detail.b" /> -->


        <h2>数组方法试验</h2>
        <el-button type="primary" @click="initTableData">初始化</el-button>
        <el-button @click="addItem">新增行5到末位，id任意不重复即可</el-button>
        <el-button @click="changeItem">编辑行3为"你好"</el-button>
        <el-button @click="deleteItem0">删除行1</el-button>
        <el-button @click="sortArr">点击按照数量倒序排序（5、4、3、2……）</el-button>
        <el-button @click="deleteItem3">只传入id，根据id删除行4</el-button>
        <div class="table">
            <div class="table-item" v-for="(item, index) in currentTable" :key="item.id">
                行 ：{{ item.label }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            detail: {},
            currentTable: [],
        };
    },
    props: {
        aDetail: {
            type: Object,
            default: () => { },
        },
        tableData: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        //aDetail传入后没有修改，需要设置immediate为true，监听第一次
        aDetail: {
            handler(val) {
                this.detail = val;
            },
            immediate: true,
        },
        tableData: {
            handler() {
                this.initTableData();
            },
            immediate: true,
        },
    },
    methods: {
        handleClick() {
            //修改，使得detail.a成功赋值
            this.detail.a = "你好";

            // Vue2 添加对象属性
            // Vue.set(this.detail, a, "你好");
            // this.detail = Object.assign({}, this.detail, { a: 1, b: 2});

        },
        initTableData() {
            //深拷贝，this.currentTable修改不会影响this.tableData
            this.currentTable = JSON.parse(JSON.stringify(this.tableData));
        },
        addItem() { // 11
            var newId = "";
            var nowTime = new Date();
            var randomX = Math.round(Math.random(0, 10) * 100);

            newId = nowTime.getTime().toString() + randomX.toString();
            console.log(newId);

            this.currentTable.push({ label: 5, id: newId });
        },
        changeItem() { // 11
            const hang3Index = this.currentTable.findIndex((value) => {
                return value.label == 3;
            });
            if (hang3Index != -1) {
                this.currentTable.splice(hang3Index, 1, { ...this.currentTable[hang3Index], label: "你好" });
            }
        },
        deleteItem0() { // 11
            const hang1Index = this.currentTable.findIndex((value) => {
                return value.label == 1;
            });
            if (hang1Index != -1) {
                this.currentTable.splice(hang1Index, 1);
            }
        },
        sortArr() { // 改
            this.currentTable.sort((a, b) => {
                return b.label - a.label;
            });
        },
        deleteItem3() {
            const hang4Index = this.currentTable.findIndex((value) => {
                return value.id == "界";
            });
            if (hang4Index != -1) {
                this.currentTable.splice(hang4Index, 1);
            }
        },
    },
};
</script>

<style lang='less' scoped></style>