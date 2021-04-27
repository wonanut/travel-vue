<template>
<div class="main">
    <div v-if="loginView">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRulues" label-width="80px" class="login-box">
            <h3 class="login-title">欢迎登录</h3>
            <el-form-item label="用户名" prop="userName">
                <el-input type="text" placeholder="请输入账号" v-model="loginForm.userName" />
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.userPassword" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="onLogin('loginForm')">登录</el-button>
                <el-button type="primary" class="register-button" v-on:click="onRegist()">注册新用户</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <el-form ref="registeForm" :model="registeForm" :rules="registeRules" label-width="80px" class="login-box">
            <h3 class="login-title">注册新用户</h3>
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="registeForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="registeForm.userPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="userAge">
                <el-input v-model="registeForm.userAge"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="userSex">
                <el-input v-model="registeForm.userSex"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="userSex">
                <el-input v-model="registeForm.userPhone"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="userDesc">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" placeholder="请输入内容" v-model="registeForm.userDesc"></el-input>
            </el-form-item>
            <el-form-item>
                    <el-button type="primary" @click="onSubmitRegist('registeForm')">注 册</el-button>
                    <el-button @click="onCancelRegist()">取 消</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
const axios = require("axios");
const qs = require("qs");
const ele = require("element-ui");

export default {
    name: "Login",
    data() {
        return {
            loginView: true,
            userName: "",
            userType: "",
            loginForm: {
                userName: "",
                userPassword: "",
            },
            registeForm: {
                userName: "",
                userPassword: "",
                userAge: "",
                userSex: "",
                userPhone: "",
                userDesc: "",
                userProfile: ""
            },
            loginRulues: {
                userName: [{
                    required: true,
                    message: "账号不可为空",
                    trigger: "blur"
                }, ],
                userPassword: [{
                    required: true,
                    message: "密码不可为空",
                    trigger: "blur"
                }, ],
            },
            registeRules: {
                userName: [{
                    required: true,
                    message: "用户名为必填项",
                    trigger: "blur",
                }, ],
                userPassword: [{
                    required: true,
                    message: "密码为必填项",
                    trigger: "blur",
                },
                {
                    min: 6,
                    max: 30,
                    message: "密码长度在6-30之间",
                    trigger: "blur",
                }]
            }
        };
    },
    methods: {
        onRegist() {
            this.loginView = false;
        },
        onCancelRegist() {
            this.loginView = true;
        },
        onLogin(formName) {
            const _this = this;
            const currentUser = localStorage.getItem("userName");

            console.log(currentUser);
            if (window.currentUser != null) {
                console.log("已经登陆过啦");
                if (window.userType === "admin") {
                    _this.$router.push("/manage");
                } else if (window.userType === "user") {
                    _this.$router.push("/personal");
                }
            } else {
                console.log("没有登录历史记录");
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: "post",
                            url: "http://localhost:8080/login",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded",
                            },
                            data: qs.stringify({
                                userName: this.loginForm.userName,
                                userPassword: this.loginForm.userPassword,
                            }),
                        })
                        .then(function (response) {
                            const status = response.data.status;
                            if (status === "admin") {
                                ele.Message.success(
                                    "欢迎您 尊贵的管理员，即将跳转到后台管理界面"
                                );
                                localStorage.setItem("userName", _this.loginForm.userName);
                                localStorage.setItem("userType", "admin");
                                _this.$router.push("/manage");
                            } else if (status === "user") {
                                ele.Message.success("欢迎您 尊贵的用户，即将跳转到个人主页");
                                localStorage.setItem("userName", _this.loginForm.userName);
                                localStorage.setItem("userType", "user");
                                _this.$router.push("/personal");
                            } else {
                                ele.Message.error("登录失败，请检查用户名或者密码是否正确");
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    }
                });
            }
        },
        onSubmitRegist(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: "post",
                        url: "http://localhost:8080/addUser",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded",
                        },
                        data: qs.stringify({
                            userName: this.registeForm.userName,
                            userPassword: this.registeForm.userPassword,
                            userSex: this.registeForm.userSex,
                            userAge: this.registeForm.userAge,
                            userPhone: this.registeForm.userPhone,
                            userDesc: this.registeForm.userDesc,
                            userProfile: this.registeForm.userProfile
                        }),
                    })
                    .then(function (response) {
                        let status = response.data.status;
                        if (status == "failed") {
                            ele.Message.error("该用户名已经被别人占用啦，换一个吧~");
                        } else {
                            ele.Message.success("注册成功 即将跳转到个人主页");
                            localStorage.setItem("userName", _this.registeForm.userName);
                            localStorage.setItem("userType", "user");
                            _this.$router.push("/personal");
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            });
        }
    },
    mounted() {
        this.userName = window.localStorage.getItem("userName");
        this.userType = window.localStorage.getItem("userType");
        console.log(this.userName, this.userType);

        if (this.userType === "admin") {
            ele.Message.success("您已经登陆过了，即将跳转到后台管理界面");
            this.$router.push("/manage");
        } else if (this.userType === "user") {
            ele.Message.success("您已经登陆过了，即将跳转到个人主页");
            this.$router.push("/personal");
        }
    }
};
</script>

<style lang="scss" scoped>
.main {
    background: url("../assets/banner1.jpeg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

.login-box {
    border: 1px solid #dcdfe6;
    background-color: white;
    width: 500px;
    margin: 150px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
}

.login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
}

.el-button {
    float: right;
    margin-left: 10px;
}

.register-button {
    background: #f2f2f2;
    color: rgb(64, 158, 225);
}
</style>
