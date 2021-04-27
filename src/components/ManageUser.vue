<template>
<div class='manageUser-main'>
    <el-row class="manageUser-toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="addUser()">添加用户</el-button>
        <el-button :span="1" icon="el-icon-search">搜索</el-button>
        <!-- <el-col :span="4" :offset="0"><el-tag style="margin-left:300px">用户信息管理 | 数据无价 小心操作</el-tag></el-col> -->
    </el-row>
    <el-col :span="23" class="data-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" border style="width: 100%">
            <el-table-column label="用户ID" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户名" width="150px">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <div class="user-info">
                            <img :src=scope.row.userProfile class="user-avator" alt style="height: 100px;" />
                            <div class="user-info-cont">
                                <p>名称: {{ scope.row.userName }}</p>
                                <p>密码: {{ scope.row.userPassword }}</p>
                                <p>介绍: {{ scope.row.userDesc }}</p>
                            </div>
                        </div>
                        <div slot="reference" class="name-wrapper">
                            <span style="color:rgb(64,158,255);">{{ scope.row.userName }}</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="密码" width="180px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userPassword }}</span>
                </template>
            </el-table-column>
            <el-table-column label="性别" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userSex }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userAge }}</span>
                </template>
            </el-table-column>
            <el-table-column label="电话" width="180px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="头像" width="380px">
                <template slot-scope="scope">
                    <span>{{ scope.row.userProfile.slice(0, 50) + '...'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="140px;">
                <template slot-scope="scope">
                    <el-tag type="success" style="margin-top: -5px;" size="small">{{ scope.row.userStatus }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" :span="1">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm confirm-button-text='删除' cancel-button-text='取消' @confirm="handleDelete(scope.$index, scope.row)" icon="el-icon-info" icon-color="red" title="确定删除该用户吗？">
                        <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10]" :page-size="pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" style="padding-top:20px">
        </el-pagination>
    </el-col>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="form" :rules='rules' label-width="80px">
            <el-alert v-if="!editable" title="管理员添加用户时只能使用默认头像" type="warning" style="margin-bottom: 20px; margin-top:-20px;"></el-alert>
            <el-form-item v-if="editable" label="" prop="userSex">
                <img :src=form.userProfile style="height: 100px;">
            </el-form-item>
            <el-form-item label="姓名" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPassword">
                <el-input v-model="form.userPassword" show-password></el-input>
            </el-form-item>
            <el-form-item v-if="editable" label="头像" prop="userProfile">
                <el-input v-model="form.userProfile"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="userAge">
                <el-input v-model="form.userAge"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="userSex">
                <el-input v-model="form.userSex"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="userSex">
                <el-input v-model="form.userPhone"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="userDesc">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8}" placeholder="请输入内容" v-model="form.userDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="dialogTitle === '添加用户'" type="primary" @click="handleAddUser('form')">添 加</el-button>
            <el-button v-else type="primary" @click="handleModifyUser('form')">修 改</el-button>
        </span>
    </el-dialog>
</div>
</template>

<style scoped>
.data-table {
    margin-top: 20px;
}
</style>

<script>
const axios = require('axios')
const qs = require('qs')
const ele = require('element-ui')

export default {
    name: 'manageUser',
    created() {
        if (window.localStorage.getItem('userType') != 'admin') {
            ele.Message.error("你没有管理员权限访问后台，即将跳转到登录页面")
            this.$router.push('/login')
        } else {
            let _this = this
            axios({
                method: 'get',
                url: 'http://localhost:8080/getUserList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                ele.Message.success('加载用户数据成功')
                _this.tableData = response.data.userList
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    data() {
        return {
            dialogTitle: '添加用户',
            currentUserID: '',
            prevUserName: '',
            editable: false,
            currentPage: 1,
            pagesize: 10,
            dialogVisible: false,
            form: {
                userName: '',
                userPassword: '',
                userAge: '',
                userSex: '',
                userPhone: '',
                userDesc: '',
                userProfile: '',
                userStatus: ''
            },
            tableData: [],
            // 表单验证，需要在 el-form-item 元素中增加 prop 属性
            rules: {
                userName: [{
                    required: true,
                    message: '用户名为必填项',
                    trigger: 'blur'
                }],
                userPassword: [{
                        required: true,
                        message: '密码为必填项',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 30,
                        message: "密码长度在6-30之间",
                        trigger: 'blur'
                    }
                ]
            },
        }
    },
    methods: {
        handleModifyUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/updateUserAdmin',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            userID: this.currentUserID,
                            userNamePrev: this.prevUserName,
                            userName: this.form.userName,
                            userPassword: this.form.userPassword,
                            userSex: this.form.userSex,
                            userAge: this.form.userAge,
                            userPhone: this.form.userPhone,
                            userDesc: this.form.userDesc,
                            userProfile: this.form.userProfile,
                            userStatus: this.form.userStatus
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        if (status == 'failed') {
                            ele.Message.error("该用户名已经被别人占用啦，换一个吧~")
                        } else {
                            ele.Message.success('更新用户数据成功')
                            _this.tableData = response.data.userList
                            _this.dialogVisible = false
                        }
                    }).catch(function (error) {
                        console.log(error)
                    })
                } else {
                    this.dialogVisible = true
                    return false
                }
            })
        },
        handleEdit(index, row) {
            this.dialogTitle = "修改用户信息"
            this.dialogVisible = true
            this.editable = true

            this.prevUserName = row.userName
            this.currentUserID = row.userID
            this.form.userName = row.userName
            this.form.userPassword = row.userPassword
            this.form.userAge = row.userAge
            this.form.userProfile = row.userProfile
            this.form.userSex = row.userSex
            this.form.userPhone = row.userPhone
            this.form.userDesc = row.userDesc
        },
        handleDelete(index, row) {
            let _this = this
            axios({
                method: 'post',
                url: 'http://localhost:8080/deleteUser',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    userID: row.userID
                })
            }).then(function (response) {
                ele.Message.success('更新用户数据成功')
                _this.tableData = response.data.userList
            }).catch(function (error) {
                console.log(error)
            })
        },
        addUser() {
            this.dialogTitle = "添加用户"
            this.dialogVisible = true
            this.editable = false

            this.prevUserName = ''
            this.currentUserID = ''
            this.form.userName = ''
            this.form.userPassword = ''
            this.form.userAge = ''
            this.form.userSex = ''
            this.form.userPhone = ''
            this.form.userDesc = ''
            this.form.userStatus = ''
            this.form.userProfile = ''
        },
        handleAddUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/addUser',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            userName: this.form.userName,
                            userPassword: this.form.userPassword,
                            userSex: this.form.userSex,
                            userAge: this.form.userAge,
                            userPhone: this.form.userPhone,
                            userDesc: this.form.userDesc
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        if (status == 'failed') {
                            ele.Message.error("该用户名已经被别人占用啦，换一个吧~")
                        } else {
                            ele.Message.success('更新用户数据成功')
                            _this.tableData = response.data.userList
                            _this.dialogVisible = false
                        }
                    }).catch(function (error) {
                        console.log(error)
                    })
                } else {
                    this.dialogVisible = true
                    return false
                }
            })
        },
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
            this.pagesize = size;
            console.log(this.pagesize) //每页下拉显示数据
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
            console.log(this.currentPage) //点击第几页
        }
    }
}
</script>
