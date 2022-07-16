class Particle {
  constructor(imageDom, canvasDom, x, y, color, particleRadius) {
    this.canvasDomContext = canvasDom.getContext('2d');
    // 半径2の円を描きたいので、辺4の正方形を取っている
    // なので、通常のより2倍の幅ないし高さを戻して、対象の正方形の中心座標を求めている
    this.x = x + canvasDom.width / 2 - imageDom.width * 2;
    this.y = y + canvasDom.height / 2 - imageDom.height * 2;
    this.color = color;
    this.particleRadius = particleRadius || 2;
    this.baseX = x + canvasDom.width / 2 - imageDom.width * 2;
    this.baseY = y + canvasDom.height / 2 - imageDom.height * 2;
    this.density = Math.random() * 10 + 2;
  }

  drawCircle() {
    this.canvasDomContext.beginPath();
    this.canvasDomContext.arc(this.x, this.y, this.particleRadius, 0, Math.PI * 2);
    this.canvasDomContext.closePath();
    this.canvasDomContext.fill();
  }

  update(mouse) {
    // check mouse position/particle position - collision detection
    this.canvasDomContext.fillStyle = this.color;
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    // distance past which the force is zero
    // ここでエフェクト範囲を調節できる clampできるところ
    let maxDistance = 80;
    let force = (maxDistance - distance) / maxDistance;

    // if we go below zero, set it to zero.
    if (force < 0) {
      force = 0;
    }

    let directionX = forceDirectionX * force * this.density * 0.9;
    let directionY = forceDirectionY * force * this.density * 0.9;
    if (distance < mouse.radius + this.particleRadius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        let dy = this.y - this.baseY;
        this.x -= dx;
      }
      if (this.y !== this.baseY) {
        let dx = this.x - this.baseX;
        let dy = this.y - this.baseY;
        this.y -= dy;
      }
    }
    this.drawCircle();
  }
}

export {Particle};
