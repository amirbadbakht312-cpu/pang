// game.js - کنترل‌کننده اصلی با دوربین دنبال‌کننده

const GAME = {
  isMoving: false,

  init: function() {
    WORLD.init();
    PLAYER.init();
    CAMERA.init();
    MINIMAP.init();
    JOYSTICK.init();
    this.createClickLayer();
    this.createLightLayer();
    
    // دوربین رو همون اول ببر روی پنگوئن
    const startPos = PLAYER.getWorldPosition();
    WORLD.moveCamera(startPos.x, startPos.y);
    
    this.gameLoop();
  },

  createClickLayer: function() {
    const layer = document.createElement('div');
    layer.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 100;
      cursor: crosshair;
      background: transparent;
    `;

    layer.addEventListener('click', (e) => {
      if (this.isMoving) return;
      const worldPos = WORLD.screenToWorld(e.clientX, e.clientY);
      const total = WORLD.getTotalBounds();
      const tx = Math.min(Math.max(worldPos.x, 20), total.right - 20);
      const ty = Math.min(Math.max(worldPos.y, 20), total.bottom - 20);
      this.movePlayerTo(tx, ty);
    });

    document.body.appendChild(layer);
  },

  createLightLayer: function() {
    this.lightLayer = document.createElement('div');
    this.lightLayer.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 9;
      pointer-events: none;
    `;
    document.body.appendChild(this.lightLayer);
  },

  createGreenLight: function(worldX, worldY) {
    const screen = WORLD.worldToScreen(worldX, worldY);
    const light = document.createElement('div');
    light.style.cssText = `
      position: fixed;
      left: ${screen.x}px; top: ${screen.y}px;
      width: 20px; height: 20px;
      background: radial-gradient(circle, #00ff88, #00cc66 40%, transparent 70%);
      border-radius: 50%;
      z-index: 9;
      pointer-events: none;
      box-shadow: 0 0 12px #00ff88, 0 0 22px #00ff66;
      animation: pulse 0.5s ease-out forwards;
      transform: translate(-50%, -50%);
    `;
    this.lightLayer.appendChild(light);
    setTimeout(() => light.remove(), 500);
  },

  findPath: function(startX, startY, endX, endY) {
    if (!WORLD.isInsideLake(startX, startY) &&
        !WORLD.isInsideLake(endX, endY) &&
        !this.lineIntersectsLake(startX, startY, endX, endY)) {
      return [{ x: endX, y: endY }];
    }

    const bounds = WORLD.getLakeWorldBounds();
    const corners = [
      { x: bounds.left, y: bounds.top },
      { x: bounds.right, y: bounds.top },
      { x: bounds.right, y: bounds.bottom },
      { x: bounds.left, y: bounds.bottom }
    ];

    let startPt = WORLD.isInsideLake(startX, startY) ?
      this.nearestPoint(startX, startY, corners) : { x: startX, y: startY };
    let endPt = WORLD.isInsideLake(endX, endY) ?
      this.nearestPoint(endX, endY, corners) : { x: endX, y: endY };

    if (!WORLD.isInsideLake(startX, startY) &&
        this.lineIntersectsLake(startX, startY, endPt.x, endPt.y)) {
      startPt = this.nearestPoint(startX, startY, corners);
    }

    const path = [startPt];
    const perimeterPath = this.getPerimeterPath(startPt, endPt, corners);
    path.push(...perimeterPath);
    if (endPt.x !== endX || endPt.y !== endY) path.push({ x: endX, y: endY });

    return path;
  },

  lineIntersectsLake: function(x1, y1, x2, y2) {
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      if (WORLD.isInsideLake(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return true;
    }
    return false;
  },

  nearestPoint: function(x, y, points) {
    let min = Infinity, best = points[0];
    points.forEach(p => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < min) { min = d; best = p; }
    });
    return best;
  },

  getPerimeterPath: function(start, end, corners) {
    const idx1 = corners.findIndex(c => c.x === start.x && c.y === start.y);
    const idx2 = corners.findIndex(c => c.x === end.x && c.y === end.y);
    if (idx1 === -1 || idx2 === -1 || idx1 === idx2) return [];

    const path1 = [], path2 = [];
    for (let i = idx1; i !== idx2; i = (i + 1) % 4) path1.push(corners[i]);
    path1.push(corners[idx2]);
    for (let i = idx1; i !== idx2; i = (i - 1 + 4) % 4) path2.push(corners[i]);
    path2.push(corners[idx2]);

    return path1.length <= path2.length ? path1 : path2;
  },

  async movePlayerTo(tx, ty) {
    if (this.isMoving) return;
    const start = PLAYER.getWorldPosition();
    const path = this.findPath(start.x, start.y, tx, ty);
    if (path.length === 0) return;

    this.isMoving = true;

    for (const point of path) {
      PLAYER.moveTo(point.x, point.y);
      WORLD.moveCamera(point.x, point.y);
      MINIMAP.update();
      await new Promise(r => setTimeout(r, 180));
    }

    this.isMoving = false;
    this.createGreenLight(path[path.length - 1].x, path[path.length - 1].y);
  },

  gameLoop: function() {
    // جوی‌استیک
    const dir = JOYSTICK.getDirection();
    if (dir && !this.isMoving) {
      const pos = PLAYER.getWorldPosition();
      const newX = pos.x + dir.x * 6;
      const newY = pos.y + dir.y * 6;
      const total = WORLD.getTotalBounds();
      if (!WORLD.isInsideLake(newX, newY) &&
          newX > 20 && newX < total.right - 20 &&
          newY > 20 && newY < total.bottom - 20) {
        PLAYER.moveTo(newX, newY);
        WORLD.moveCamera(newX, newY);
      }
    }

    // ★ دوربین همیشه پنگوئن رو دنبال کنه ★
    const playerWorldPos = PLAYER.getWorldPosition();
    WORLD.moveCamera(playerWorldPos.x, playerWorldPos.y);
    
    PLAYER.updateScreenPosition();
    MINIMAP.update();

    requestAnimationFrame(() => this.gameLoop());
  }
};

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  }
`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', () => GAME.init());
