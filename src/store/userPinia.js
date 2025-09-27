import { defineStore } from "pinia";
import { userLogin } from "../api/User/UserApi";
import { fetchAttention } from "../api/Attention/AttentionApi";
import { insertAttention, deleteAttention } from "../api/Attention/AttentionApi";
import { fetchUserActions } from "../api/UserActions/UserActionsApi";
import { useQueStore } from "./quePinia";
import { useArtStore } from "./artPinia";

const queStore = useQueStore();
const artStore = useArtStore();

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        attention: null,

        userActions: [],
        page: {
            currentPage: 0,
            pageSize: 0,
            total: 0
        },

        failedVCodeNum: 0, // 验证失败次数
        failedVCodeTime: null, // 最新 验证失败的 时间 new Date('2024');

    }),
    actions: {
        initUser() {
            this.user = null;
            this.attention = null;
            this.ifLike = [];
        },
        initUserActions() {
            this.userActions = [];
            this.page = {
                currentPage: 0,
                pageSize: 0,
                total: 0
            };
        },
        initFailedVCode() {
            this.failedVCodeNum = 0;
            this.failedVCodeTime = 0;
        },

        ifReVCode() {
            const waitTime = 3 * 60 * 1000; // 三分钟
            const nowDate = new Date();
            if (this.failedVCodeTime != null) {
                const failedTime = new Date(this.failedVCodeTime);
                return (nowDate - failedTime) > waitTime;
            }
            return false;
        },

        /**
         * 用户登录
         * @param {*} account 
         * @param {*} password 
         */
        async userLogin(account, password) {
            const result = await userLogin(account, password);
            console.log(result);
            if (result.code === 200) {
                this.user = result.data.user;
                localStorage.setItem("token", result.data.token);
                console.log(localStorage.getItem("token"))
                return true;
            }
            return false;
        },

        /**
         * 获取用户 关注的用户和话题
         * @param {*} id 
         */
        async fetchAttention() {
            const result = await fetchAttention(this.user.userId);
            if (result.code === 200) {
                this.attention = result.data;
                return true;
            }
            return false;
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
            const result = await insertAttention(this.user.userId, attType, attFollowed);

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

            const result = await deleteAttention(attId);
            // console.log(result);

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
        },

        /**
         * 获取 用户动态列表
         * @param {*} id 
         * @param {*} page 
         */
        async fetchUserActions() {
            // 更新页面参数
            if (this.page.currentPage === 0 && this.page.pageSize === 0) { // 初始参数改为 1；6
                this.page.currentPage = 1;
                this.page.pageSize = 6;
            } else if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 1；6分页查询后
                this.page.currentPage = 3;
                this.page.pageSize = 3;
            } else {
                this.page.currentPage++;
            }
            // console.log(this.page);
            const result = await fetchUserActions(this.user.userId, this.page);

            // console.log(result);
            if (result.code === 200) {
                // 1.存储数据总数
                this.page.currentPage = result.data.current;
                this.page.total = result.data.total;

                // 2.存储 并 判断 还有没有数据
                if (this.userActions != []) {
                    if (this.page.total > this.userActions.length) {
                        this.userActions = [...this.userActions, ...result.data.records];
                    }
                } else {
                    this.userActions = result.data.records;
                }
            } else { // 查询分页失败，复原page
                if (this.page.currentPage === 1 && this.page.pageSize === 6) { // 初始参数改为 1；6
                    this.page.currentPage = 0;
                    this.page.pageSize = 0;
                } else if (this.page.currentPage === 3 && this.page.pageSize === 3) { // 1；6分页查询后
                    this.page.currentPage = 1;
                    this.page.pageSize = 6;
                } else {
                    this.page.currentPage--;
                }
            }
            // console.log(this.page);
            // console.log(this.userActions);
        }
    },
    persist: true
})