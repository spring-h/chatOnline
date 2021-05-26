/*
 * @author: Spring
 * @create: 2021-05-14 14:39 PM
 * @license: MIT
 * @lastAuthor: Spring
 * @lastEditTime: 2021-05-25 20:05 PM
 * @desc: 登录界面
 */
import index from "./_index.js"
import friendList from "./_friendList.js"
import chatBox from "./_chatBox.js"

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

//音频
const mp3=new Audio('/public/audio/reminding.mp3')
//socket.io
const socket = io()
//判断当前页面的位置
let positionNow = "index"
//在线人
let onlineArr = []
let mineImg=""

/**
* 
* @param {*} value 
*/
//TODO 发送username
function sendUsername(value) {
  socket.emit("joined", value)
}

//TODO 加入聊天室
socket.on('joined',data=>{
  if(data.socket_id){
    let index=data.onlineArr.findIndex(item=>item.socket_id==data.socket_id)
    if(index>10){
      mineImg=headArr[index.slice(-1)]
    }else{
      mineImg=headArr[index]
    }
    getFriend(data.onlineArr)
  }else{
    getFriend(data)
  }
})

//TODO 退出聊天室
socket.on('leaved',data=>{
  let index=onlineArr.findIndex(item=>item.socket_id==data)
  if(index!=-1){
    onlineArr.splice(index,1)
  }
  renderFriendList()
})

//TODO 公共聊天室
socket.on('input-text',data=>{
  let index=onlineArr.findIndex(item=>item.socket_id==data.socket_id)
  if(index>10){
    index=index.slice(-1)
  }
  console.log(index);
  data.headImg=onlineArr[index].headImg
  onlineArr[0].msg.push(data)
  if(positionNow=="chatroom"){
    onlineArr[0].msg[onlineArr[0].msg.length-1].read=true
    renderChatRoom(0)
  }else{
    switchAudio()
  }
  if(data.mine==1){
    onlineArr[0].msg[onlineArr[0].msg.length-1].read=true
  }
  renderFriendList()
})

//TODO 私聊
socket.on("obyo",data=>{
  let index=onlineArr.findIndex(item=>item.socket_id==data.socket_id)
  if(data.mine==0){
    data.headImg=onlineArr[index].headImg
  }else{
    data.headImg=mineImg
  }
  onlineArr[index].msg.push(data)
  if(positionNow==data.socket_id){
    onlineArr[index].msg[onlineArr[index].msg.length-1].read=true
    renderChatRoom(index)
  }else{
    switchAudio()
  }
  if(data.mine==1){
    onlineArr[index].msg[onlineArr[index].msg.length-1].read=true
  }
  renderFriendList()
})

//渲染首页
changeBody(index)
focus(Tool('.bindusername'))

// 窗口宽度
let width = window.innerWidth
window.onresize = function (event) {
  width = window.innerWidth
}

//TODO enter事件 跳转到聊天室和发送消息
document.onkeydown = function (e) {
  if (e.keyCode != "13") {
    return
  }
  if(positionNow=="index"){
    goFriendList()
  }else if(positionNow=="chatroom"){
    if(sendMsg()==""){
      return
    }
    socket.emit('input-text',sendMsg())
  }else if(positionNow=="friendList"){
    
  }else{
    if(sendMsg()==""){
      return
    }
    socket.emit('obyo',{value:sendMsg(),id:positionNow})
  }
}

//TODO 音频开启
function switchAudio(){
  let voice=Tool('.bindvoice')
  console.log(voice);
  voice.style.display="none"
  mp3.play()
  // setTimeout(() => {
  //   voice.style.opacity="1"
  // }, 500);
}

