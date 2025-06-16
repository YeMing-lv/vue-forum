<script setup>
import Header from './other/Header.vue';
import Answer from './Answer.vue';
import Editor from './other/Editor.vue';

import { useQueStore } from '../other/store/quePinia';
import { useUserStore } from '../other/store/userPinia';
import { useNavStore } from '../other/store/navPinia';
import { computed, onMounted, ref } from 'vue';
import { EditPen } from '@element-plus/icons-vue';

const queStore = useQueStore();
const userStore = useUserStore();
const navStore = useNavStore();

// 当前话题的数据
const currentQuestion = computed(() => queStore.currentQuestion);
const questionIsAgree = computed(() => queStore.questionIsAgree);
const tagList = computed(() => {
    if (currentQuestion.value.queTag != null) {
        currentQuestion.value.queTag.split(',')
    }
});
const author = computed(() => queStore.author);

// 控制编辑器显示
const ifEdit = ref(false);

onMounted(() => {
    // console.log(queStore.value)
    navStore.headerNavActive = 0;
});

// 关注按钮的处理
// 判断当前关注关系是 未关注 还是 已关注
const ifFollower = (id) => userStore.ifAttention(id);
// 更改关注关系
const changeFollower = async (attType, id) => {
    const ifF = ifFollower(id);
    if (ifF == true) {
        await userStore.updateAttention('delete', attType, id);
    } else if (ifF == false) {
        await userStore.updateAttention('post', attType, id);
    }
}

// ？？？？？？做个模块？？？？？？？
// 赞同点击事件
const agree = async (queId) => {
    if (questionIsAgree.value.includes(queId)) {
        await queStore.updateQuestionLikeNum('down', queId);
        queStore.deleteAgreedQuestion(queId);
    } else {
        await queStore.updateQuestionLikeNum('up', queId);
        queStore.addAgreedQuestion(queId);
    }
}

// 完成回答编辑 隐藏编辑器
const handleEditor = (data) => {
    ifEdit.value = !ifEdit.value;
}

</script>

<template>
    <div class="question">
        <Header />

        <div class="que-header">
            <div class="que-header-left">
                <el-tag v-for="tag in tagList" :key="tag" style="margin: 0 10px 10px 0;">
                    {{ tag }}
                </el-tag>
                <div class="title">{{ currentQuestion.queTitle }}</div>
                <div class="content" v-html="currentQuestion.queContent"></div>
                <div class="other">
                    <el-button :type="ifFollower(currentQuestion.queId) ? 'info' : 'primary'"
                        @click="changeFollower('question', currentQuestion.queId)">
                        {{ ifFollower(currentQuestion.queId) ? '已关注' : '关注问题' }}
                    </el-button>
                    <el-button @click="handleEditor"><el-icon>
                            <EditPen />
                        </el-icon>{{ ifEdit ? "编辑回答" : "写回答" }}</el-button>
                    <div class="like">
                        <el-button text @click="agree(currentQuestion.queId)">
                            <img src="../../public/image/like.png" alt="like">
                            点赞{{ currentQuestion.queLikeNum }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="que-header-right">
                <div class="attention">关注者<br><span style="font-weight: 800;">{{ currentQuestion.queAtteNum }}</span>
                </div>
                <div>浏览数<br><span style="font-weight: 800;">{{ currentQuestion.queBrowseNum }}</span></div>
            </div>
        </div>

        <div class="que-editor">
            <Editor v-if="ifEdit" editor-type="answer" @if-complete-answer-edit="handleEditor" />
        </div>

        <div class="container que-content">
            <div class="que-answer">
                <Answer />
            </div>
            <div class="que-aside">
                <div class="aside-author">
                    <div class="author-legend">关于作者</div>
                    <div class="author-top">
                        <img :src="author.userHead" alt="" style="width: 60px;border-radius: 10%;">
                        <div class="author-top-right">
                            <div class="author-name">{{ author.userName }}</div>
                            <div class="author-intro">{{ author.userIntro }}</div>
                        </div>
                    </div>
                    <div class="author-middle">
                        <div class="author-answer">回答<br>{{ author.userAnswerNum }}</div>
                        <div class="author-question">话题<br>{{ author.userQuestionNum }}</div>
                        <div class="author-followers">关注者<br>{{ author.userFollowersNum }}</div>
                    </div>
                    <div class="author-bottom">
                        <el-button :type="ifFollower(author.userId) ? 'info' : 'primary'"
                            @click="changeFollower('user', author.userId)">
                            {{ ifFollower(author.userId) ? "已关注" : "+关注他" }}
                        </el-button>
                    </div>
                </div>
                <div>
                    推荐
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100" />
        <!-- <el-footer style="border: 1px solid">Footer</el-footer> -->
    </div>
</template>

<style scoped>
.que-header {
    display: flex;
    margin: 0 auto 10px auto;
    padding: 10px 150px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.que-header-left {
    flex-grow: 2;
    margin-right: 10px;
    padding: 10px;
}

.que-header-left .title {
    margin: 10px auto 0 auto;
    font-weight: 800;
    font-size: 24px;
}

.que-header-left .content {
    margin: 10px auto 0 auto;
}

.que-header-left .other {
    display: inline-flex;
    align-items: center;
    margin: 10px auto 0 auto;
}

.que-header-left .like {
    display: inline-flex;
    margin: auto 10px;
    align-items: center;
    cursor: pointer;
}

.que-header-left .like img {
    margin: auto 5px;
    width: 20px;
    height: 20px;
}

.que-header-left .like:hover>img {
    color: black;
}

.que-header-right {
    display: inline-flex;
    padding: 10px;
    text-align: center;
}

.que-header-right .attention {
    display: inline;
    height: 50px;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px #d0d0d0 solid;
}

.que-content {
    display: flex;
    width: 1050px;
    margin: 0 auto;
}

.que-answer {
    min-width: 770px;
    margin-right: 10px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.que-aside {
    min-width: 270px;
}

.aside-author {
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
}

.author-legend {
    padding: 20px;
    padding-bottom: 10px;
    font-weight: 800;
}

.author-top {
    display: flex;
    align-items: center;
    padding: 20px;
}

.author-top-right {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.author-name {
    font-size: large;
    font-weight: 800;
}

.author-intro {
    font-size: small;
}

.author-middle {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
}

.author-answer {
    margin: 10px;
    margin-right: 20px;
}

.author-question {
    margin: 10px;
    margin-right: 20px;
}

.author-followers {
    margin: 10px;
    margin-right: 20px;
}

.author-bottom {
    display: flex;
    justify-content: center;
    padding: 20px;
    padding-top: 0;
}
</style>