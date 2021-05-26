/*
 * @Author: your name
 * @Date: 2021-05-18 21:49:59
 * @lastEditTime: 2021-05-25 19:52 PM
 * @lastAuthor: Spring
 * @Description: In User Settings Edit
 * @FilePath: \server\app.js
 */
/*
 * @author: Spring
 * @create: 2021-05-14 11:11 AM
 * @license: MIT
 * @lastAuthor: Spring
 * @lastEditTime: 2021-05-18 18:47 PM
 * @desc:
 */
const fastify = require("fastify")({ logger: true });
const io = require("socket.io")(fastify.server);

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3006;
const public_prefix = "./public";
// const public_prefix = '../chatOnline'

const crypto = require("crypto");
const path = require("path");
const randomID = () => crypto.randomBytes(8).toString("hex");

let onlineArr = [
  {name:'无限活力聊天室',id:100,socket_id:100,msg:[]}
];

let headArr=[
  "/public/img/t1.jpg",
  "/public/img/t2.jpg",
  "/public/img/t3.jpg",
  "/public/img/t4.jpg",
  "/public/img/t5.jpg",
  "/public/img/t6.jpg",
  "/public/img/t7.jpg",
  "/public/img/t8.jpg",
  "/public/img/t9.jpg",
  "/public/img/t0.jpg",
]

fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
});

//配置静态资源
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

//路由
fastify.get("/", async (req, res) => {
  return res.view(`${public_prefix}/index.html`);
});

//IO 监听用户连接
io.on("connection", (socket) => {
  let id = randomID();
  socket.on("disconnect", () => {
    let index=onlineArr.findIndex(item=>item.socket_id==socket.id)
    if(index!=-1){
      onlineArr.splice(index,1)
    }
    socket.broadcast.emit("leaved",socket.id)
  });
  //消息类型
  socket.on("chat-mess", (msg) => {
    socket.broadcast.emit("chat-mess", msg);
  });
  //加入
  socket.on("joined", (name) => {
    let now=new Date().toLocaleTimeString()
    let time=now.substr(2).split(':').slice(0,2).join(':')
    let value="我上线了"
    let socket_id=socket.id
    let obj = {
      name,
      id,
      socket_id,
      msg:[{time,value,read:false}]
    };
    onlineArr.push(obj);
    socket.emit("joined", {onlineArr,socket_id:socket.id,name});
    socket.broadcast.emit("joined",onlineArr)
  });
  //离线
  socket.on("leaved", (name) => {
    //发送给自己以外的人
    socket.broadcast.emit("leaved", onlineArr);
  });
  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  });
  socket.on("stoptyping", (name) => {
    socket.broadcast.emit("stoptyping", name);
  });
  //群聊
  socket.on("input-text",value=>{
    let index=onlineArr.findIndex(item=>item.id==id)
    let name=onlineArr[index].name
    let now=new Date().toLocaleString()
    let socket_id=socket.id
    let reg = /[\u4e00-\u9fa5]/g;   
        time=now.replace(reg, "");
    
    socket.broadcast.emit("input-text",{id,socket_id,value,name,time,mine:0,read:false})
    socket.emit("input-text",{id,socket_id,value,name,time,mine:1,read:true})
  })
  //私聊
  socket.on("obyo",data=>{
    let index = onlineArr.findIndex(item=>item.socket_id==data.id)
    let name=onlineArr[index].name
    let value=data.value
    let now=new Date().toLocaleString()
    let reg = /[\u4e00-\u9fa5]/g;   
        time=now.replace(reg, "");
    if(data.id==socket.id){
      socket.emit('obyo',{value,socket_id:data.id,name,time,mine:1,read:true});
    }else{
      io.to(data.id).emit('obyo',{value,socket_id:socket.id,name,time,mine:0,read:false});
      socket.emit('obyo',{value,socket_id:data.id,name,time,mine:1,read:true});
    }
    
  })
});

fastify.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
