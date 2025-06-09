import { defineStore } from "pinia";
import myrequest from "../api/request.js";

export const useUserStore = defineStore('user' , {
    state: () => ({
        user: null,
        attention: null
    }),
    actions: {
        cleanUser() {
            this.user = null;
        },
        async LoginUser(account , password) {
            try {
                const result = await myrequest.LoginUser(account , password);
                this.user = result;
            }catch (error) {
                console.log("Error pinia LoginUser: "+error);
            }
        },
        async fetchAttention(id) {
            const result = await myrequest.fetchAttention(id);
            this.attention = result;
        },
        // 判断当前登录用户是否已关注对应 id 用户或话题
        ifAttention(id) {
            for (let i = 0; i < this.attention.length; i++) {
                const element = this.attention[i];
                if (element.attFollowed == id) {
                    return true;
                } else if (element.attFollowed != id && i == this.attention.length-1) {
                    return false;
                }
            }
        },
        // 添加 或 删除 对应id的关注关系
        async updateAttention(postOrDelete, attType, attFollowed) {
            const result = await myrequest.updateAttention(postOrDelete, this.user.userId, attType, attFollowed);
            await this.fetchAttention(this.user.userId);
            // console.log(this.attention);
        }
    },
    persist: true
})