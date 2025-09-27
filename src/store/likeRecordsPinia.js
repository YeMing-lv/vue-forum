import { defineStore } from "pinia";

export const uselikeRecordsStore = defineStore('likeRecords', {
    state: () => ({
        likeRecords: [],
    }),
    actions: {
        init() {
            this.likeRecords = [];
        },

        // 前端简单记录用户点赞历史
        addLikeRecord(id) {
            this.likeRecords.push(id);
        },
        deleteLikeRecord(id) {
            this.likeRecords = this.likeRecords.filter(item => item !== id);
        },

        // 判断是否有点赞记录
        haveLikeRecord(id) {
            return this.likeRecords.includes(id);
        },

    },
    persist: true
})