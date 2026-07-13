// joystick.js - جوی‌استیک لمسی برای موبایل

const JOYSTICK = {
  element: null,
  knob: null,
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  maxDistance: 35,

  init: function() {
    this.element = document.createElement('div');
    this.element.style.cssText = `
      position: fixed;
      bottom: 30px; left: 30px;
      width: 90px; height: 90px;
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.25);
      border-radius: 50%;
      z-index: 300;
      touch-action: none;
    `;

    this.knob = document.createElement('div');
    this.knob.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.35);
      border-radius: 50%;
      pointer-events: none;
    `;

    this.element.appendChild(this.knob);
    document.body.appendChild(this.element);
    this.bindEvents();
  },

  bindEvents: function() {
    this.element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.active = true;
      const rect = this.element.getBoundingClientRect();
      this.startX = rect.left + rect.width / 2;
      this.startY = rect.top + rect.height / 2;
    });

    this.element.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.active) return;
      const touch = e.touches[0];
      let dx = touch.clientX - this.startX;
      let dy = touch.clientY - this.startY;
      const dist = Math.hypot(dx, dy);
      if (dist > this.maxDistance) {
        dx = (dx / dist) * this.maxDistance;
        dy = (dy / dist) * this.maxDistance;
      }
      this.currentX = dx;
      this.currentY = dy;
      this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    });

    this.element.addEventListener('touchend', () => {
      this.active = false;
      this.currentX = 0;
      this.currentY = 0;
      this.knob.style.transform = 'translate(-50%, -50%)';
    });
  },

  getDirection: function() {
    if (!this.active) return null;
    const dist = Math.hypot(this.currentX, this.currentY);
    if (dist < 8) return null;
    return {
      x: this.currentX / this.maxDistance,
      y: this.currentY / this.maxDistance
    };
  }
};
