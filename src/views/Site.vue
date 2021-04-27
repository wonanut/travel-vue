<template>
<div class="site-main">
    <el-container>
        <el-container>
            <el-table :data="tableData" border style="width: 100%" class="site-card" :show-header="false">
                <el-table-column :span="1">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="8">
                                <img class="desc-img" :src=scope.row.sitePicture />
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-cont-right" @click=detail(scope.$index)>
                                    <h2>{{ scope.row.siteTitle }}</h2>
                                    <p><i style="color:#42b983;" class="el-icon-location">景点地址</i>&nbsp;&nbsp;{{ scope.row.siteCity }}</p>
                                    <p><i style="color:#42b983;" class="el-icon-s-ticket">门票价格</i>&nbsp;&nbsp;{{ scope.row.sitePrice }}</p>
                                    <p><i style="color:#42b983;" class="el-icon-location">景点评分</i>&nbsp;&nbsp;{{ scope.row.siteStar }}</p>
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
                    <span>景点详情</span>
                </div>
                <div style="text-align:left;">
                    <h2>{{ this.siteTitle }}</h2>
                    <!-- <el-rate
                            v-model="siteStar"
                            disabled
                            show-score
                            text-color="#ff9900">
                        </el-rate> -->
                    <p><i style="color:#42b983;" class="el-icon-location">景点地址</i>&nbsp;&nbsp;&nbsp;{{ this.siteCity }}</p>
                    <p><i style="color:#42b983;" class="el-icon-s-ticket">门票价格</i>&nbsp;&nbsp;&nbsp;{{ this.sitePrice }}</p>
                    <p><i style="color:#42b983;" class="el-icon-s-ticket">景点介绍</i>&nbsp;&nbsp;&nbsp;{{ this.siteDesc }}</p>
                    <p><i style="color:#42b983;" class="el-icon-location">景点评分</i>&nbsp;&nbsp;&nbsp;{{ this.siteStar }}</p>
                    <img :src=this.sitePicture slot="error" style="width:80%;" />
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
    name: 'site_page',
    data() {
        return {
            siteID: '1',
            siteTitle: '',
            siteDate: '',
            siteCity: '',
            sitePrice: '',
            siteDesc: '',
            siteAuthor: '',
            siteStar: '',
            sitePicture: '',
            tableData: []
        }
    },
    methods: {
        detail(index) {
            this.siteID = this.tableData[index].siteID
            this.siteTitle = this.tableData[index].siteTitle
            this.sitePrice = this.tableData[index].sitePrice
            this.siteCity = this.tableData[index].siteCity
            this.sitePicture = this.tableData[index].sitePicture
            this.siteAuthor = this.tableData[index].siteAuthor
            this.siteDesc = this.tableData[index].siteDesc
            this.siteStar = this.tableData[index].siteStar
        }
    },
    created() {
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
            console.log(_this.tableData)
        }).catch(function (error) {
            console.log(error)
        })
    }
};
</script>

<style>
.site-main {
    height: 100%;
    padding: 30px;
    margin-top: 20px;
}

.site-card {
    padding: 0px;
    margin-bottom: 10px;
    padding-right: 30px;
}

.site-card th {
    border: none;
}

.el-table--border,
.el-table--group {
    border: none;
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
    background-color: lightslategray;
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
