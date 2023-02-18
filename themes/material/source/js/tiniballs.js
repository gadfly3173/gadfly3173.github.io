
let WIDTH = window.innerWidth; let HEIGHT = window.innerHeight; const
  POINT = 15;

const canvas = document.getElementById('tinyball-canvas');
WIDTH = canvas.width = window.innerWidth;
HEIGHT = canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,0.02)',
context.strokeWidth = 1,
context.fillStyle = 'rgba(0,0,0,0.05)';
let circleArr = [];
const rgbaReg = /\(.*\)/;

function Line(x, y, _x, _y, o) {
  this.beginX = x,
  this.beginY = y,
  this.closeX = _x,
  this.closeY = _y,
  this.o = o;
}

function Circle(x, y, r, moveX, moveY) {
  this.x = x,
  this.y = y,
  this.r = r,
  this.moveX = moveX,
  this.moveY = moveY;
}

function num(max, _min) {
  const min = arguments[1] || 0;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawCircle(cxt, x, y, r, moveX, moveY) {
  const circle = new Circle(x, y, r, moveX, moveY);
  cxt.beginPath();
  cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  cxt.closePath();
  cxt.fill();
  return circle;
}

function drawLine(cxt, x, y, _x, _y, o) {
  const line = new Line(x, y, _x, _y, o);
  cxt.beginPath();
  // 获取原始rgb
  const rgbaStr = cxt.strokeStyle;
  let originalRgb = rgbaReg.exec(rgbaStr)[0];
  rgbaReg.lastIndex = 0;
  // 截取 255,255,255,0.02
  originalRgb = originalRgb.substring(1, originalRgb.length - 2);
  const originalRgbArr = originalRgb.split(',');
  // 更改透明度
  cxt.strokeStyle = `rgba(${originalRgbArr[0]},${originalRgbArr[1]},${originalRgbArr[2]},${o})`;
  cxt.moveTo(line.beginX, line.beginY);
  cxt.lineTo(line.closeX, line.closeY);
  cxt.closePath();
  cxt.stroke();
}

function init() {
  circleArr = [];
  for (let i = 0; i < POINT; i++) {
    circleArr.push(drawCircle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
  }
  draw();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < POINT; i++) {
    for (let j = 0; j < POINT; j++) {
      if (i + j < POINT) {
        const A = Math.abs(circleArr[i + j].x - circleArr[i].x);
        const B = Math.abs(circleArr[i + j].y - circleArr[i].y);
        const lineLength = Math.sqrt(A * A + B * B);
        const C = 1 / lineLength * 7 - 0.009;
        const lineOpacity = C > 0.03 ? 0.03 : C;
        if (lineOpacity > 0) {
          drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y, lineOpacity);
        }
      }
    }
  }
  for (var i = 0; i < POINT; i++) {
    drawCircle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
  }
}

$(document).ready(() => {
  const isIE = document.documentMode || +(navigator.userAgent.match(/MSIE (\d+)/) && RegExp.$1);
  if (isIE) {
    window.alert('本页面仅支持真正的现代浏览器，而您正在使用IE，将有部分功能无法使用，请谅解');
    return;
  }
  init();
  setInterval(() => {
    for (let i = 0; i < POINT; i++) {
      const cir = circleArr[i];
      cir.x += cir.moveX;
      cir.y += cir.moveY;
      if (cir.x > WIDTH) cir.x = 0;
      else if (cir.x < 0) cir.x = WIDTH;
      if (cir.y > HEIGHT) cir.y = 0;
      else if (cir.y < 0) cir.y = HEIGHT;
    }
    draw();
  }, 16);
});
