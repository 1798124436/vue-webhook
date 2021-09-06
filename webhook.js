const crypto = require('crypto');
let http = require('http');
let SECRET = '123456'
let {spawn} = require('child_process')

function sign(body){
  return `sha1=`+ crypto.createHmac('sha1',SECRET).update(body).disgest('hex')
}

let server = http.createServer((req,res)=>{
  console.log(req.method,req.url)
  if(req.method == "POST" && req.url == '/webhook'){
    let buffers = [];
    req.on('data',(buffer)=>{
      buffers.push(buffer)
    })
    res.on('end',(buffer)=>{
      let body = Buffer.concat(buffers)
      let event = req.header['x-gitHub-event'] //event=push
      //github 请求过来的时候，要传递请求体body另外还会传一个签名，需要验证签名
      let signature = req.headers['x-hub-Signature']
      if(signature !== sign(body)){
        return res.end('Not Allowed')
      }
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({ok:true}));
      if(event == 'push'){
        let payload =JSON.parse(body)
        let child = spawn('sh',[`./${payload.reposity.name}.sh`])
        let buffers = [];
        child.stdout.on('data',(bufffer)=>{
          buffers.push(buffer);
        })
        child.stdout.on('end',(bufffer)=>{
          let log = Buffer.concat(buffers);
          console.log(log)

        })
      }
    })
    
  }else{  
    res.end('404')
  }
})

server.listen(4000,()=>{
  console.log('webhoook服务在4000端口启动')
})