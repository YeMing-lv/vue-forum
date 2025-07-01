import { defineStore } from "pinia";
import myrequest from '../api/request';
import { useQueStore } from "./quePinia";
import { useArtStore } from "./artPinia";

const queStore = useQueStore();
const artStore = useArtStore();

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        attention: null,
        queDraft: [],
        ansDraft: []
    }),
    actions: {
        initUser() {
            this.user = null;
            this.attention = null;
            this.initDraft();
        },
        initDraft() {
            this.queDraft = [];
            this.ansDraft = [];
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
        async insertAttention(attType, attFollowed, parentType) {
            const result = await myrequest.insertAttention(this.user.userId, attType, attFollowed);

            if (result.code !== 200) {
                return false;
            }
            // 1.插入关注关系
            this.attention.push(result.data.attention);
            // 2.返回参数 更新本地作者数据
            if (attType === 'question') { // 关注话题 更新话题关注数
                queStore.currentQuestion.queAtteNum++;
            } else if (attType === 'user' && parentType === 'question') { // 关注话题作者 更新作者关注数
                queStore.author.userFollowersNum++;
            } else if (attType === 'user' && parentType === 'article') { // 关注文章作者 更新作者关注数
                artStore.author.userFollowersNum++;
            } // 其它：关注回答作者 不用更新数量
            return true;
        },

        /**
         * 删除指定 关注关系
         * @param {*} attType
         * @param {*} attId 
         */
        async deleteAttention(attType, id, parentType) {
            // 找到指定被关注者ID的关注关系
            const attId = this.attention.find(item => item.attFollowed === id).attId;
            if (attId == null) return false;

            const result = await myrequest.deleteAttention(attId);
            console.log(result);

            // 先验证
            if (result.code !== 200) {
                return false;
            }
            // 1.删除关注关系
            this.attention = this.attention.filter(item => item.attId != attId);
            // 2.返回参数 更新本地作者数据
            if (attType === 'question') { // 关注话题 更新话题关注数
                queStore.currentQuestion.queAtteNum--;
            } else if (attType === 'user' && parentType === 'question') { // 关注话题作者 更新作者关注数
                queStore.author.userFollowersNum--;
            } else if (attType === 'user' && parentType === 'article') { // 关注文章作者 更新作者关注数
                artStore.author.userFollowersNum--;
            } // 其它：关注回答作者 不用更新数量
            return true;
        }
    },
    persist: true
})