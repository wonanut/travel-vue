<template>
<el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="item in images" :key="item.url">
        <img class="banner-img" :src="item.url" alt="无法加载图片" />
    </el-carousel-item>
</el-carousel>
</template>

<script>
export default {
    name: 'HomeCarousel',
    data() {
        return {
            images: [{
                    url: require('../assets/banner1.jpeg')
                },
                {
                    url: require('../assets/banner2.jpeg')
                },
                {
                    url: require('../assets/banner3.jpeg')
                },
                {
                    url: require('../assets/banner4.jpeg')
                },
                {
                    url: require('../assets/banner5.jpeg')
                },
                {
                    url: require('../assets/banner6.jpeg')
                }
            ]
        }
    }
}
</script>

<style>
.banner-img {
    width: 100%;
    position: relative;
    bottom: 50px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 400px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>
