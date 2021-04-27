<template>
<div class="sidebar">
    <el-menu class="sidebar-el-menu" background-color="#324157" unique-opened>
        <template v-for="item in items">
            <template>
                <el-menu-item v-if="item.index === activatedIndex" style="color:white;" :index="item.index" :key="item.index" @click="handleClick(item.index)">
                    <i style="color:white" :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
                <el-menu-item v-else style="color:#aaaaaa" :index="item.index" :key="item.index" @click="handleClick(item.index)">
                    <i style="color:#aaaaaa" :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</div>
</template>

<style>
.sidebar {
    display: block;
    position: fixed;
    left: 0;
    top: 62px;
    bottom: 0;
    overflow-y: scroll;
    text-align: center;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar>ul {
    height: 100%;
}
</style>

<script>
export default {
    name: 'sidebar',
    data() {
        return {
            activatedIndex: '/manage',
            items: [{
                    icon: 'el-icon-house',
                    index: '/manage',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-document',
                    index: '/manageAnnouncement',
                    title: '公告管理',
                },
                {
                    icon: 'el-icon-user',
                    index: '/manageUser',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-location-outline',
                    index: '/manageSite',
                    title: '景点管理'
                },
                {
                    icon: 'el-icon-shopping-bag-1',
                    index: '/manageProduct',
                    title: '特产管理'
                },
                {
                    icon: 'el-icon-price-tag',
                    index: '/manageHotel',
                    title: '民宿管理'
                },
                {
                    icon: 'el-icon-setting',
                    index: '/manageSystem',
                    title: '系统维护'
                }
            ]
        };
    },
    methods: {
        handleClick(index) {
            this.activatedIndex = index
            this.$emit('func', this.activatedIndex)
        }
    }
};
</script>
