<template>
  <music-list :bgImage="bgImage" :title="title" :songs="songs" :isShow="isShow" :rank="rank"></music-list>
</template>

<script>
  import musicList from '../../common/vue/music-list.vue'
  import {mapState} from 'vuex'
  import {getSongsList} from '../../api/rank.js'
  import Song from '../../common/js/song.js'

  //歌曲假数据
  const arr = [
    //过火
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400004NeCJl44OciF.m4a?guid=1271221824&vkey=14751E6410AF49E6ABD3B3E073FC7893A00C2AD01662C1B5E69F9C04EF14DE413F30C6A6EE5CFCD5F5BB5D6021A512BD9DD3866432ACDA7D&uin=0&fromtag=38',duration:302},
    //信仰
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001UYaZC3gzHFp.m4a?guid=1271221824&vkey=DE5A39DE49DDFF88A7F8F9C39C9ADA737EEF6FAF4DCF0A23ACC4D4E81DF8C21EEF24766C3A648C572D38FD04EAF793442B2BBB86ABCE37A5&uin=0&fromtag=38',duration:256},
    //爱如潮水
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400004BKfTs3ZkOcD.m4a?guid=1271221824&vkey=91F3288377C363414A7DC1954FD478362BBEE5CBA23FAB3FC1A7D6C7D2B59F3AC1835CA8131E38141BF5E93F2F8C3D209FE5B96AA146E349&uin=0&fromtag=38',duration:274},
    //从开始到现在
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400004T2snn0i2Zqy.m4a?guid=1271221824&vkey=227579B9DB26C8877946642EFD7355D6175FB9CD901F36873FE1447DDDA2CC1ED34DD9E5901436B7D68D43C135277F9328E049A9B83323DA&uin=0&fromtag=38',duration:273},
    //别怕我伤心
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001Vh3u643qGI6.m4a?guid=1271221824&vkey=A5D15C47999FE2A55FF52B74959A1A29B4CD9C7D7F8C6C6CF7D3EED2126F3CEA5F01062E07F73DDB88BB86D5DF846B059F0A21559FF28667&uin=0&fromtag=38',duration:291},
    //爱就一个字
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003RRJJj3VVwfk.m4a?guid=1271221824&vkey=4F477E625DB37E98253ED5723B2EEEE948698C412A9499D278EDB843D9F7C553ED5D0A5616ED208A8985A21B8C3EED3D46EA5E2E63BAE382&uin=0&fromtag=38',duration:272},
    //有一点动心
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003WlUqK1HmwIe.m4a?guid=1271221824&vkey=21F06B4D299532BF6D8505BFE86B8E60206F8C8B3C167562109AE4B0888AEF8BF070E765C2DAC6A8FA3C5BE98BCFDFE07A456CCD93336781&uin=0&fromtag=38',duration:231},
    //白月光
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001PVMI522PnGG.m4a?guid=1271221824&vkey=525C3584D4212FDB9CEB3226D2E0A99D99E0A56D6715D6A8B762D54D8D72CE42E432370FBE581E41B25934DDC8752283B855B468D047EAD7&uin=0&fromtag=38',duration:267},
    //太想爱你
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C4000002QZV911OT8R.m4a?guid=1271221824&vkey=3DA531F35D4E7C3C9AFDF04DEDB95474499604F64BA295473D3A4286D0BA7D35FCF151E61FF90D1C930D26E67A6C847147B193F094A6EA24&uin=0&fromtag=38',duration:287},
    //爱你没错
    {url:'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001PjR1N4JfYds.m4a?guid=1271221824&vkey=30499379C5F036F21148CA081705680562983661475C4E32DC50B792CF076CC07A51856B5D8EB871BF9143BE691C5CB53D9FFB10F07E8A15&uin=0&fromtag=38',duration:256}
  ]

  export default {
    created(){
      console.log('当前排行榜信息',this.topList)
      this.rank = true
      //刷新返回
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      this._getSongsList()
    },
    data(){
      return {
        songs:[],
        isShow:true
      }
    },
    components:{
      musicList 
    },
    computed:{
      bgImage(){
        return this.topList.picUrl
      }, 
      title(){
        return this.topList.topTitle
      },
      ...mapState(['topList'])
    },
    methods:{
      _getSongsList(){
        getSongsList(this.topList.id).then(res => {
           console.log('排行榜歌曲列表',res)
           this.convertSongsFormat(res.songlist.slice(0,10))
        })
      },
      convertSongsFormat(list){
        list.forEach((item,index) => {
           const data = item.data
           this.songs.push(new Song({
              id:data.songid,
              mid:data.songmid,
              songname:data.songname,
              singer:data.singer,
              album:data.albumname,
              duration:arr[index].duration,
              image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
              url:arr[index].url
           }))
        })
        this.isShow = false
      }
    }
  }
</script>