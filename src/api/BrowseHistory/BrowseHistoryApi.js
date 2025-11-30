import apiClient from "../request";

export async function fetchUserBrowseHistory(type, page, dateBetween, userId) {
    const pageParam = {
        currentPage: page.currentPage,
        pageSize: page.pageSize
        // startTime: dateBetween.startTime,
        // endTime: dateBetween.endTime
    }
    const response = await apiClient.get(`/browseHistory/user/${userId}`, {
        params: {
            itemType: type,
            ...pageParam
        }
    });
    return response.data;
}

export async function createBrowseHistory(userId, itemType, itemId, time) {
    const browseHistory = {
        userId: userId,
        itemType: itemType,
        itemId: itemId,
        time: time
    }
    const response = await apiClient.post(`/browseHistory`, browseHistory);
    return response.data;
}