import { defineStore } from "pinia";
import myrequest from '../api/request';
import { ref } from "vue";

export const useAnsStore = defineStore('ans', {
    state: () => ({
        answerList: [],
        page: {
            currentPage: 1,
            pageSize: 6,
            total: 0
        },
        answerIsAgree: [0],
    }),
    actions: {
        init() {
            this.answerList = [];
            this.page = {
                currentPage: 1,
                pageSize: 6,
                total: 0
            };
        },
        addAgreedAnswer(ansId) {
            this.answerIsAgree.push(ansId);
        },
        deleteAgreedAnswer(ansId) {
            this.answerIsAgree = this.answerIsAgree.filter(item => item !== ansId);
        },

        /**
         * 获取指定种类、ID 的回答列表
         * @param {*} id 
         */
        async fetchAnswerList(type, id) {
            const result = await myrequest.fetchAnswerList(type, this.page, id);
            
            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.判断 还有没有数据
                if (this.answerList != []) {
                    if (this.page.total > this.answerList.length) {
                        this.answerList = [...this.answerList, ...result.data.records];
                    }
                } else {
                    this.answerList = result.data.records;
                }
            }
            // console.log(this.page);
            // console.log(this.answerList);
        },

        /**
         * 创建新回答 
         * @param {} ansAuthorId 
         * @param {*} ansQueId 
         * @param {*} ansContent 
         */
        async insertAnswer(ansAuthorId, ansQueId, ansContent) {
            const result = await myrequest.insertAnswer(ansAuthorId, ansQueId, ansContent);
            this.answerList.unshift(result.data);
        },

        /**
         * 更新回答 的点赞数
         * @param {*} upOrDown 
         * @param {*} id 
         */
        async updateAnswerLikeNum(upOrDown, id) {
            const updateAnswer = ref(this.answerList.find(item => item.ansId === id));

            if (upOrDown === "up") {
                const result = await myrequest.updateLikeNum('answer', id, updateAnswer.value.ansLikeNum + 1);
                if (result.data === 1) {
                    updateAnswer.value.ansLikeNum++;
                }
            } else if (upOrDown === "down") {
                const result = await myrequest.updateLikeNum('answer', id, updateAnswer.value.ansLikeNum - 1);
                if (result.data === 1) {
                    updateAnswer.value.ansLikeNum--;
                }
            }
        }
    },
    persist: true
})