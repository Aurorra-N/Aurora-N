let particles = [];
let particleCount = 80;        // 点数量（少一点更高级）
let connectDistance = 220;     // 连线范围（更大结构）
let maxConnections = 3;        // 每个点最多连接几条线

let mouseRadius = 140;         // 鼠标影响范围
let mouseForce = 0.015;        // 鼠标影响强度

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(255); // 白色背景

  // 更新粒子
  for (let p of particles) {
    p.move();
    p.reactToMouse();
    p.display();
  }

  // 画连线（控制数量）
  for (let i = 0; i < particles.length; i++) {
    let connections = 0;

    for (let j = i + 1; j < particles.length; j++) {
      if (connections >= maxConnections) break;

      let p1 = particles[i];
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);

      if (d < connectDistance) {
        let alpha = map(d, 0, connectDistance, 60, 0);

        stroke(140, 140, 140, alpha);
        strokeWeight(0.7);
        line(p1.x, p1.y, p2.x, p2.y);

        connections++;
      }
    }
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);

    // ⭐ 很慢的运动（关键）
    this.vx = random(-0.12, 0.12);
    this.vy = random(-0.12, 0.12);

    this.size = random(2, 3.2);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // 边界反弹
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  reactToMouse() {
    let d = dist(this.x, this.y, mouseX, mouseY);

    if (d < mouseRadius) {
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;

      this.vx += dx * mouseForce * 0.01;
      this.vy += dy * mouseForce * 0.01;
    }

    // 限速（防止乱飞）
    this.vx = constrain(this.vx, -0.3, 0.3);
    this.vy = constrain(this.vy, -0.3, 0.3);

    // 阻尼（越来越稳）
    this.vx *= 0.995;
    this.vy *= 0.995;
  }

  display() {
    noStroke();
    fill(120, 120, 120, 150);
    circle(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}