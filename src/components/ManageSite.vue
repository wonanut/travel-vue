<template>
<div>
    <div class="top-bar">
        <el-button type="primary" icon="el-icon-edit" @click="addSite()">添加景点</el-button>
        <el-button :span="1" icon="el-icon-search">搜索</el-button>
    </div>
    <el-col :span="23" class="data-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" border style="width: 100%">
            <el-table-column label="景点ID" width="100px" sortable fixed>
                <template slot-scope="scope">
                    <span>{{ scope.row.siteID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="景点名称" width="200px;">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p><i style="color:rgb(64,158,255);" class="el-icon-info">景点名称</i>&nbsp;&nbsp;{{ scope.row.siteTitle }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-location">景点地址</i>&nbsp;&nbsp;{{ scope.row.siteCity }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-ticket">门票价格</i>&nbsp;&nbsp;{{ scope.row.sitePrice }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-comment">景点介绍</i>&nbsp;&nbsp;{{ scope.row.siteDesc }}</p>
                        <img :src="scope.row.sitePicture" style="height:300px" />
                        <div slot="reference" class="name-wrapper">
                            <span style="color:rgb(64,158,255);">{{ scope.row.siteTitle }}</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="景点地址" width="140px;" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.siteCity }}</span>
                </template>
            </el-table-column>
            <el-table-column label="门票价格" width="140px;" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.sitePrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="景点介绍" :span="5" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.siteDesc }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图片" width="380px">
                <template slot-scope="scope">
                    <span>{{ scope.row.sitePicture.slice(0, 50) + '...'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="100px;" sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row.siteAuthor }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px;">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm confirm-button-text='删除' cancel-button-text='取消' @confirm="handleDelete(scope.$index, scope.row)" icon="el-icon-info" icon-color="red" title="确定删除吗？">
                        <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10]" :page-size="pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" style="padding-top:20px">
        </el-pagination>
    </el-col>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
        <el-form ref="form" :model="form" :rules='rules' label-width="80px">
            <el-alert v-if="editable" title="管理员无法修改图片内容" type="warning" style="margin-bottom: 20px; margin-top:-20px;"></el-alert>
            <el-form-item label="景点名称" prop="siteTitle">
                <el-input v-model="form.siteTitle"></el-input>
            </el-form-item>
            <el-form-item label="景点地址" prop="siteCity">
                <el-input v-model="form.siteCity"></el-input>
            </el-form-item>
            <el-form-item label="景点介绍" prop="siteDesc">
                <el-input v-model="form.siteDesc"></el-input>
            </el-form-item>
            <el-form-item label="景点门票" prop="sitePrice">
                <el-input v-model="form.sitePrice"></el-input>
            </el-form-item>
            <el-form-item label="景点星级" prop="siteStar">
                <el-input v-model="form.siteStar"></el-input>
            </el-form-item>
            <el-form-item v-show=!editable label="添加图片">
                <el-upload class="avatar-uploader" action="http://localhost:8080/uploadPicture" list-type="picture-card" :show-file-list="true" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false" ref="upload" :on-success="onSuccess" :on-progress="onProgress" :limit="1">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="imgDialogVisible">
                    <img width="100%" :src="imgURL" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="发布者">
                <el-input v-model=userName :disabled=true></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="dialogTitle === '添加景点'" type="primary" @click="handleAddSite('form')">发 布</el-button>
            <el-button v-else type="primary" @click="handleModifySite('form')">修 改</el-button>
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
    data() {
        return {
            currentPage: 1,
            pagesize: 5,
            tableData: [],
            userName: '',
            dialogVisible: false,
            imgDialogVisible: false,

            // 修改公告时不能编辑图片
            editable: true,
            imgURL: '',
            currentSiteID: '',
            dialogTitle: '添加景点',
            form: {
                siteTitle: '',
                siteCity: '',
                sitePrice: '',
                siteDesc: '',
                siteAuthor: '',
                siteStar: '',
                sitePicture: ''
            },
            tableData: [],
            rules: {
                siteTitle: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                siteCity: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                sitePrice: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                siteDesc: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                siteStar: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
            this.pagesize = size;
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
        },
        addSite() {
            this.dialogVisible = true
            this.editable = false
            this.dialogTitle = '添加景点'
        },
        handleEdit(index, row) {
            this.dialogTitle = "修改景点信息"
            this.dialogVisible = true
            this.editable = true

            this.currentSiteID = row.siteID
            this.form.siteTitle = row.siteTitle
            this.form.siteCity = row.siteCity
            this.form.sitePrice = row.sitePrice
            this.form.siteDesc = row.siteDesc
            this.form.siteStar = row.siteStar
            this.form.sitePicture = row.sitePicture
            this.imgURL = row.sitePicture
        },
        onProgress() {},
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.imgURL = file.url
        },
        handleAddSite(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$refs.upload.submit();
                    // 后面执行onSuccess函数
                } else {
                    ele.Message.error("请按要求输入表格内容")
                }
            })
        },
        onSuccess: function (response) {
            if (response.status === "success") {
                this.form.sitePicture = response.imgURL
                let _this = this
                axios({
                    method: 'post',
                    url: 'http://localhost:8080/addSite',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        siteTitle: this.form.siteTitle,
                        siteCity: this.form.siteCity,
                        sitePrice: this.form.sitePrice,
                        siteDesc: this.form.siteDesc,
                        siteStar: this.form.siteStar,
                        sitePicture: this.form.sitePicture,
                        siteAuthor: this.userName
                    })
                }).then(function (response) {
                    let status = response.data.status
                    if (status == 'success') {
                        ele.Message.success('创建景点成功')
                        _this.tableData = response.data.dataList
                        _this.dialogVisible = false
                    } else {
                        ele.Message.error("创建景点失败")
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            } else {
                ele.Message.error("图像上传失败，请重试")
            }
        },
        handleModifySite(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/updateSite',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            siteID: this.currentSiteID,
                            siteTitle: this.form.siteTitle,
                            siteCity: this.form.siteCity,
                            sitePrice: this.form.sitePrice,
                            siteDesc: this.form.siteDesc,
                            siteStar: this.form.siteStar,
                            sitePicture: this.form.sitePicture,
                            siteAuthor: this.userName
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        ele.Message.success('更新景点数据成功')
                        _this.tableData = response.data.dataList
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
        handleDelete(index, row) {
            let _this = this
            axios({
                method: 'post',
                url: 'http://localhost:8080/deleteSite',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    siteID: row.siteID
                })
            }).then(function (response) {
                ele.Message.success('更新数据成功')
                _this.tableData = response.data.dataList
            }).catch(function (error) {
                console.log(error)
            })
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
                url: 'http://localhost:8080/getSiteList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                _this.tableData = response.data.dataList
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>
