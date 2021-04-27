<template>
<div>
    <div class="top-bar">
        <el-button type="primary" icon="el-icon-edit" @click="addAnnouncement()">发布公告</el-button>
        <el-button :span="1" icon="el-icon-search">搜索</el-button>
    </div>
    <el-col :span="23" class="data-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" border style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="通知ID" width="100px" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="200px" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="通知名称" :span="1" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgTitle }}</span>
                </template>
            </el-table-column>
            <el-table-column label="详细信息" :span="5" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgDesc }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="150px" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgAuthor }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px;">
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
        <el-form ref="form" :model="form" :rules='rules' label-width="80px">
            <el-form-item label="标题" prop="mesgTitle">
                <el-input v-model="form.mesgTitle"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="mesgDesc">
                <el-input type="textarea" placeholder="请输入内容" v-model="form.mesgDesc"></el-input>
            </el-form-item>
            <el-form-item label="发布者">
                <el-input v-model=userName :disabled=true></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="dialogTitle === '添加公告'" type="primary" @click="handleAddAnnouncement('form')">发 布</el-button>
            <el-button v-else type="primary" @click="handleModifyAnnouncement('form')">修 改</el-button>
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
    name: 'manageAnnouncement',
    data() {
        return {
            currentPage: 1,
            pagesize: 5,
            dialogVisible: false,
            dialogTitle: '添加公告',
            currentAnnouncementID: '',
            userName: '',
            form: {
                mesgTitle: '',
                mesgDesc: '',
                mesgDate: ''
            },
            tableData: [],
            rules: {
                mesgTitle: [{
                    required: true,
                    message: '公告标题为必填项',
                    trigger: 'blur'
                }],
                mesgDesc: [{
                    required: true,
                    message: '公告内容为必填项',
                    trigger: 'blur'
                }]
            },
        }
    },
    created() {
        if (window.localStorage.getItem('userType') != 'admin') {
            ele.Message.error("你没有管理员权限访问后台，即将跳转到登录页面")
            this.$router.push('/login')
        } else {
            let _this = this
            this.userName = window.localStorage.getItem('userName')
            axios({
                method: 'get',
                url: 'http://localhost:8080/getAnnouncementList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                ele.Message.success('加载公告数据成功')
                _this.tableData = response.data.mesgList
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    methods: {
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
            this.pagesize = size;
            console.log(this.pagesize) //每页下拉显示数据
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
            console.log(this.currentPage) //点击第几页
        },
        addAnnouncement() {
            this.dialogVisible = true
            this.dialogTitle = '添加公告'

            this.form.mesgTitle = ''
            this.form.mesgDesc = ''
        },
        handleModifyAnnouncement(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/updateAnnouncement',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            mesgID: this.currentAnnouncementID,
                            mesgTitle: this.form.mesgTitle,
                            mesgDesc: this.form.mesgDesc,
                            mesgAuthor: this.userName,
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        ele.Message.success('更新公告成功')
                        _this.tableData = response.data.mesgList
                        _this.dialogVisible = false
                    }).catch(function (error) {
                        console.log(error)
                    })
                } else {
                    this.dialogVisible = true
                    return false
                }
            })
        },
        handleAddAnnouncement(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/addAnnouncement',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            mesgTitle: this.form.mesgTitle,
                            mesgDesc: this.form.mesgDesc,
                            mesgAuthor: this.userName,
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        if (status == 'success') {
                            ele.Message.success('发布公告成功')
                            _this.tableData = response.data.mesgList
                            _this.dialogVisible = false
                        } else {
                            ele.Message.error("发布公告失败")
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
            this.dialogTitle = "修改公告"
            this.dialogVisible = true

            this.form.mesgTitle = row.mesgTitle
            this.form.mesgDesc = row.mesgDesc
            this.currentAnnouncementID = row.mesgID
        },
        handleDelete(index, row) {
            let _this = this
            axios({
                method: 'post',
                url: 'http://localhost:8080/deleteAnnouncement',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    mesgID: row.mesgID
                })
            }).then(function (response) {
                ele.Message.success('更新用户数据成功')
                _this.tableData = response.data.mesgList
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>
