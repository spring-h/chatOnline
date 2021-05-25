/*
 * @Author: your name
 * @Date: 2021-05-16 15:11:50
 * @lastEditTime: 2021-05-21 10:17 AM
 * @lastAuthor: Spring
 * @Description: In User Settings Edit
 * @FilePath: \chatOnline\chatOnline\js\chatBox.js
 */
import emoji from "./_emoji.js";

function template(data){
  console.log(data);
  let massage=``
  data.msg.forEach(item => {
    if(data.id==100){
      if(item.mine==0){
        massage+=`
        <div class="other">
          <img src="/public/img/bg.png" alt="头像">
          <div class="content">
            ${item.value}
            <img src="/public/img/msg.png" alt="头像">
            <div class="slefname">${item.name}</div>
            <div class="time">${item.time}</div>
          </div>
        </div>
        `
      }else{
        massage+=`
        <div class="mine">
          <div class="content">
            ${item.value}
            <img src="/public/img/msg.png" alt="头像">
            <div class="slefname">${item.name}</div>
            <div class="time">${item.time}</div>
          </div>
          <img src="/public/img/bg.png" alt="头像">
        </div>
        `
      }
    }else{
      if(item.mine==0){
        massage+=`
        <div class="other">
          <img src="/public/img/bg.png" alt="头像">
          <div class="content">
            ${item.value}
            <img src="/public/img/msg.png" alt="头像">
            <div class="time">${item.time}</div>
          </div>
        </div>
        `
      }else{
        massage+=`
        <div class="mine">
          <div class="content">
            ${item.value}
            <img src="/public/img/msg.png" alt="头像">
            <div class="time">${item.time}</div>
          </div>
          <img src="/public/img/bg.png" alt="头像">
        </div>
        `
      }
    }
  });


  let tem=`
      <div class="head">
        <div class="userinfor">${data.name}</div>
        <div class="close"><img src="/public/img/close.png" alt="关闭"></div>
        <div class="isonline">Online</div>
      </div>  
      <div class="head2">
        <img class="bindback" src="/public/img/back.png" alt="返回">
        <div class="userinfor">${data.name}</div>
        <img class="l" src="/public/img/laba.png" alt="静音">
        <img class="c" src="/public/img/circle.png" alt="圆">
      </div>  
      <div class="msg">
        ${massage}
      </div>
      <div class="sendmsg">
        <div class="img bindface">
          <img src="/public/img/face.png" alt="表情">
        </div>

        <input type="text" class="bindSendMsg" focus>
        <div class="send bindSend">
        发送(<span>S</span>)
        </div>
        <div class="moreface">
          ${emoji}
        </div>
      </div>
        `
        // <textarea class="bindSendMsg" name="" id="" cols="30" rows="10"></textarea>
  return tem
}



export default template