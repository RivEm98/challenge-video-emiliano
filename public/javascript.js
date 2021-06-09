const socket = io();

/*DOM Elements*/
const video = document.querySelector('.viewer');
const btn = document.querySelector('.toggle');
let volume = document.querySelector('.player__slider');
const volumeMuted = document.querySelector('.volumeMuted');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');

/* Build out functions */
function togglePlay() {
  let button = btn.innerHTML
  if (video.paused){
    video.play()
    btn.innerHTML = '&#10073;&#10073;'
  } else {
    video.pause()
    btn.innerHTML = '►'
  }
  /* console.log(button);obtengo el valor del boton */
  socket.emit('stateVideo', button)
}
function handleVolume(){
  video[this.name] = this.value
  socket.emit('stateVolume', video[this.name])
}
function handleProgress(){
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
}
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime
  socket.emit('timeVideo', video.currentTime)
}
function toggleMuted(){
  if (video.muted === false) {
    video.muted = true
    volumeMuted.innerHTML = 'Enable Sound'
  }else{
    video.muted = false
    volumeMuted.innerHTML = 'Disable Sound'
  }
}

/* Hook up the event listener */
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', handleProgress);
btn.addEventListener('click', togglePlay);
volume.addEventListener('change', handleVolume);
volume.addEventListener('mousemove', handleVolume);
volumeMuted.addEventListener('click', toggleMuted);
progress.addEventListener('click', scrub)

/* Listen to the server */
socket.on('stateVideo', (data)=>{
  if(data){
    if (video.paused){
      video.play()
      btn.innerHTML = '&#10073;&#10073;'
    } else {
      video.pause()
      btn.innerHTML = '►'
    }
  }
})
socket.on('stateVolume', (data)=>{
  video.volume = data
})
socket.on('timeVideo', (data)=>{
  video.currentTime = data
})