let http = require('http');
http.createServer((req,res)=>{
  if(req,method == "POST" && req.url == '/webhook'){
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ok:true}));
  }else{  
    res.end('404')
  }
})

http.Server.listen(4000,()=>{
  console.log('webhoook服务在4000端口启动')
})