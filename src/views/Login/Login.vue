<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userRegister } from '../../api/User/UserApi';
import { useUserStore } from '../../store/userPinia';
import Vcode from "vue3-puzzle-vcode";
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const logAndRegFormRef = ref(); //表单实例（组件库自带的方法，不是模版引用）
const title = ref('登录'); //头部标题
const isLogOrReg = ref(true); //登录和注册状态
const pointer = ref(''); //底部提示词
const user = reactive({ // 输入的用户信息
    name: '',
    account: '',
    password: '',
});
const ifShowVcode = ref(false); // 是否显示验证码
const ifSuccessVcode = ref(false); // 是否通过验证码

// 挂载时清理用户信息
onMounted(() => {
    
    userStore.initUser(); // 清除UserStore token在路由守卫里就清除了

    // 是否可以再次进行 登录注册
    if (userStore.ifReVCode()) {
        userStore.initFailedVCode();
    }
})
//========================登录或注册========================
//切换登录和注册状态
function logOrReg() {
    if (isLogOrReg.value === true) {
        title.value = '注册';
        user.name = '';
        user.account = '';
        user.password = '';
        pointer.value = '';
        isLogOrReg.value = false;
    } else {
        title.value = '登录';
        user.name = '';
        user.account = '';
        user.password = '';
        pointer.value = '';
        isLogOrReg.value = true;
    }
}

//按钮绑定事件 触发表单校验 验证码验证
const handleButton = async (formEl) => {
    if (!formEl) return;
    // 手动触发校验
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(user, 'submit');

            if (!userStore.ifReVCode()) { // 还不能进行登录注册
                ElMessage.error("还不能进行登录注册!");
                return;
            }
            // 滑动验证码验证
            ifShowVcode.value = true;
        }
    })
};
// ======================表单管理=======================
//表单校验规则
const rules = reactive({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 30, message: '账号长度至少为3位', trigger: 'blur' },
        {
            // pattern: /^[a-zA-Z0-9_-]{3,30}$/,
            // message: '账号只能包含大小写字母、数字、下划线和连接符',
            // trigger: 'blur'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, message: '密码长度至少为3位', trigger: 'blur' },
        {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{3,}$/,
            message: '密码必须包含至少一个字母和一个数字',
            trigger: 'blur'
        }
    ]
})

//清空表单
const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
}
//=======================滑动验证============================
// 滑动验证成功 进行登录、注册
const handleSuccessVcode = async () => {
    ifSuccessVcode.value = true;
    userStore.initFailedVCode();

    if (isLogOrReg.value && ifSuccessVcode.value) {
        try {
            //提交登录信息
            const result = await userStore.userLogin(user.account, user.password);
            if (result) { //登录成功
                // 获取用户的关注关系数据
                const attentionResult = await userStore.fetchAttention();
                if (attentionResult) {
                    //获取重定向地址，如果没有就直接跳转到首页
                    const redirectPath = route.query.redirect || '/main';
                    router.push(redirectPath);
                }
            } else {
                // 登录失败
                ElMessage.error("登录失败")
            }
        } catch (error) {
            console.error("请求登录失败:", error);
            ElMessage.error("请求登录失败");
        }
    } else if (!isLogOrReg.value && ifSuccessVcode.value) {
        try {
            //提交注册信息
            const result = await userRegister(user.name, user.account, user.password);
            //注册成功
            if (result.code === 200) {
                logOrReg();
                ElMessage.success("注册成功");
            } else {
                ElMessage.error("注册失败");
            }
        } catch (erro) {
            console.error("请求注册失败:", error);
            ElMessage.error("请求注册失败");
        }
    }
    handleCloseVcode();
}

// 滑动验证失败
const handleFailVcode = () => {
    userStore.failedVCodeNum++;
    if (userStore.failedVCodeNum % 5 == 4) { // 取余数
        ElMessage.warning("还有一次验证机会！");
    }
    if (userStore.failedVCodeNum % 5 == 0 && userStore.failedVCodeNum != 0) {
        ElMessage.error("验证失败达到5次，请等待3分钟后再进行登录注册！");
        userStore.failedVCodeTime = new Date();
        handleCloseVcode();
    }
}

// 滑动验证框关闭
const handleCloseVcode = () => ifShowVcode.value = false;

</script>

<template>
    <div class="logAndReg">
        <div class="container">
            <div class="title">论坛</div>
            <div class="login">
                <div class="login-title">
                    <div class="title-login" :class="{ active: isLogOrReg }" @click="logOrReg()">登录</div>
                    <div class="title-register" :class="{ active: !isLogOrReg }" @click="logOrReg()">注册</div>
                </div>
                <el-form :model="user" :rules="rules" ref="logAndRegFormRef" label-width="auto"
                    style="max-width: 600px">
                    <el-form-item label="名称：" v-if="!isLogOrReg" prop="name">
                        <el-input v-model="user.name" />
                    </el-form-item>
                    <el-form-item label="账号：" prop="account">
                        <el-input v-model="user.account" />
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="user.password" />
                    </el-form-item>
                    <el-form style="display: flex;justify-content: center;">
                        <el-form-item style="margin-right: 10px;">
                            <el-button type="primary" @click="handleButton(logAndRegFormRef)">{{ title }}</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="resetForm(logAndRegFormRef)">清空</el-button>
                        </el-form-item>
                    </el-form>
                </el-form>
                <div class="pointer">{{ pointer }}</div>
                <Vcode :show="ifShowVcode" @success="handleSuccessVcode" @fail="handleFailVcode"
                    @close="handleCloseVcode" />
                <br>
                <span>测试：xiaoming@example.com xiaoming123</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logAndReg {
    margin: 0 auto;
}

.title {
    margin: 40px 0;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 40px;
    text-align: center;
}

.login {
    padding: 20px;
    background: #fff;
    box-shadow: 0 1px 8px #d0d0d0;
    text-align: center;
}

.login-title {
    margin-bottom: 15px;
    text-align: center;
}

.login-title .title-login {
    display: inline-block;
    margin: 0 40px;
    cursor: pointer;
}

.login-title .title-register {
    display: inline-block;
    margin: 0 40px;
    cursor: pointer;
}

.login-title .active {
    border-bottom: 1px solid;
}

.pointer {
    display: inline;
    margin: 15px 0px;
    border-bottom: 1px solid;
    cursor: default;
}
</style>