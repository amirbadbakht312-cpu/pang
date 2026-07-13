// camera.js - دوربین با تشخیص گوشه‌ها

const CAMERA = {
  edgeThreshold: 80,
  scrollSpeed: 15,

  init: function() {},

  checkEdges: function(screenX, screenY) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let dx = 0, dy = 0;

    if (screenX < this.edgeThreshold) dx = -this.scrollSpeed;
    else if (screenX > vw - this.edgeThreshold) dx = this.scrollSpeed;

    if (screenY < this.edgeThreshold) dy = -this.scrollSpeed;
    else if (screenY > vh - this.edgeThreshold) dy = this.scrollSpeed;

    if (dx !== 0 || dy !== 0) {
      const total = WORLD.getTotalBounds();
      WORLD.offsetX = Math.max(-(total.right - vw), Math.min(0, WORLD.offsetX + dx));
      WORLD.offsetY = Math.max(-(total.bottom - vh), Math.min(0, WORLD.offsetY + dy));
      WORLD.updateTransform();
      PLAYER.updateScreenPosition();
      return true;
    }
    return false;
  }
};
