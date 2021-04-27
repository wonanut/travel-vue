<template>
<div class="main">
    <SideBar @func="getIndex"></SideBar>
    <div class="container">
        <ManageAnnouncement v-if="index === '/manageAnnouncement'" />
        <ManageUser v-else-if="index === '/manageUser'" />
        <ManageSite v-else-if="index === '/manageSite'" />
        <ManageProduct v-else-if="index === '/manageProduct'" />
        <ManageHotel v-else-if="index === '/manageHotel'" />
        <ManageSystem v-else-if="index === '/manageSystem'" />
        <ManageDashboard v-else />
    </div>
</div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'

import ManageDashboard from '@/components/ManageDashboard.vue'
import ManageAnnouncement from '@/components/ManageAnnouncement.vue'
import ManageUser from '@/components/ManageUser.vue'
import ManageSite from '@/components/ManageSite.vue'
import ManageProduct from '@/components/ManageProduct.vue'
import ManageHotel from '@/components/ManageHotel.vue'
import ManageSystem from '@/components/ManageSystem.vue'

const axios = require('axios')
const qs = require('qs')
const ele = require('element-ui')

export default {
    name: '',
    data() {
        return {
            name: localStorage.getItem('userName'),
            index: '',
        };
    },
    components: {
        SideBar,
        ManageDashboard,
        ManageAnnouncement,
        ManageUser,
        ManageSite,
        ManageProduct,
        ManageHotel,
        ManageSystem
    },
    computed: {

    },
    initInjections () {
        if (window.localStorage.getItem('userType') != 'admin') {
            ele.Message.error("你没有管理员权限访问后台，即将跳转到登录页面")
            this.$router.push('/login')
        }
    },
    methods: {
        getIndex(data) {
            this.index = data
        }
    }
};
</script>

<style scoped>
.container {
    padding-left: 280px;
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
