<template>
<div class="personal-card">
    <el-row :gutter="24">
        <el-col :span="6">
            <el-card shadow="never">
                <div class="user-info">
                    <img :src=userInfo.userProfile class="user-avator" alt />
                    <div class="user-info-cont">
                        <div class="user-info-name">{{ userInfo.userName }}</div>
                        <p>{{ userInfo.userDesc }}</p>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-tabs type="card">
                <el-tabs v-model="activePanel">
                    <el-tab-pane class="panel" label="用户信息" name="first">
                        <el-form label-width="80px" style="width: 40%;">
                            <el-form-item label="用户名">
                                <el-input v-model=userInfo.userName :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model=userInfo.userPassword :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式">
                                <el-input v-model=userInfo.userPhone :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-input v-model=userInfo.userSex :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <el-input v-model=userInfo.userAge :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="个人介绍">
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8}" v-model=userInfo.userDesc :disabled=editable></el-input>
                            </el-form-item>
                            <el-form-item label="修改头像" v-if="!editable">
                                <el-upload
                                    class="avatar-uploader"
                                    action="http://localhost:8080/uploadUserProfile" 
                                    list-type="picture-card"
                                    :show-file-list="true"
                                    :on-preview="handlePictureCardPreview" 
                                    :on-remove="handleRemove"
                                    :auto-upload="false"
                                    ref="upload"
                                    :on-success="onSuccess"
                                    :on-progress="onProgress"
                                    :limit="1"
                                    >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible">
                                    <img width="100%" :src="imgURL" alt="">
                                </el-dialog>
                            </el-form-item>
                        </el-form>
                        <el-row class="manageUser-toolbar" style="text-align:left;">
                            <el-button v-if=editable type="primary" icon="el-icon-edit" @click="onModify()" :disabled=!editable>修改信息</el-button>
                            <el-button v-else type="primary" icon="el-icon-arrow-left" @click="onCancel()" :disabled=editable>放弃修改</el-button>
                            <el-button type="success" icon="el-icon-check" @click="onSubmitEdit()" :disabled=editable>提交修改</el-button>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane class="panel" label="订单管理" name="second">暂无订单</el-tab-pane>
                    <el-tab-pane class="panel" label="游记管理" name="third">暂无游记</el-tab-pane>
                    <el-tab-pane class="panel" label="账号管理" name="fourth">
                        <el-button type="danger" icon="el-icon-s-promotion" @click="quit()">退出账号</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-tabs>
        </el-col>
    </el-row>

</div>
</template>

<script>
const axios = require('axios')
const qs = require('qs')
const ele = require('element-ui')

export default {
    name: 'personal_page',
    data() {
        return {
            activePanel: "first",
            editable: true,
            userName: '',
            userInfo: {},
            dialogVisible: false,
            imgURL: ''
        }
    },
    methods: {
        quit() {
            window.localStorage.setItem('userName', '')
            window.localStorage.setItem('userType', '')
            window.localStorage.setItem('userProfile', '')
            this.$router.push('/login')
            ele.Message.success("退出当前账号")
        },
        onModify() {
            this.editable = false
        },
        onProgress() {

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.imgURL = file.url
        },
        onSubmitEdit(res) {
            // 首先上传用户头像，获得头像在服务器上的保存地址
            // 如果头像上传成功，会自动调用onSuccess
            this.$refs.upload.submit();
        },
        onSuccess: function (response) {
            if (response.status === "success") {
                this.userInfo.userProfile = response.imgURL
                // 更新用户信息
                let _this = this
                axios({
                    method: 'post',
                    url: 'http://localhost:8080/updateUser',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        userID: this.userInfo.userID,
                        userNamePrev: this.userName,
                        userName: this.userInfo.userName,
                        userPassword: this.userInfo.userPassword,
                        userSex: this.userInfo.userSex,
                        userAge: this.userInfo.userAge,
                        userPhone: this.userInfo.userPhone,
                        userDesc: this.userInfo.userDesc,
                        userStatus: this.userInfo.userStatus,
                        userProfile: this.userInfo.userProfile
                    })
                }).then(function (response) {
                    let status = response.data.status
                    if (status == 'failed') {
                        ele.Message.error("该用户名已经被别人占用啦，换一个吧~")
                        _this.userName = window.localStorage.getItem('userName');
                        _this.userInfo.userName = _this.userName
                    } else {
                        ele.Message.success('修改成功')
                        _this.userInfo = response.data.userList
                        _this.userName = _this.userInfo.userName
                        window.localStorage.setItem('userName', _this.userName);
                        _this.editable = true
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
            else {
                ele.Message.error("头像上传失败，请重试")
            }
        },
        onCancel() {
            this.editable = true
        }
    },
    created() {
        if (window.localStorage.getItem('userType') != 'user') {
            ele.Message.error("请先登录，即将跳转到登录页面")
            this.$router.push('/login')
        } else {
            this.userName = window.localStorage.getItem('userName');
            let _this = this
            axios({
                method: 'post',
                url: 'http://localhost:8080/getUser',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    userName: _this.userName,
                })
            }).then(function (response) {
                let status = response.data.status
                if (status == 'failed') {
                    ele.Message.error("加载用户信息失败")
                } else {
                    _this.userInfo = response.data.userList
                    window.localStorage.setItem('userProfile', response.data.userList.userProfile)
                }
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
};
</script>

<style scoped>
.personal-card {
    padding-left: 50px;
    padding-right: 50px;
    margin-top: 30px;
    width: 100%;
}

.panel {
    padding-top: 20px;
}

.user-avator {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.user-info {
    display: flex;
    align-items: left;
}

.user-info-name {
    font-size: 24px;
}

.user-info-cont {
    padding-left: 30px;
}

.user-info-cont p {
    font-size: 12px;
    color: gray;
}
</style>
