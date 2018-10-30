class CubicBezier {
  constructor(z) {
    this.a = { x: Math.random() * canvas.width, y: canvas.height + 20 };
    this.b = { x: Math.random() * canvas.width, y: -20 };
    this.c1 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    this.c2 = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
    this.sprites = [];
    this.color = `hsl(130, ${z * 80 + "%"}, 38%)`;
    this.shadow = `hsl(140, ${z * 70 + "%"}, 12%)`;
    this.width = Math.ceil(z * 34 + 4);
    this.z = z;
    
    for (let i = 0; i < Math.random() * 20 + 5; i ++) {
      this.sprites.push(
        new Sprite(this)
      );
    }
  }
  
  step() {
    ctx.lineWidth = this.width + 16;
    ctx.strokeStyle = "rgba(0,0,0,.3)";
    ctx.beginPath();
    ctx.moveTo(this.a.x + 7, this.a.y);
    ctx.bezierCurveTo(this.c1.x + 7, this.c1.y, this.c2.x + 7, this.c2.y, this.b.x + 7, this.b.y);
    ctx.stroke();
    
    ctx.lineWidth = this.width + 7;
    ctx.strokeStyle = this.shadow;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.bezierCurveTo(this.c1.x + 5, this.c1.y + 2, this.c2.x, this.c2.y, this.b.x, this.b.y);
    ctx.stroke();
    
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.a.x, this.a.y);
    ctx.bezierCurveTo(this.c1.x, this.c1.y, this.c2.x, this.c2.y, this.b.x, this.b.y);
    ctx.stroke();
    
    this.sprites.forEach((sprite) => {
      sprite.step();
    });
  }
  
  getPoint(t) {
    let u = 1 - t,
        t2 = t * t,
        u2 = u * u,
        u3 = u2 * u,
        t3 = t2 * t;
    
    let x = (u3 * this.a.x) +
        (3 * u2 * t) * this.c1.x +
        (3 * u * t2) * this.c2.x +
        (t3 * this.b.x);
    
    let y = (u3 * this.a.y) +
        (3 * u2 * t) * this.c1.y +
        (3 * u * t2) * this.c2.y +
        (t3 * this.b.y);
    
    return { x, y };
  }
}

class Sprite {
  constructor(path) {
    this.time = Math.random() * 1;
    this.path = path;
    this.r = Math.floor(Math.random() * 5 + 4 + (path.z * 3));
    this.color = `hsl(125, ${path.z * 100 + "%"}, 76%)`;
    this.shadow = `hsl(135, ${path.z * 100 + "%"}, 15%)`;
    this.speed = path.z * .002 + .001;
  }
  
  step() {
    this.time += this.speed;
    if (this.time > 1) this.time = 0;
    
    const pos = this.path.getPoint(this.time);
    
    ctx.fillStyle = this.shadow;
    ctx.beginPath();
    ctx.arc(pos.x + 2, pos.y + 1, this.r + 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}


function init() {
  canvas.width = body.offsetWidth;
  canvas.height = body.offsetHeight;
  
  paths = [];
  
  for (let i = 0; i < 15; i ++) {
    paths.push(
      new CubicBezier(i / 15)
    );
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function step() {
  clearCanvas();
  
  paths.forEach((path) => {
    path.step();
  });
  
  window.requestAnimationFrame(step);
}


const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let paths = [];


window.addEventListener("resize", init);


init();
window.requestAnimationFrame(step);