import { defineStore } from "pinia";
import myrequest from '../api/request';
import { useQueStore } from "./quePinia";

const queStore = useQueStore();

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        attention: null,
        queDraft: null,
        ansDraft: null
    }),
    actions: {
        initUserStore() {
            this.user = null;
            this.attention = null
        },
        cleanUser() {
            this.user = null;
        },

        /**
         * 用户登录
         * @param {*} account 
         * @param {*} password 
         */
        async userLogin(account, password) {
            const result = await myrequest.userLogin(account, password);
            this.user = result.data.user;
            localStorage.setItem("token", result.data.token);
            console.log(localStorage.getItem("token"))
        },

        /**
         * 获取用户 关注的用户和话题
         * @param {*} id 
         */
        async fetchAttention() {
            const result = await myrequest.fetchAttention(this.user.userId);
            this.attention = result.data;
        },

        /**
         * 获取用户 指定 草稿箱
         */
        async fetchDraft(type) {
            const result = await myrequest.fetchDraft(this.user.userId, type);

            if (result.code === 200) {
                if (type === 'question') {
                    this.queDraft = result.data;
                } else if (type === 'answer') {
                    this.ansDraft = result.data;
                }
            }
        },

        /**
         * 删除指定种类 草稿
         * @param {*} type 
         * @param {*} draId 
         */
        async deleteDraft(type, id) {
            const result = await myrequest.deleteDraft(id);

            if (result.code === 200) {
                if (type === 'question') {
                    this.queDraft = this.queDraft.filter(draft => draft.draId != id);
                } else if (type === 'answer') {
                    this.ansDraft = this.ansDraft.filter(draft => draft.draId != id);
                }
            }
        },

        /**
         * 判断当前登录用户是否已关注对应 id 用户或话题
         * @param {*} id 
         * @returns boolean
         */
        ifAttention(id) {
            if (this.attention.find(item => item.attFollowed === id)) { // 关注过指定ID
                return true;
            }
            return false;
        },

        /**
         * 添加 关注关系
         * @param {*} postOrDelete 
         * @param {*} attType 
         * @param {*} attFollowed 
         */
        async insertAttention(attType, attFollowed) {
            const result = await myrequest.insertAttention(this.user.userId, attType, attFollowed);

            if (result.code === 200) {
                // 1.插入关注关系
                this.attention.push(result.data.attention);
                // 2.更新关注者的关注数
                if (result.data.row > 0) {
                    if (attType === "user") {
                        queStore.author.userFollowersNum++;
                    } else if (attType === "question") {
                        queStore.currentQuestion.queAtteNum++;
                    }
                }
            }
        },

        /**
         * 删除指定 关注关系
         * @param {*} attType
         * @param {*} attId 
         */
        async deleteAttention(attType, id) {
            // 找到指定被关注者ID的关注关系
            const attId = this.attention.find(item => item.attFollowed === id).attId;

            const result = await myrequest.deleteAttention(attId);

            // 先验证
            if (result.code === 200) {
                // 1.删除关注关系
                this.attention = this.attention.filter(item => item.attId != attId);
                // 2.更新被关注者的关注数
                if (result.data > 0) {
                    console.log(111)
                    if (attType === "user") {
                        queStore.author.userFollowersNum--;

                    } else if (attType === "question") {
                        queStore.currentQuestion.queAtteNum--;
                    }
                }
            }

        }
    },
    persist: true
})