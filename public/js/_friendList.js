/*
 * @Author: your name
 * @Date: 2021-05-16 15:09:11
 * @lastEditTime: 2021-05-25 20:15 PM
 * @lastAuthor: Spring
 * @Description: In User Settings Edit
 * @FilePath: \chatOnline\chatOnline\js\friendList.js
 */



function tem(data){
  // console.log(data);
  let user=``
  data.onlineArr.forEach(item => {
    if(item.msg.length>0){
      let content=item.msg[item.msg.length-1].value
      let time=item.msg[item.msg.length-1].time
      let reg=/\s+/g
      let infornum=0
      let circle=true
      if(reg.test(time)){
        time=time.split(' ')[1].split(':')
        time=`${time[0]}:${time[1]}`
      }
      item.msg.forEach(it=>{
        if(!it.read)infornum++
      })
      user+=`
      <div class="user" only="${item.socket_id}">
        <div class="img">
          <img src="${item.headImg}" alt="头像">
          <div class="circle" style="display: ${infornum==0?'none':'block'};"></div>
        </div>
        <div class="name">${item.name}</div>
        <div class="time">${time}</div> 
        <div class="content">${content}</div>
        <div class="infornum" style="display:${infornum==0?'none':'flex'}" >${infornum}</div>
      </div>
      `
    }else{
      user+=`
      <div class="user" only="${item.id}">
        <div class="img">
          <img src="${item.headImg}" alt="头像">
          <div class="circle" style="display: none;"></div>
        </div>
        <div class="name">${item.name}</div>
        <div class="time" style="display: none;"></div> 
        <div class="content" style="display: none;"></div>
        <div class="infornum" style="display: none;"></div>
      </div>
      `
    }
    
  });
  
  let template=`
   <div class="header bindheader">
     <img class="titleimg" src="${data.mineImg}" alt="头像">
     <img class="s bindsearch" src="/public/img/search.svg" alt="搜索">
     <img class="l bindvoice" src="/public/img/laba.svg" alt="静音">
     <img class="c" src="/public/img/circle.svg" alt="圆">
   </div>
   <div class="headersearch bindheadersearch">
      <input class="bindsearchfriend" type="text" focus>
     <div class="iconbox">
       <img class="c bindclose" src="/public/img/close_small.svg" alt="关闭">
     </div>
     <div class="list bindlist">
      
     </div>
   </div>
   <div class="onlineUser bindOnlineUser">
     ${user}
   </div>
   `
  return template
}


 export default tem