<template>
<div>
    <div class="top-bar">
        <el-button type="primary" icon="el-icon-edit" @click="addProduct()">添加特产</el-button>
        <el-button :span="1" icon="el-icon-search">搜索</el-button>
    </div>
    <el-col :span="23" class="data-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" border style="width: 100%">
            <el-table-column label="ID" width="80px" fixed>
                <template slot-scope="scope">
                    <span>{{ scope.row.productID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特产名称" width="150px" fixed>
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p><i style="color:rgb(64,158,255);" class="el-icon-info">特产名称</i>&nbsp;&nbsp;{{ scope.row.productName }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-promotion">发布时间</i>&nbsp;&nbsp;{{ scope.row.productDate }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-ticket">特产价格</i>&nbsp;&nbsp;{{ scope.row.productPrice }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-comment">特产介绍</i>&nbsp;&nbsp;{{ scope.row.productDesc }}</p>
                        <img :src="scope.row.productPicture" style="height:300px" />
                        <div slot="reference" class="name-wrapper">
                            <span style="color:rgb(64,158,255);">{{ scope.row.productName }}</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="特产价格" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="推荐星级" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productStar }}</span>
                </template>
            </el-table-column>
            <el-table-column label="余量" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productRemain }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图片" width="380px">
                <template slot-scope="scope">
                    <span>{{ scope.row.productPicture.slice(0, 40) + '...'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="150px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productAuthor }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="200px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.productDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" fixed="right">
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
            <el-form-item label="特产名称" prop="productName">
                <el-input v-model="form.productName"></el-input>
            </el-form-item>
            <el-form-item label="特产介绍" prop="productDesc">
                <el-input v-model="form.productDesc"></el-input>
            </el-form-item>
            <el-form-item label="特产价格" prop="productPrice">
                <el-input v-model="form.productPrice"></el-input>
            </el-form-item>
            <el-form-item label="推荐星级" prop="productStar">
                <el-input v-model="form.productStar"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="productPhone">
                <el-input v-model="form.productPhone"></el-input>
            </el-form-item>
            <el-form-item label="余量" prop="productRemain">
                <el-input v-model="form.productRemain"></el-input>
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
            <el-button v-if="dialogTitle === '添加特产'" type="primary" @click="handleAddProduct('form')">发 布</el-button>
            <el-button v-else type="primary" @click="handleModifyProduct('form')">修 改</el-button>
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
            currentProductID: '',
            dialogTitle: '添加特产',
            form: {
                productName: '',
                productDesc: '',
                productAuthor: '',
                productPicture: '',
                productPrice: '',
                productPhone: '',
                productRemain: '',
                productStar: '',
                productAuthor: ''
            },
            tableData: [],
            rules: {
                productName: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productDesc: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productStar: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productPicture: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productPrice: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productPhone: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                productRemain: [{
                    required: true,
                    message: '必填项',
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
                url: 'http://localhost:8080/getProductList',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                _this.tableData = response.data.dataList
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    methods: {
        handleSizeChange: function (size) {
            this.pagesize = size;
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
        },
        addProduct() {
            this.dialogVisible = true
            this.dialogTitle = '添加特产'
            this.editable = false

            // 表格中的内容（this.form）应该要清空才对，为了测试方便暂时不清空
        },
        handleEdit(index, row) {
            this.dialogTitle = "修特产信息"
            this.dialogVisible = true
            this.editable = true

            this.currentProductID = row.productID,
                this.form.productName = row.productName,
                this.form.productDesc = row.productDesc,
                this.form.productPrice = row.productPrice,
                this.form.productStar = row.productStar,
                this.form.productPhone = row.productPhone,
                this.form.productRemain = row.productRemain,
                this.form.productPicture = row.productPicture
        },
        handleAddProduct(formName) {
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
                this.form.productPicture = response.imgURL
                let _this = this
                axios({
                    method: 'post',
                    url: 'http://localhost:8080/addProduct',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        productName: this.form.productName,
                        productDesc: this.form.productDesc,
                        productPrice: this.form.productPrice,
                        productStar: this.form.productStar,
                        productPhone: this.form.productPhone,
                        productRemain: this.form.productRemain,
                        productPicture: this.form.productPicture,
                        productAuthor: this.userName
                    })
                }).then(function (response) {
                    let status = response.data.status
                    if (status == 'success') {
                        ele.Message.success('创建特产成功')
                        _this.tableData = response.data.dataList
                        _this.dialogVisible = false
                    } else {
                        ele.Message.error("创建特产失败")
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            } else {
                ele.Message.error("图像上传失败，请重试")
            }
        },
        onProgress() {},
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.imgURL = file.url
        },
        handleModifyProduct(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/updateProduct',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            productID: this.currentProductID,
                            productName: this.form.productName,
                            productDesc: this.form.productDesc,
                            productPrice: this.form.productPrice,
                            productStar: this.form.productStar,
                            productPhone: this.form.productPhone,
                            productRemain: this.form.productRemain,
                            productPicture: this.form.productPicture,
                            productAuthor: this.userName
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        ele.Message.success('更新特产数据成功')
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
                url: 'http://localhost:8080/deleteProduct',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    productID: row.productID
                })
            }).then(function (response) {
                ele.Message.success('更新数据成功')
                _this.tableData = response.data.dataList
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>