//TODO 进入聊天室
function goFriendList(){

  let tem = ""
  const bindusername = Tool(".bindusername").value
  // const bindnumber = Tool(".bindnumber").value
  if(bindusername.length>6){
    alert("字符不得大于6个")
    return
  }
  if (width > 1024) {
    tem = `
    <div class="chatroom">
    <div class="online">
    ${friendList({onlineArr,mineImg})}
    </div>
    <div class="interface">
    </div>
    </div>
    `
  } else {
    tem = `
    <div class="chatroom">
    <div class="online">
    ${friendList({onlineArr,mineImg})}
    </div>
    </div>
    `
  }
  changeBody(tem)
  sendUsername(bindusername)
  bindEvent()
  positionNow="friendlist"
}

//TODO 用户上线时 更新列表
function getFriend(data){
  try {
    let onlinenode=document.querySelector('.online')
    onlineArr=data
    console.log(data);
    onlineArr.forEach((item,index)=>{
      console.log(index);
      item.headImg=headArr[index]
    })
    console.log(onlineArr);
    onlinenode.innerHTML=friendList({onlineArr,mineImg})
    bindEvent()
  } catch (error) {
    
  }
}

//TODO 获取输入框消息
function sendMsg(){
  let msg=Tool('.bindSendMsg')
  return msg.value
}

//TODO 绑定事件  friendList
function bindEvent() {
  clickpeople()
  clickSearch()
}

//TODO 绑定点击好友
function clickpeople(){
  Tool(".bindOnlineUser").onclick = clickpeopleevent
}

//TODO 点击好友
function clickpeopleevent(e){
  let node = e.target
  if (node.className != "user") {
    node = node.parentNode
  }
  if (node.className != "user") {
    node = node.parentNode
  }
  let only=node.getAttribute('only')
  let index=onlineArr.findIndex(item=>item.socket_id==only)
  if(only!=100){
    onlineArr[index].msg[0].headImg=mineImg
  }
  onlineArr[index].msg.forEach(item=>{
    item.read=true
  })
  if(width>1024){
    renderChatRoom(index)
  }else{
    let tem = `
    <div class="chatroom">
    <div class="interface">
    ${chatBox(onlineArr[index])}
    </div>
    </div>
    `
    changeBody(tem)
    back()
    let send=Tool('.bindSend')
    send.onclick=clickSend
  }
  if(only!=100){
    positionNow=only
  }else{
    positionNow="chatroom"
  }
  renderFriendList()
  clickFace()
  clickSwichFace()
  focus(Tool('.bindSendMsg'))
}

//TODO 绑定输入搜索内容 
function searchFriend(){
  let search=Tool('.bindsearchfriend')
  search.oninput=searchFriendEvent
}

//TODO 搜索框 input事件
function searchFriendEvent(e){
  
  let list=Tool('.bindlist')
  let tem=``
  let peoplenum=0
  if(e.target.value.trim()==""){
    list.style.dispaly='none'
    return
  }
  onlineArr.forEach((item,index)=>{
    let i=item.name.indexOf(e.target.value.trim())
    if(i!=-1){
      peoplenum++
       tem +=`
      <div class="list-li" only="${onlineArr[index].socket_id}">
      <img src="/public/img/circle.png" alt="头像">
      <div class="usern">${onlineArr[index].name}</div>
      <div class="message">${onlineArr[index].msg[0].value}</div>
      </div>`
    }
  })
  console.log(peoplenum);
  if(peoplenum>0){
    list.style.display='block'
  }else{
    list.style.dispaly='none'
  }
  list.innerHTML=tem
  list.onclick=clickSearchResult
}

