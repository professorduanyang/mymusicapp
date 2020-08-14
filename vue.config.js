var axios = require('axios')
var fs = require('fs')
var qs = require('querystring')

//读取文件的方法
function getData(url,callback){
  fs.readFile(url,(error,data) => {
     if (error) {
        throw error
     }else {
        callback(JSON.parse(data.toString()))
     }
  })
}

module.exports = {
  publicPath: './',
  lintOnSave:false,
  configureWebpack:{
    devServer:{
      before(app){
        //登录
        app.get('/api/login',(request,response) => {
           var {username,password} = request.query
           getData('./src/assets/json/users.json',users => {
              var hasUser = []
              hasUser = users.filter(user => {
                 return user.username === username && user.password === password
              })
              response.json(hasUser.length ? {
                isLogin: true,
                token: username + '-' + new Date().getTime()
              } : {
                isLogin: false
              })
           })
        })
        //处理请求热门歌曲
        app.get('/api/getHotSongs',(request,response) => {
           axios.get(
             'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
             {
               params:request.query,
               headers:{
                 referer:'https://c.y.qq.com/',
                 host:'c.y.qq.com'
               }
             }
           ).then((res) => {
             response.json(res.data);
           }).catch((err) => {
             throw err;
           })
        })
        //获取播放器的vkey地址
        app.post('/api/getVkey',(request,response) => {
          let data = ''
          request.on('data',function(chunk){
            data += chunk
          })
          request.on('end',() => {
             data = qs.parse(data)
             axios.post('http://ustbhuangyi.com/music/api/getPurlUrl',data,{
                headers:{
                  host:'ustbhuangyi.com',
                  origin:'http://ustbhuangyi.com',
                  referer:'http://ustbhuangyi.com/music/'
                }
             }).then((res) => {
               response.json(res.data);
             }).catch((err) => {
               throw err;
             })
          })
        })
        //获取歌词
        app.get('/api/lyric',(request,response) => {
          axios.get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',{
            params:request.query,
            headers:{
              referer:'https://c.y.qq.com/',
              host:'c.y.qq.com'
            }
          }).then((res) => {
            response.json(res.data)
          }).catch((err) => {
            throw err
          })
        })
        //获取歌曲
        app.get('/api/getSongs',(request,response) => {
          const disstid = parseInt(request.query.disstid)
          axios.get('https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',{
            params:request.query,
            headers:{
              origin: 'https://y.qq.com',
              referer: `https://y.qq.com/n/yqq/playlist/${disstid}.html`
            }
          }).then((res) => {
            response.json(res.data)
          }).catch((err) => {
            throw err
          })
        })
        //获取热搜
        app.get('/api/search',(request,response) => {
          axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp',{
            params:request.query,
            headers:{
              origin: 'https://y.qq.com',
              referer:'https://c.y.qq.com/',
              host:'c.y.qq.com',
            }
          }).then((res) => {
            response.json(res.data)
          }).catch((err) => {
            throw err
          })
        })
      }
    }
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    
  }
}
