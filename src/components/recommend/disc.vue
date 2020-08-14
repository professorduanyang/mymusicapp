<template>
  <music-list :bgImage="bgImage" :title="title" :songs="songs" :isShow="isShow"></music-list>
</template>

<script>
  import musicList from '../../common/vue/music-list.vue'
  import {mapState} from 'vuex'
  import {getSongList} from '../../api/recommend.js'
  import Song from '../../common/js/song.js'

  //歌曲播放地址,时长假数据
  const arr = [
    //黄昏
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400002QdOiH1n3XpJ.m4a?guid=2200175159&vkey=FE3ACB16DAB37D26962A5BB020EC8F15DD05FA6EBAAE79E25DA7F221DD16783AAE88A320A1122867487758DE774A8AEDE1AAEFE3E652D1E8&uin=940&fromtag=66',duration:344},
    //关不上的窗
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400001nLrvS0yuGVd.m4a?guid=2200175159&vkey=51B7CB8BA15D1C0B0C6E56A1E679A1693E4219951E30977577DCE8DF15F1A2B73897A6EFEF406CB3260A1DD4DC4F8E3D475F315BD30F4534&uin=940&fromtag=66',duration:293},
    //寂寞沙洲冷
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C4000029KJjT3G7OTd.m4a?guid=2200175159&vkey=11E1172E24A66060E0C5536D7C03E7E0FCB83B6AF73077C7F2024FDFF72C67334F31B620481B592703E81CE792BA8B33F53FA5247988BF57&uin=940&fromtag=66',duration:274},
    //青花
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400004NExsW24aHPx.m4a?guid=2200175159&vkey=3B68E51514C87D43CD6549825108122ED5C285ADB1A65B8D977FC969FBEF717F200B2664DC36A5681E51BC1BE0B64292B228F6DA944E5C56&uin=940&fromtag=66',duration:297},
    //冬天的秘密
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400000tuyDg2LzNll.m4a?guid=2200175159&vkey=9DCF2CF32EC62DEA7E3C1632DBB4B9D83612EC8039D5A71868836D8DCA10766EF76ECDE87EAA17F93FF6E4AA9CDF0BDB96A8680C9D8BFADC&uin=940&fromtag=66',duration:272},
    //我的心太乱
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400000hgNMB0A5Yd5.m4a?guid=2200175159&vkey=FA9500EADEB0B7404D28A6994DFC1D07D648DC1FF9DFDEC9758C6E6304E636BA8495484B7912344AC3D690003C5F8880C533A621D7D07A9B&uin=940&fromtag=66',duration:293},
    //蓝色土耳其
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C4000026lDIt1044d0.m4a?guid=2200175159&vkey=AE5D0F287408B108490A90BE0918593AA1B37D627088E728BAD230EA5B52D8432BA615F83E8696863D2D06F30E57FEF9D2082B3001FAF86D&uin=940&fromtag=66',duration:283},
    //男人海洋
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400002Kp6Ka3bg7Vj.m4a?guid=2200175159&vkey=F58F34F56C1B9A8A0C3BCED6B964E8E55F1BB36877FB5C317304546AE3419E0C6D4693542850EA67BA67E52CD5D07C35384199ABAF74F8C6&uin=940&fromtag=66',duration:238},
    //弱水三千
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400000E9X6w1IUSZq.m4a?guid=2200175159&vkey=CCE0BD473270813A76D945BAADBBF1EC13A0659756F019A4DFEDE1A585D321E540340D60A1C4B4192C1DBC8C80109BB24CA0984F52FC0839&uin=940&fromtag=66',duration:320},
    //记事本
    {url:'http://112.17.55.15/amobile.music.tc.qq.com/C400001qWxVM28oScp.m4a?guid=2200175159&vkey=0A00974D1C77BD69E693A314F08EE588A8705F449E8849DDC67517CA2FDA9AC9CDBB3401B553434F89B6F36C4902B36EAAD829834DF0B8C5&uin=940&fromtag=66',duration:261}
  ]

  export default {
    created(){
       console.log('当前disc',this.currentDisc)
       //刷新时vuex中disc没有了,此时跳回recommend
       if (!this.currentDisc.dissid) {
          this.$router.push({
            path:'/recommend'
          })
       }
       this._getSongList()
    },
    data(){
       return {
         songs:[],
         isShow:true,
       }
    },
    components:{
       musicList
    },
    computed:{
       bgImage(){
          return this.currentDisc.imgurl
       },
       title(){
          return this.currentDisc.dissname
       },
       dissid(){
          return this.currentDisc.dissid
       },
       ...mapState(['currentDisc'])
    },
    methods:{
       _getSongList(){
          getSongList(this.dissid).then(result => {
              console.log('获取结果',result.data)
              this.from = 'disc'
              //截取10条
              result.data.cdlist[0].songlist.slice(0,10).forEach((song,index) => {
                  this.songs.push(new Song({
                    id:song.id,
                    mid:song.mid,
                    songname:song.name,
                    singer:song.singer,
                    album:song.album.name,
                    duration:arr[index].duration,
                    image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg?max_age=2592000`,
                    url:arr[index].url
                  }))
              })
              this.isShow = false
          })
       }
    }
  }
</script>
