<template>
<div>
    <div class="top-bar">
        <el-button type="primary" icon="el-icon-edit" @click="addHotel()">添加民宿</el-button>
        <el-button :span="1" icon="el-icon-search">搜索</el-button>
    </div>
    <el-col :span="23" class="data-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" border style="width: 100%">
            <el-table-column label="ID" width="80px" fixed>
                <template slot-scope="scope">
                    <span>{{ scope.row.hotelID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="民宿名称" width="150px" fixed>
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p><i style="color:rgb(64,158,255);" class="el-icon-info">民宿名称</i>&nbsp;&nbsp;{{ scope.row.hotelName }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-promotion">发布时间</i>&nbsp;&nbsp;{{ scope.row.hotelDate }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-ticket">民宿价格</i>&nbsp;&nbsp;{{ scope.row.hotelPrice }}</p>
                        <p><i style="color:rgb(64,158,255);" class="el-icon-s-comment">民宿介绍</i>&nbsp;&nbsp;{{ scope.row.hotelDesc }}</p>
                        <img :src="scope.row.hotelPicture" style="height:300px" />
                        <div slot="reference" class="name-wrapper">
                            <span style="color:rgb(64,158,255);">{{ scope.row.hotelName }}</span>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="民宿地址" width="200px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelAddress }}</span>
                </template>
            </el-table-column>
            <el-table-column label="民宿价格" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="民宿星级" width="140px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelStar }}</span>
                </template>
            </el-table-column>
            <el-table-column label="余量" :span="1" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelRemain }}</span>
                </template>
            </el-table-column>
            <el-table-column label="图片" width="380px">
                <template slot-scope="scope">
                    <span>{{ scope.row.hotelPicture.slice(0, 40) + '...'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="150px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelAuthor }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="200px" sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.hotelDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px;" fixed="right">
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
            <el-form-item label="民宿名称" prop="hotelName">
                <el-input v-model="form.hotelName"></el-input>
            </el-form-item>
            <el-form-item label="民宿介绍" prop="hotelDesc">
                <el-input v-model="form.hotelDesc"></el-input>
            </el-form-item>
            <el-form-item label="民宿地址" prop="hotelAddress">
                <el-input v-model="form.hotelAddress"></el-input>
            </el-form-item>
            <el-form-item label="民宿价格" prop="hotelPrice">
                <el-input v-model="form.hotelPrice"></el-input>
            </el-form-item>
            <el-form-item label="民宿星级" prop="hotelStar">
                <el-input v-model="form.hotelStar"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="hotelPhone">
                <el-input v-model="form.hotelPhone"></el-input>
            </el-form-item>
            <el-form-item label="余量" prop="hotelRemain">
                <el-input v-model="form.hotelRemain"></el-input>
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
            <el-button v-if="dialogTitle === '添加民宿'" type="primary" @click="handleAddHotel('form')">发 布</el-button>
            <el-button v-else type="primary" @click="handleModifyHotel('form')">修 改</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
const axios = require('axios')
const qs = require('qs')
const ele = require('element-ui')

export default {
    name: 'manageHotel',
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
            currentHotelID: '',
            dialogTitle: '添加民宿',
            form: {
                hotelName: '',
                hotelDesc: '',
                hotelAddress: '',
                hotelPrice: '',
                hotelStar: '',
                hotelPhone: '',
                hotelRemain: '',
                hotelPicture: '',
                hotelAuthor: ''
            },
            tableData: [],
            rules: {
                hotelName: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelDesc: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelAddress: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelPrice: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelStar: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelPhone: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }],
                hotelRemain: [{
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
                url: 'http://localhost:8080/getHotelList',
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
        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
            this.pagesize = size;
            console.log(this.pagesize) //每页下拉显示数据
        },
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
            console.log(this.currentPage) //点击第几页
        },
        addHotel() {
            this.dialogVisible = true
            this.dialogTitle = '添加民宿'
            this.editable = false

            // 表格中的内容（this.form）应该要清空才对，为了测试方便暂时不清空
        },
        handleEdit(index, row) {
            this.dialogTitle = "修改民宿信息"
            this.dialogVisible = true
            this.editable = true

            this.currentHotelID = row.hotelID,
                this.form.hotelName = row.hotelName,
                this.form.hotelDesc = row.hotelDesc,
                this.form.hotelAddress = row.hotelAddress,
                this.form.hotelPrice = row.hotelPrice,
                this.form.hotelStar = row.hotelStar,
                this.form.hotelPhone = row.hotelPhone,
                this.form.hotelRemain = row.hotelRemain,
                this.form.hotelPicture = row.hotelPicture
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
        handleAddHotel(formName) {
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
                this.form.hotelPicture = response.imgURL
                let _this = this
                axios({
                    method: 'post',
                    url: 'http://localhost:8080/addHotel',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: qs.stringify({
                        hotelName: this.form.hotelName,
                        hotelDesc: this.form.hotelDesc,
                        hotelAddress: this.form.hotelAddress,
                        hotelPrice: this.form.hotelPrice,
                        hotelStar: this.form.hotelStar,
                        hotelPhone: this.form.hotelPhone,
                        hotelRemain: this.form.hotelRemain,
                        hotelPicture: this.form.hotelPicture,
                        hotelAuthor: this.userName
                    })
                }).then(function (response) {
                    let status = response.data.status
                    if (status == 'success') {
                        ele.Message.success('创建民宿成功')
                        _this.tableData = response.data.dataList
                        _this.dialogVisible = false
                    } else {
                        ele.Message.error("创建民宿失败")
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            } else {
                ele.Message.error("图像上传失败，请重试")
            }
        },
        handleModifyHotel(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _this = this
                    axios({
                        method: 'post',
                        url: 'http://localhost:8080/updateHotel',
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: qs.stringify({
                            hotelID: this.currentHotelID,
                            hotelName: this.form.hotelName,
                            hotelDesc: this.form.hotelDesc,
                            hotelAddress: this.form.hotelAddress,
                            hotelPrice: this.form.hotelPrice,
                            hotelStar: this.form.hotelStar,
                            hotelPhone: this.form.hotelPhone,
                            hotelRemain: this.form.hotelRemain,
                            hotelPicture: this.form.hotelPicture,
                            hotelAuthor: this.userName
                        })
                    }).then(function (response) {
                        let status = response.data.status
                        ele.Message.success('更新民宿数据成功')
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
                url: 'http://localhost:8080/deleteHotel',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    hotelID: row.hotelID
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

<style scoped>
.data-table {
    margin-top: 20px;
}
</style>