// player.js - پنگوئن در دنیای ۶ تکه

const PLAYER = {
  worldX: 0,
  worldY: 0,
  element: null,

  init: function() {
    this.worldX = WORLD.lakeTile.col * WORLD.tileWidth + WORLD.tileWidth / 2 - 200;
    this.worldY = WORLD.lakeTile.row * WORLD.tileHeight + WORLD.tileHeight / 2;
    this.createElement();
    this.updateScreenPosition();
  },

  createElement: function() {
    this.element = document.createElement('img');
    this.element.id = 'player-penguin';
    this.element.src = 'assets/image/pangnafasdam.jpeg';
    this.element.style.cssText = `
      position: fixed;
      z-index: 10;
      width: 60px;
      height: auto;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: left 0.4s ease-out, top 0.4s ease-out;
    `;
    document.body.appendChild(this.element);
  },

  moveTo: function(worldX, worldY) {
    this.worldX = worldX;
    this.worldY = worldY;
    this.updateScreenPosition();
  },

  updateScreenPosition: function() {
    const screen = WORLD.worldToScreen(this.worldX, this.worldY);
    if (this.element) {
      this.element.style.left = screen.x + 'px';
      this.element.style.top = screen.y + 'px';
    }
  },

  getWorldPosition: function() {
    return { x: this.worldX, y: this.worldY };
  },

  getScreenPosition: function() {
    return WORLD.worldToScreen(this.worldX, this.worldY);
  }
};
