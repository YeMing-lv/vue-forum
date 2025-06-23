import { defineStore } from "pinia";
import myrequest from '../api/request';

export const useTesStore = defineStore('test', {
    state: () => ({
        testList: null, // 题目列表
        options: null
    }),
    actions: {
        // 获取 题库
        async fetchTestAndOption() {
            const result = await myrequest.fetchTestAndOption();
            this.testList = result.test.data;
            this.options = result.option.data;
        }
    }
})