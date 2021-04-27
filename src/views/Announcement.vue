<template>
<div class="hotel-main">
    <el-col :span="23" class="mesgList-table">
        <el-table :data="tableData.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">
            <el-table-column label="编号" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgID }}</span>
                </template>
            </el-table-column>
            <el-table-column label="公告标题" width="300px">
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgTitle }}</span>
                </template>
            </el-table-column>
            <el-table-column label="详细信息" :span="5">
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgDesc }}</span>
                    <el-button style="margin-left: 10px;" size="mini" type="text" @click="showDetail(scope.$index)">查看详情</el-button>
                </template>
            </el-table-column>
            <el-table-column label="发布者" width="100px">
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgAuthor }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="200px">
                <template slot-scope="scope">
                    <span>{{ scope.row.mesgDate }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10]" :page-size="pagesize" background layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" style="padding-top:20px">
        </el-pagination>
    </el-col>
    <el-dialog title="公告详情" :visible.sync="dialogVisible" width="30%">
        <h2>{{ mesgTitle }}</h2>
        <span style="color:rgb(64,158,255)">{{ mesgAuthor }} </span>
        <span style="color:gray">{{ mesgDate }}</span>
        <p>{{ mesgDesc }}</p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
const axios = require('axios')
const qs = require('qs')
const ele = require('element-ui')

export default {
    name: 'hotel_page',
    data() {
        return {
            currentPage: 1,
            pagesize: 5,
            dialogVisible: false,
            mesgTitle: '',
            mesgDesc: '',
            mesgDate: '',
            mesgAuthor: '',
            tableData: []
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
        showDetail(index) {
            this.mesgTitle = this.tableData[index].mesgTitle
            this.mesgDate = this.tableData[index].mesgDate
            this.mesgDesc = this.tableData[index].mesgDesc
            this.mesgAuthor = this.tableData[index].mesgAuthor
            this.dialogVisible = true
        },

    },
    created() {
        let _this = this
        this.userName = window.localStorage.getItem('userName')
        axios({
            method: 'get',
            url: 'http://localhost:8080/getAnnouncementList',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            _this.tableData = response.data.mesgList
        }).catch(function (error) {
            console.log(error)
        })
    }
};
</script>

<style>
.hotel-main {
    height: 100%;
    padding: 30px;
    margin-top: 20px;
}

.hotel-card {
    padding: 0px;
    margin-bottom: 10px;
    padding-right: 30px;
}

.el-header,
.el-footer {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: white;
    color: #333;
    text-align: center;
}

.el-main {
    background-color: white;
    color: #333;
    text-align: center;
}

.desc-img {
    width: 260px;
    padding-left: 0px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    text-align: left;
    padding-left: 30px;
    font-size: 14px;
    color: black;
    margin-top: -10px;
}

.grid-cont-right h2 {
    color: #42b983;
}
</style>