//TODO 搜索结果 点击用户
function clickSearchResult(e){
  let li=ToolAll('.list-li')
  let node = e.target
    if (node.className != "list-li") {
      node = node.parentNode
    }
    let only=node.getAttribute('only')
    let index=onlineArr.findIndex(item=>item.socket_id==only)
    if(only!=100){
      onlineArr[index].msg[0].headImg=mineImg
    }
    onlineArr[index].msg.forEach(item=>{
      item.read=true
    })
    if(width>1024){
      renderChatRoom(index)
    }else{
      let tem = `
      <div class="chatroom">
      <div class="interface">
      ${chatBox(onlineArr[index])}
      </div>
      </div>
      `
      changeBody(tem)
      back()
      let send=Tool('.bindSend')
      send.onclick=clickSend
    }
    if(only!=100){
      positionNow=only
    }else{
      positionNow="chatroom"
    }
    renderFriendList()
    clickFace()
    clickSwichFace()
    let head=Tool('.bindheader')
    let headsearch=Tool('.bindheadersearch')
    head.style.display='flex'
    headsearch.style.display='none'
}

//TODO 点击搜索
function clickSearch(){
  let head=Tool('.bindheader')
  let headsearch=Tool('.bindheadersearch')
  let list=Tool('.bindlist')
  Tool('.bindsearch').onclick=function(){
    head.style.display='none'
    headsearch.style.display='flex'
    list.style.display='none'
    focus(Tool('.bindsearchfriend'))
  }
  clickclosesearch()
  searchFriend()
}

//TODO 搜索 点击关闭
function clickclosesearch(){
  let head=Tool('.bindheader')
  let headsearch=Tool('.bindheadersearch')
  Tool('.bindclose').onclick=function(){
    head.style.display='flex'
    headsearch.style.display='none'
  }
}

//TODO 移动端点击返回
function back(){
  let back=Tool('.bindback')
  back.onclick=function(){
    let tem = `
    <div class="chatroom">
    <div class="online">
    ${friendList({onlineArr,mineImg})}
    </div>
    </div>
    `
    changeBody(tem)
    bindEvent()
    positionNow="friendlist"
  }
}

//TODO 渲染聊天框
function renderChatRoom(index){
  let oldnode=Tool('.interface')
  if(index!=0){
    positionNow=onlineArr[index].socket_id
  }
  oldnode.innerHTML=chatBox(onlineArr[index])
  let msgscroll=Tool('.msg')
  msgscroll.scrollTo(0, msgscroll.scrollHeight)
  //发送键绑定事件
  let send=Tool('.bindSend')
  send.onclick=clickSend
  clickFace()
  clickSwichFace()
  focus(Tool('.bindSendMsg'))
  if(width<1024)back()
}

//TODO 点击表情开关
function clickFace(){
  let face=Tool('.bindface')
  face.onclick=function(){
    let swichface=Tool('.moreface')
    if(swichface.style.display=="none"){
      swichface.style.display="flex"
    }else{
      swichface.style.display="none"
    }
  }
}

//TODO 点击表情
function clickSwichFace(){
  let swichface=Tool('.moreface')
  let input=Tool('.bindSendMsg')
  swichface.onclick=function(e){
    console.log(e.target);
    if(e.target.className=="oneface"){
      console.log(input);
      input.value+=e.target.innerHTML
      focus(input)
    }
  }
}

/**
* 点击发送
*/
//TODO 点击发送
function clickSend(){
  if(sendMsg()==""){
    return
  }
  if(positionNow=="chatroom"){
    socket.emit('input-text',sendMsg())
  }else{
    socket.emit('obyo',{value:sendMsg(),id:positionNow})
  }
}

//TODO 渲染好友列表
function renderFriendList(){
  try {
    let oldnode=Tool('.online')
    oldnode.innerHTML=friendList({onlineArr,mineImg})
    bindEvent()
  } catch (error) {
    // console.log(error);
  }
}


//TODO 聚焦
function focus(node){
  node.focus()
}

/**
 *
 * @param {*} t
 * @returns
 */
//TODO 选择一个元素
function Tool(t) {
  return document.querySelector(t)
}

//TODO 选择多个元素
/**
 *
 * @param {*} t
 * @returns
 */
function ToolAll(t) {
  return document.querySelectorAll(t)
}

//TODO 修改body中的内容
/**
 *
 * @param {*} string
 */
function changeBody(string) {
  document.body.innerHTML = string
}
