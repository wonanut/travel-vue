<template>
<div class="home">
    <img alt="Vue logo" src="../assets/logo.png" class="home-logo">
    <HomeCarousel cards="visited" />
    <HomeWelcome msg="欢迎访问搬木乡村旅游站点" msg_en="Welcome to visit Ban Mu Manor" />
</div>
</template>

<script>
// @ is an alias to /src
import HomeWelcome from '@/components/HomeWelcome.vue'
import HomeCarousel from '@/components/HomeCarousel.vue'

export default {
    name: 'Home',
    components: {
        HomeCarousel,
        HomeWelcome
    }
}
</script>

<style>
body {
    padding: 0;
    margin: 0;
}

html,
body,
#app {
    text-align: left;
}

.home-logo {
    padding-top: 40px;
    padding-bottom: 40px;
    height: 80px;
}

.home {
    text-align: center;
}
</style>
