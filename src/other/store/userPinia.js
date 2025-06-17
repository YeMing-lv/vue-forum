import { defineStore } from "pinia";
import myrequest from "../api/request.js";

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
        async userLogin(account, password) {
            try {
                const result = await myrequest.userLogin(account, password);
                this.user = result.user;
                localStorage.setItem("token", result.token);
                console.log(this.user);
                console.log(localStorage.getItem("token"))
            } catch (error) {
                console.log("Error pinia userLogin: " + error);
            }
        },
        async fetchAttention(id) {
            const result = await myrequest.fetchAttention(id);
            this.attention = result;
        },
        async fetchQueDraft() {
            const result = await myrequest.fetchQueDraft(this.user.userId);
            this.queDraft = result;
        },
        async deleteDraft(draftType, draId) {
            const result = await myrequest.deleteDraft(draId);

            if (draftType === 'question') {
                const filterQueDraft = this.queDraft.filter(draft => draft.draId != draId);
                this.queDraft = filterQueDraft;
            } else if (draftType === 'answer') {
                const filterQueDraft = this.ansDraft.filter(draft => draft.draId != draId);
                this.ansDraft = filterQueDraft;
            }
        },
        async fetchAnsDraft() {
            const result = await myrequest.fetchAnsDraft(this.user.userId);
            this.ansDraft = result;
        },
        // 判断当前登录用户是否已关注对应 id 用户或话题
        ifAttention(id) {
            for (let i = 0; i < this.attention.length; i++) {
                const element = this.attention[i];
                if (element.attFollowed == id) {
                    return true;
                } else if (element.attFollowed != id && i == this.attention.length - 1) {
                    return false;
                }
            }
        },
        // 添加 或 删除 对应id的关注关系
        async updateAttention(postOrDelete, attType, attFollowed) {
            const result = await myrequest.updateAttention(postOrDelete, this.user.userId, attType, attFollowed);
            await this.fetchAttention(this.user.userId);
            // console.log(this.attention);
        },
    },
    persist: true
})