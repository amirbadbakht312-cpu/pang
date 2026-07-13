// minimap.js - مینی‌مپ بالا سمت راست

const MINIMAP = {
  element: null,
  canvas: null,
  ctx: null,
  size: 150,
  scale: 1,

  init: function() {
    this.size = 150;
    this.element = document.createElement('div');
    this.element.id = 'minimap';
    this.element.style.cssText = `
      position: fixed;
      top: 20px; right: 20px;
      width: ${this.size}px;
      height: ${this.size * WORLD.rows / WORLD.cols}px;
      background: rgba(0,0,0,0.7);
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 10px;
      z-index: 300;
      overflow: hidden;
      backdrop-filter: blur(5px);
    `;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size * WORLD.rows / WORLD.cols;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    
    this.element.appendChild(this.canvas);
    document.body.appendChild(this.element);
    this.ctx = this.canvas.getContext('2d');
    this.scale = this.canvas.width / (WORLD.cols * WORLD.tileWidth);
  },

  update: function() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // پس‌زمینه مینی‌مپ
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // خطوط تایل‌ها
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.5;
    for (let row = 0; row <= WORLD.rows; row++) {
      ctx.beginPath();
      ctx.moveTo(0, row * h / WORLD.rows);
      ctx.lineTo(w, row * h / WORLD.rows);
      ctx.stroke();
    }
    for (let col = 0; col <= WORLD.cols; col++) {
      ctx.beginPath();
      ctx.moveTo(col * w / WORLD.cols, 0);
      ctx.lineTo(col * w / WORLD.cols, h);
      ctx.stroke();
    }

    // دریاچه
    const lakeBounds = WORLD.getLakeWorldBounds();
    const lakeMiniX = lakeBounds.centerX * this.scale;
    const lakeMiniY = lakeBounds.centerY * this.scale;
    const lakeMiniR = (WORLD.lakeSize / 2) * this.scale;
    
    ctx.fillStyle = 'rgba(0,150,255,0.5)';
    ctx.beginPath();
    ctx.arc(lakeMiniX, lakeMiniY, lakeMiniR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // پنگوئن
    const playerPos = PLAYER.getWorldPosition();
    const playerMiniX = playerPos.x * this.scale;
    const playerMiniY = playerPos.y * this.scale;
    
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(playerMiniX, playerMiniY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // محدوده دید
    const vpX = -WORLD.offsetX * this.scale;
    const vpY = -WORLD.offsetY * this.scale;
    const vpW = WORLD.viewportWidth * this.scale;
    const vpH = WORLD.viewportHeight * this.scale;
    
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  }
};
