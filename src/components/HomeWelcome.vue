<template>
<div class="hello">
    <h1>{{ msg }}</h1>
    <p style="color:#02b983"> {{ msg_en }}</p>
    <p>
        以旅游度假为宗旨，以村庄野外为空间，以人文无干扰、生态无破坏、以游居和野行为特色的村野旅游形式
    </p>
    <p style="color:#42b983">
        Take tourism and vacation as the purpose, take the village field as the space, and take the form of village tourism with no human interference, no ecological damage, and characteristics of wandering and wild behavior.
    </p>
    <br>
    <p>
        你写PPT时，阿拉斯加的鳕鱼正跃出水面....
    </p>
    <p>
        你看报表时，梅里雪山的金丝猴刚好爬上树尖.....
    </p>
    <p>
        你挤进地铁时，西藏的山鹰一直盘旋云端....
    </p>
    <p>
        你在会议中吵架时，尼泊尔的背包客一起端起酒杯坐在火堆旁....
    </p>
    <p>
        总有一些穿高跟鞋走不到的路，
    </p>
    <p>
        总有一些喷着香水闻不到的空气，
    </p>
    <p>
        总有一些在写字楼里却永远遇不见的人。”
    </p>
</div>
</template>

<script>
export default {
    name: 'HomeWelcome',
    props: {
        msg: String,
        msg_en: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.hello {
    padding-bottom: 50px;
}
</style>
