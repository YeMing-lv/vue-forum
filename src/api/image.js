import apiClient from "./request";

export async function uploadImage(file, imageType) {
    const response = await apiClient.post(`/image/upload?file=${file}&type=${imageType}`);
    return response.data;
}

export async function deleteImage(imagePath) {
    const response = await apiClient.delete(`/image?imagePath=${imagePath}`);
    return response.data;
}