<template>
  <div class="singer-detail">
     <musicList :bgImage="singerBgImg" :title="singerName" :songs="songs" :isShow="isShow"></musicList>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {getSingerDetail} from '../../api/singer.js';
  import Song from '../../common/js/song.js';
  import musicList from '../../common/vue/music-list.vue';
  export default {
    created(){
      //刷新时,此时vuex中数据没了,因此要返回歌手页
      if (!this.currentSinger.mid) {
        this.$router.push({path:'/singer'});
      }
      this.getDetail(this.currentSinger.mid);
    },
    data(){
      return {
        songs:[],//所有歌曲的信息
        temp:[],//临时数组
        isShow:true
      }
    },
    methods:{
      async getDetail(id){
        const detail = await getSingerDetail(id)
        /*
        下面每首歌的播放路径(url)目前只能写死了(只播固定10首),因为需要vkey,而vkey时时在变化,自己抓包调接口(huangyi老师的)依然拿不到数据
        for (var index = 0; index < detail.data.list.length; index++) {
           let data = detail.data.list[index].musicData
           this.temp.push(data.songmid)
        }
        const res = await getVkey(this.temp) 
        */
        const songArr = [
          //陪你去流浪
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400002zfxmN2e1vLQ.m4a?guid=4967173822&vkey=417D034490289334023C27A5A55C3C92B456FA62CEA7ABBEE0D1018B20FBFEEF3426C2577A7C82169164AE40122EE06A71444EE79DDA2B01&uin=0&fromtag=38',duration:274},
          //演员
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003mBrF72dILfK.m4a?guid=4967173822&vkey=ADA0F505C2CE86F5331D4496A5AA3DACD4E9566053576C3A9DA77494862143FFA228A75A1121E8852EA1B7AE95D6A1910CA7D1D43A0F5CA5&uin=0&fromtag=38',duration:261},
          //配合
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400004bL6iq48DjuG.m4a?guid=4967173822&vkey=936B135CD4E63C599B627B79269CAD5CA051A6705F65D6FDB7079156B67E12991D90C662770702B6F947317BDDA73AC3364863BF5BD5B0DB&uin=0&fromtag=38',duration:212},
          //聊表心意
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400000J5T6B1GySI5.m4a?guid=4967173822&vkey=3D2774FC4AB0F4E8CC8EB990D6A1850B1BF733490C255BC7D953B3F242A41819EFC23DEFD2E711302817F5D8306DBEBB3211C3E04E20FB10&uin=0&fromtag=38',duration:317},
          //我好像在哪见过你
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001X66lF1M9eL9.m4a?guid=4967173822&vkey=9A09BB5D42F223D4638482B0F3C514A8D122FB07ABB3A0769F13F98607FD83278B479E5F7962B64542B78DDCE05E28A4E288A54BB76A15C9&uin=0&fromtag=38',duration:279},
          //刚刚好
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400000PcSos12VDrz.m4a?guid=4967173822&vkey=8870F33E678FBCB4D6D0E1A3977B88718D6A215F8BA5E509936A3C1D8129CF836200166DA98C9AD34AABF817D80C1858CBD61F08F35CBA33&uin=0&fromtag=38',duration:250},
          //意外
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001F8BTd1TZYWZ.m4a?guid=4967173822&vkey=A47A776A074094442481110299CA02541A647616AC8B346D5B0063D21A6D34C0EA8DD10A95B940185939C53437B24ADABBAFDD5788C6FC3C&uin=0&fromtag=38',duration:287},
          //绅士
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C4000029cBk90JB3e9.m4a?guid=4967173822&vkey=CC146AF0319271AC38BFC68C73DEFF2EC1ADD66E5CC14F2D671CC316B93C006A2912DF6097B88424B3F364F4734819EC32D249CD1A03AC59&uin=0&fromtag=38',duration:290},
          //你还要我怎样
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003odRSi1odVpq.m4a?guid=4967173822&vkey=443306C6E43E7CE834EE0DDE0399A2CDDBD5C7858933E953CFD24152ED8088B1F4637FE340B000914F94343325FF3B78A2CE154EA0693556&uin=0&fromtag=38',duration:310},
          //丑八怪
          {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400002EsKmq1Mtjpi.m4a?guid=4967173822&vkey=EEBB3BEB85CB57E2F4BEFD3767F834C99EDB6838B102B15C7E79E77B0E93233914792E8B0E4161ED2C4FB2956A4BA888AC59D3577E42085A&uin=0&fromtag=38',duration:248}
        ]
        if (detail.data.list.length) {
           for (let index = 0; index < 10; index++) {
             let data = detail.data.list[index].musicData
             this.songs.push(new Song({
                id:data.songid,
                mid:data.songmid,
                songname:data.songname,
                singer:data.singer,
                album:data.albumname,
                duration:songArr[index].duration,
                image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
                url:songArr[index].url
             }))
           }
        }
        this.isShow = false
      }
    },
    computed:{
      singerName(){
        return this.currentSinger.name;
      },
      singerBgImg(){
        return this.currentSinger.avatar;
      },
      ...mapState(['currentSinger'])
    },
    components:{
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .singer-detail
    position: absolute
    top: -88px
    left: 0
    z-index: 100
    background: $color-background
    width: 100%
    height: calc(100% + 88px)
</style>

