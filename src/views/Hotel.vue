<template>
<div class="hotel-main">
    <el-container>
        <el-container>
            <el-table :data="tableData" border style="width: 100%" class="hotel-card" :show-header="false">
                <el-table-column width="80px" class="hotel-card-column">
                    <template slot-scope="scope">
                        <el-avatar :size="40" style="background: rgb(250, 172, 98);" v-if='scope.$index == 0'>
                            <p style="margin-top: 0px;">{{ scope.$index + 1 }}</p>
                        </el-avatar>
                        <el-avatar :size="40" style="background: rgb(94, 153, 183);" v-else-if='scope.$index == 1'>
                            <p style="margin-top: 0px;">{{ scope.$index + 1 }}</p>
                        </el-avatar>
                        <el-avatar :size="40" style="background: rgb(83, 141, 153);" v-else-if='scope.$index == 2'>
                            <p style="margin-top: 0px;">{{ scope.$index + 1 }}</p>
                        </el-avatar>
                        <el-avatar :size="40" style="background: rgb(148, 166, 214);" v-else>
                            <p style="margin-top: 0px;">{{ scope.$index + 1 }}</p>
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column :span="1">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="8">
                                <img class="desc-img" :src=scope.row.hotelPicture />
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-cont-right" @click=detail(scope.$index)>
                                    <h2>{{ scope.row.hotelName }}</h2>
                                    <p><i style="color:#42b983;" class="el-icon-s-promotion">发布时间</i>&nbsp;&nbsp;{{ scope.row.hotelDate }}</p>
                                    <p><i style="color:#42b983;" class="el-icon-location">民宿地址</i>&nbsp;&nbsp;{{ scope.row.hotelAddress }}</p>
                                    <p><i style="color:#42b983;" class="el-icon-s-ticket">住宿价格</i>&nbsp;&nbsp;{{ scope.row.hotelPrice }}</p>
                                </div>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-footer>到底了</el-footer>
        </el-container>
        <el-aside width="50%">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>民宿详情</span>
                </div>
                <div style="text-align:left;">
                    <h2>{{ this.hotelName }}</h2>
                    <el-rate v-model="hotelStar" disabled show-score text-color="#ff9900">
                    </el-rate>
                    <p><i style="color:#42b983;" class="el-icon-s-promotion">发布时间</i>&nbsp;&nbsp;&nbsp;{{ this.hotelDate }}</p>
                    <p><i style="color:#42b983;" class="el-icon-location">民宿地址</i>&nbsp;&nbsp;&nbsp;{{ this.hotelAddress }}</p>
                    <p><i style="color:#42b983;" class="el-icon-s-ticket">住宿价格</i>&nbsp;&nbsp;&nbsp;{{ this.hotelPrice }}</p>
                    <p><i style="color:#42b983;" class="el-icon-s-ticket">民宿介绍</i>&nbsp;&nbsp;&nbsp;{{ this.hotelDesc }}</p>
                    <img :src=this.hotelPicture style="width:80%;" />
                </div>
            </el-card>
        </el-aside>
    </el-container>
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
            hotelID: '',
            hotelName: '',
            hotelDate: '',
            hotelAddress: '',
            hotelPrice: '',
            hotelDesc: '',
            hotelAuthor: '',
            hotelStar: 0,
            hotelPicture: '',
            tableData: []
        }
    },
    methods: {
        detail(index) {
            this.hotelID = this.tableData[index].hotelID
            this.hotelName = this.tableData[index].hotelName
            this.hotelDate = this.tableData[index].hotelDate
            this.hotelPrice = this.tableData[index].hotelPrice
            this.hotelAddress = this.tableData[index].hotelAddress
            this.hotelPicture = this.tableData[index].hotelPicture
            this.hotelAuthor = this.tableData[index].hotelAuthor
            this.hotelDesc = this.tableData[index].hotelDesc
            this.hotelStar = parseFloat(this.tableData[index].hotelStar)
        }
    },
    created() {
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
            console.log(_this.tableData)
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
}

.hotel-card {
    padding: 0px;
    margin-bottom: 10px;
    padding-right: 30px;
}

.hotel-card th {
    border: none;
}

.hotel-card td,
.customer-table th.is-leaf {
    border: none;
}

.el-table--border,
.el-table--group {
    border: none;
}

.hotel-card thead tr th.is-leaf {
    border: 1px solid #EBEEF5;
    border-right: none;
}

.hotel-card thead tr th:nth-last-of-type(2) {
    border-right: 1px solid #EBEEF5;
}

.el-table--border::after,
.el-table--group::after {
    width: 0;
}

.hotel-card::before {
    width: 0;
}

.hotel-card .el-table__fixed-right::before,
.el-table__fixed::before {
    width: 0;
}

.el-table--border th.gutter:last-of-type {
    border: 1px solid #EBEEF5;
    border-left: none;
}

.el-header,
.el-footer {
    background-color: #f2f2f2;
    color: #333;
    text-align: center;
    margin-right: 30px;
    line-height: 60px;
    border-radius: 5px;
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
    width: 100%;
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
