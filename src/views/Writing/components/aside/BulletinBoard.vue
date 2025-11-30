<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const startNumber = ref(0);
const endNumber = ref(3);
// 定时器变量
let timer = null;
// 模拟下公告列表数据
const bulletinBoardList = [
    {
        time: "09-24",
        title: "公告1"
    },
    {
        time: "09-22",
        title: "公告2"
    },
    {
        time: "09-10",
        title: "公告3"
    },
    {
        time: "08-24",
        title: "公告4"
    },
    {
        time: "08-22",
        title: "公告5"
    },
    {
        time: "08-10",
        title: "公告6"
    },
];

onMounted(() => {
    timer = setInterval(updateStartAndEnd, 5000);
});

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});

// 定时更新起止数据
const updateStartAndEnd = () => {
    const overNumber = bulletinBoardList.length - endNumber.value;
    if ( overNumber >= 3 ) {
        startNumber.value = startNumber.value + 3;
        endNumber.value = endNumber.value + 3;
    } else {
        startNumber.value = 0;
        endNumber.value = 3;
    }
}
</script>

<template>
    <div class="bulletin-board containerDetail">
        <div class="title">
            <span>公告栏</span><span>查看更多 ></span>
        </div>
        <ul class="list">
            <li class="li" v-for="li in bulletinBoardList.slice(startNumber, endNumber)" >
                <span>{{ li.time }}</span> <span>{{ li.title }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.bulletin-board {
    min-height: 100px;
    padding: 10px;

    .title :last-child {
        font-size: small;
        color: #a0a0a0;
        float: right;
        cursor: pointer;
    }

    .list {
        list-style: none;

        .li {
            margin-bottom: 5px;
        }

        .li :end {
            margin-bottom: 0;
        }

        .li :first-child {
            margin-left: 5px;
            font-size: small;
            color: #6d6d6d;
        }

        .li :last-child {
            margin-left: 10px;
            font-size: 14px;
        }

    }
}
</style>