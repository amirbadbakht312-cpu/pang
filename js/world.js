// world.js - دنیای ۶ تکه با اسکرول

const WORLD = {
  cols: 3,
  rows: 2,
  tileWidth: 0,
  tileHeight: 0,
  offsetX: 0,
  offsetY: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  lakeTile: { col: 1, row: 0 },
  lakeSize: 0,

  init: function() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.tileWidth = this.viewportWidth;
    this.tileHeight = this.viewportHeight;
    this.lakeSize = Math.min(this.viewportWidth, this.viewportHeight) * 0.35;
    
    this.createTiles();
    this.createLake();
    this.centerOnLake();
  },

  createTiles: function() {
    this.container = document.createElement('div');
    this.container.id = 'world-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: ${this.cols * this.tileWidth}px;
      height: ${this.rows * this.tileHeight}px;
      z-index: 0;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tile = document.createElement('div');
        tile.className = 'world-tile';
        tile.style.cssText = `
          position: absolute;
          left: ${col * this.tileWidth}px;
          top: ${row * this.tileHeight}px;
          width: ${this.tileWidth}px;
          height: ${this.tileHeight}px;
          background-image: url('assets/image/paszamine.jpeg');
          background-size: cover;
          background-position: center;
          border: 2px solid rgba(255,255,255,0.1);
        `;
        tile.dataset.col = col;
        tile.dataset.row = row;
        this.container.appendChild(tile);
      }
    }

    document.body.appendChild(this.container);
  },

  createLake: function() {
    this.lake = document.createElement('div');
    this.lake.id = 'world-lake';
    const lakeX = this.lakeTile.col * this.tileWidth + this.tileWidth / 2;
    const lakeY = this.lakeTile.row * this.tileHeight + this.tileHeight / 2;
    
    this.lake.style.cssText = `
      position: absolute;
      left: ${lakeX}px;
      top: ${lakeY}px;
      transform: translate(-50%, -50%);
      width: ${this.lakeSize}px;
      height: ${this.lakeSize}px;
      z-index: 2;
      pointer-events: none;
    `;

    const img = document.createElement('img');
    img.src = 'assets/image/daryache.jpeg';
    img.style.cssText = `
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: 50%;
    `;
    
    this.lake.appendChild(img);
    this.container.appendChild(this.lake);
  },

  centerOnLake: function() {
    const lakeCenterX = this.lakeTile.col * this.tileWidth + this.tileWidth / 2;
    const lakeCenterY = this.lakeTile.row * this.tileHeight + this.tileHeight / 2;
    this.offsetX = -(lakeCenterX - this.viewportWidth / 2);
    this.offsetY = -(lakeCenterY - this.viewportHeight / 2);
    this.updateTransform();
  },

  moveCamera: function(targetX, targetY) {
    this.offsetX = -(targetX - this.viewportWidth / 2);
    this.offsetY = -(targetY - this.viewportHeight / 2);
    
    const maxX = 0;
    const minX = -(this.cols * this.tileWidth - this.viewportWidth);
    const maxY = 0;
    const minY = -(this.rows * this.tileHeight - this.viewportHeight);
    
    this.offsetX = Math.max(minX, Math.min(maxX, this.offsetX));
    this.offsetY = Math.max(minY, Math.min(maxY, this.offsetY));
    
    this.updateTransform();
  },

  updateTransform: function() {
    this.container.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
  },

  worldToScreen: function(worldX, worldY) {
    return {
      x: worldX + this.offsetX,
      y: worldY + this.offsetY
    };
  },

  screenToWorld: function(screenX, screenY) {
    return {
      x: screenX - this.offsetX,
      y: screenY - this.offsetY
    };
  },

  getLakeWorldBounds: function() {
    const lakeX = this.lakeTile.col * this.tileWidth + this.tileWidth / 2;
    const lakeY = this.lakeTile.row * this.tileHeight + this.tileHeight / 2;
    const margin = 40;
    return {
      left: lakeX - this.lakeSize / 2 - margin,
      right: lakeX + this.lakeSize / 2 + margin,
      top: lakeY - this.lakeSize / 2 - margin,
      bottom: lakeY + this.lakeSize / 2 + margin,
      centerX: lakeX,
      centerY: lakeY
    };
  },

  isInsideLake: function(worldX, worldY) {
    const bounds = this.getLakeWorldBounds();
    return worldX >= bounds.left && worldX <= bounds.right &&
           worldY >= bounds.top && worldY <= bounds.bottom;
  },

  getTotalBounds: function() {
    return {
      left: 0,
      top: 0,
      right: this.cols * this.tileWidth,
      bottom: this.rows * this.tileHeight
    };
  }
};
