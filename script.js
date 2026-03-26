// --- Popup toggle and hide on click outside ---
const heartIcon=document.getElementById('heartPopup');
const ytIcon=document.getElementById('ytPopupIcon');
const resetIcon=document.getElementById('resetPopup');
const heartInputs=document.getElementById('heartInputs');
const ytPopup=document.getElementById('ytPopup');

function hideAllPopups(){
  heartInputs.style.display='none';
  ytPopup.style.display='none';
}

heartIcon.addEventListener('click',(e)=>{
  e.stopPropagation();
  heartInputs.style.display=(heartInputs.style.display==='flex')?'none':'flex';
  heartInputs.style.flexDirection='row';
  const rect=heartIcon.getBoundingClientRect();
  heartInputs.style.top=(rect.bottom+5)+'px';
  heartInputs.style.left=(rect.left)+'px';
});

ytIcon.addEventListener('click',(e)=>{
  e.stopPropagation();
  ytPopup.style.display=(ytPopup.style.display==='flex')?'none':'flex';
  const rect=ytIcon.getBoundingClientRect();
  ytPopup.style.top=(rect.bottom+5)+'px';
  ytPopup.style.left=(rect.left)+'px';
});

resetIcon.addEventListener('click',(e)=>{
  e.stopPropagation();
  totalSeconds=0; updateCountdown(); clearInterval(countdownInterval);
});

// click bên ngoài popup mới ẩn popup
document.addEventListener('click',(e)=>{
  if(!heartInputs.contains(e.target) && !ytPopup.contains(e.target) &&
     !heartIcon.contains(e.target) && !ytIcon.contains(e.target) && !resetIcon.contains(e.target)){
    hideAllPopups();
  }
});

// --- Countdown Flip Clock ---
let countdownInterval,totalSeconds=0;
const hoursFlip=document.getElementById('hoursFlip');
const minutesFlip=document.getElementById('minutesFlip');
const secondsFlip=document.getElementById('secondsFlip');

function updateCountdown(){
  let hrs=Math.floor(totalSeconds/3600);
  let mins=Math.floor((totalSeconds%3600)/60);
  let secs=totalSeconds%60;
  hoursFlip.textContent=hrs<10?'0'+hrs:hrs;
  minutesFlip.textContent=mins<10?'0'+mins:mins;
  secondsFlip.textContent=secs<10?'0'+secs:secs;
  if(totalSeconds<=10 && totalSeconds>0){
    hoursFlip.style.color='red';
    minutesFlip.style.color='red';
    secondsFlip.style.color='red';
  } else {
    hoursFlip.style.color='white';
    minutesFlip.style.color='white';
    secondsFlip.style.color='white';
  }
}

function startCountdown(){
  heartInputs.style.display='none';
  let h=parseInt(document.getElementById('hours').value)||0;
  let m=parseInt(document.getElementById('minutes').value)||0;
  let s=parseInt(document.getElementById('seconds').value)||0;
  totalSeconds=h*3600+m*60+s;
  updateCountdown();
  clearInterval(countdownInterval);
  countdownInterval=setInterval(()=>{
    if(totalSeconds<=0){clearInterval(countdownInterval); launchFireworksLoop(); return;}
    totalSeconds--; updateCountdown();
  },1000);
}

// Nhấn Enter để start
heartInputs.addEventListener('keydown',(e)=>{
  if(e.key==='Enter'){startCountdown();}
});

// --- Fireworks ---
const canvas=document.getElementById('fireworks');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let fireworksInterval;
function drawFireworks(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<50;i++){
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*3+2,0,2*Math.PI);
    ctx.fillStyle=`hsl(${Math.random()*360},100%,80%)`;
    ctx.fill();
  }
}
function launchFireworksLoop(){
  fireworksInterval=setInterval(drawFireworks,100);
}
document.body.addEventListener('click',()=>{clearInterval(fireworksInterval); ctx.clearRect(0,0,canvas.width,canvas.height);});

// --- YouTube Player ---
let ytPlayer, playerReady=false, loopMode=false;
function onYouTubeIframeAPIReady(){}

function getVideoId(url){if(!url) return null; const reg=/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/; const match=url.match(reg); return (match && match[2].length==11)?match[2]:null;}

const ytLinkInput=document.getElementById('ytLink');
const loadBtn=document.getElementById('loadBtn');
const playBtn=document.getElementById('playBtn');
const pauseBtn=document.getElementById('pauseBtn');
const loopBtn=document.getElementById('loopBtn');
const progressBar=document.querySelector('.progressBar');
const progress=document.querySelector('.progress');
const ytContainer=document.getElementById('ytContainer');

loadBtn.addEventListener('click',()=>{
  const id=getVideoId(ytLinkInput.value);
  if(!id) return alert('Link YouTube không hợp lệ');
  if(ytPlayer) ytPlayer.destroy();
  ytContainer.innerHTML='';
  const div=document.createElement('div'); div.id='ytPlayerDiv'; ytContainer.appendChild(div);

  ytPlayer=new YT.Player('ytPlayerDiv',{
    width:'300', height:'170',
    videoId:id,
    playerVars:{autoplay:1, controls:0},
    events:{
      'onReady':()=>{playerReady=true; ytPlayer.playVideo(); updateProgress();},
      'onStateChange':()=>{if(loopMode && ytPlayer.getPlayerState()===0){ytPlayer.seekTo(0,true); ytPlayer.playVideo();} requestAnimationFrame(updateProgress);}
    }
  });
});

playBtn.addEventListener('click',()=>{if(playerReady) ytPlayer.playVideo();});
pauseBtn.addEventListener('click',()=>{if(playerReady) ytPlayer.pauseVideo();});
loopBtn.addEventListener('click',()=>{
  loopMode=!loopMode;
  loopBtn.textContent=loopMode?'🔂':'🔁';
});

progressBar.addEventListener('click',(e)=>{
  if(!playerReady) return;
  const rect=progressBar.getBoundingClientRect();
  const percent=(e.clientX-rect.left)/rect.width;
  const time=ytPlayer.getDuration()*percent;
  ytPlayer.seekTo(time,true);
});

function updateProgress(){
  if(playerReady && ytPlayer.getDuration){
    const duration=ytPlayer.getDuration();
    const current=ytPlayer.getCurrentTime();
    if(duration>0) progress.style.width=(current/duration*100)+'%';
    requestAnimationFrame(updateProgress);
  }
}