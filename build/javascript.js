"use strict";

var socket = io();
/*DOM Elements*/

var video = document.querySelector('.viewer');
var btn = document.querySelector('.toggle');
var volume = document.querySelector('.player__slider');
var volumeMuted = document.querySelector('.volumeMuted');
var progress = document.querySelector('.progress');
var progressBar = document.querySelector('.progress__filled');
/* Build out functions */

function togglePlay() {
  var button = btn.innerHTML;

  if (video.paused) {
    video.play();
    btn.innerHTML = '&#10073;&#10073;';
  } else {
    video.pause();
    btn.innerHTML = '►';
  }
  /* console.log(button);obtengo el valor del boton */


  socket.emit('stateVideo', button);
}

function handleVolume() {
  video[this.name] = this.value;
  socket.emit('stateVolume', video[this.name]);
}

function handleProgress() {
  var percent = video.currentTime / video.duration * 100;
  progressBar.style.width = "".concat(percent, "%");
}

function scrub(e) {
  var scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
  socket.emit('timeVideo', video.currentTime);
}

function toggleMuted() {
  if (video.muted === false) {
    video.muted = true;
    volumeMuted.innerHTML = 'Enable Sound';
  } else {
    video.muted = false;
    volumeMuted.innerHTML = 'Disable Sound';
  }
}
/* Hook up the event listener */


video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', handleProgress);
btn.addEventListener('click', togglePlay);
volume.addEventListener('change', handleVolume);
volume.addEventListener('mousemove', handleVolume);
volumeMuted.addEventListener('click', toggleMuted);
progress.addEventListener('click', scrub);
/* Listen to the server */

socket.on('stateVideo', function (data) {
  if (data) {
    if (video.paused) {
      video.play();
      btn.innerHTML = '&#10073;&#10073;';
    } else {
      video.pause();
      btn.innerHTML = '►';
    }
  }
});
socket.on('stateVolume', function (data) {
  video.volume = data;
});
socket.on('timeVideo', function (data) {
  video.currentTime = data;
});