import { defineStore } from "pinia";

export const useNavStore = defineStore('nav', {
    state: () => ({
        headerNavActive: 0,
        searchKeyword: null,
    }),
    actions: {
        
    },
    persist: true
})