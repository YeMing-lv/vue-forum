<script setup>
import { computed, onMounted, ref } from 'vue';
import Header from '../../components/Container/Header.vue';
import UserActionsList from './components/UserActionsList.vue';
import UserQuestionList from './components/UserQuestionList.vue';
import UserArticleList from './components/UserArticleList.vue';
import UserAnswerList from './components/UserAnswerList.vue';
import { updateUserHeadPath } from '../../api/User/UserApi';
import { deleteImage } from '../../api/image';
import { useUserStore } from '../../store/userPinia';
import { ElMessage } from 'element-plus';
import { Camera, Search } from '@element-plus/icons-vue'

/**
 * 用户中心？
 * 上方用户头像(可修改）、姓名、性别、个人介绍（可以直接修改）、背景图、IP地址。??? 编辑个人信息按钮,放设置里了。
 * 接着下方：
 *      左侧：动态、话题、回答、文章、关注订阅。。。
 *      右侧侧边栏：关注数（关注订阅的分类数量）、被关注创作中心
 * 
 */
const userStore = useUserStore();
const user = computed(() => userStore.user);
const header = {
    Authorization: localStorage.getItem('token')
};

const activeMenuIndex = ref('1');

const ifLoading = ref(false);
const imageUrl = ref('');

onMounted(async () => {
    ifLoading.value = true;

    if (user.value) {
        // console.log(user.value);
        imageUrl.value = user.value.userHead;
    }
    ifLoading.value = false;
})

// ========================上传头像==========================
// 上传头像之前 校验
const beforeAvatarUpload = (rawFile) => {
    // console.log(rawFile);
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Avatar picture must be JPG format!');
        return false;
    }
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!');
        return false;
    }
    return true;
};

// 上传成功
const uploadsuccess = async (event, file, fileList) => {
    console.log('上传进度:', event);
    if (event.errno === 0) { //上传成功
        try {
            // 更新用户头像
            const result = await updateUserHeadPath(user.value.userId, event.data.url);
            if (result.success) {
                console.log(user.value.userHead);
                userStore.user.userHead = event.data.url;
                imageUrl.value = event.data.url;
            }
        } catch (error) {
            console.error("更新用户头像失败",)
        }
    }
};

// 导航栏跳转
const handleSelect = (key, keyPath) => {
    activeMenuIndex.value = key;
}

</script>

<template>
    <div class="userCenter">
        <Header />
        <div class="container main">
            <div v-if="user" class="top">
                <div class="background">
                    <img src="http://localhost:8082/image/userCenterBackground.jpg" alt="">
                </div>
                <el-upload class="avatar-uploader" action="http://localhost:8082/image/upload?type=userHead"
                    :headers="header" show-file-list="false" :before-upload="beforeAvatarUpload"
                    :on-success="uploadsuccess">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon class="avatar-uploader-icon">
                        <Camera /><span>上传头像</span>
                    </el-icon>
                </el-upload>
                <div style="margin-top: 150px;z-index: 10;">
                    <div class="name">{{ user.userName }}&nbsp;<img
                            :src="user.userGender === 'male' ? '/public/image/male.png' : '/public/image/female.png'"
                            alt=""></div>
                    <div class="intro">{{ user.userIntro }}</div>
                </div>
            </div>
            <div class="content">
                <div class="list">
                    <el-menu :default-active="activeMenuIndex" class="menu" mode="horizontal" ellipsis="false"
                        @select="handleSelect">
                        <el-menu-item index="1">动态</el-menu-item>
                        <el-menu-item index="2">话题</el-menu-item>
                        <el-menu-item index="3">文章</el-menu-item>
                        <el-menu-item index="4">回答</el-menu-item>
                        <el-sub-menu index="5">
                            <template #title>关注</template>
                            <el-menu-item index="5-1">关注的人</el-menu-item>
                            <el-menu-item index="5-2">关注话题</el-menu-item>
                            <el-menu-item index="5-3">关注文章</el-menu-item>
                        </el-sub-menu>
                        <el-menu-item>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </el-menu-item>
                    </el-menu>
                    <div class="list-content">
                        <UserActionsList v-if="activeMenuIndex === '1'" />
                        <UserQuestionList v-if="activeMenuIndex === '2'" :user-id="user.userId" />
                        <UserArticleList v-if="activeMenuIndex === '3'" :user-id="user.userId" />
                        <UserAnswerList v-if="activeMenuIndex === '4'" :user-id="user.userId" />
                    </div>
                </div>
                <div class="aside user-aside">
                    <div class="follwerNum">
                        {{ user.userFollowersNum }}关注者
                    </div>
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<style lang="scss" scoped>
$defaultColor: #409EFF;

.userCenter {}

.main {
    position: relative;
    padding: 10px;
}

.background {
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        border-radius: 1%;
        object-fit: cover;
        /* 保持比例，裁剪多余部分 */
        z-index: 0;
    }
}

.top {
    display: flex;
    position: relative;
    height: 300px;
    border-radius: 1%;
    box-shadow: 0 1px 8px #d0d0d0;
    background-color: #fff;

    .avatar-uploader {
        position: relative;
        width: 180px;
        height: 180px;
        margin: 20px;
        margin-top: 80px;
        padding: 5px;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        // overflow: hidden;

        .avatar {
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 2;
            width: 178px;
            height: 178px;
            display: block;
        }

        .avatar-uploader-icon {
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 3;
            width: 178px;
            height: 178px;
            opacity: 0;
            font-size: 28px;
            color: #d0d0d0;
            text-align: center;
            border: 1px dashed;
            border-radius: 6px;
            transition: var(--el-transition-duration-fast);
        }
    }

    .avatar-uploader:hover .avatar-uploader-icon {
        opacity: 1;
    }

    .name {
        font-size: 28px;
        font-weight: 800;
        z-index: 10;

        img {
            width: 20px;
        }
    }

    .intro {
        margin-top: 5px;
        z-index: 10;
    }
}

.content {
    position: relative;
    display: flex;

    .list {
        margin-top: 10px;
        padding: 20px;
        border-radius: 6px;
        margin-right: 10px;
        flex-grow: 2;
        background: #fff;
        box-shadow: 0 1px 8px #d0d0d0;

        .el-menu--horizontal>.el-menu-item:nth-child(4) {
            margin-right: auto;
        }
    }

    .user-aside {
        align-self: flex-start;
        min-width: 250px;
        margin-top: 10px;

        .follwerNum {
            padding: 20px;
            box-shadow: 0 1px 8px #d0d0d0;
            background: #fff;
        }
    }
}
</style>