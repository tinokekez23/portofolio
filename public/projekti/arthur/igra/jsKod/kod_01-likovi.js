//#region okvir
/// <reference path="../otter/lib-00-GameSettings.js"/>
/// <reference path="../otter/lib-01-tiled.js"/>
/// <reference path="../otter/lib-02-sensing.js"/>
/// <reference path="../otter/lib-03-display.js"/>
/// <reference path="../otter/lib-04-engine.js"/>
/// <reference path="../otter/lib-05-game.js"/>
/// <reference path="../otter/lib-06-main.js"/>
//#endregion

// ovdje pišete svoje klase

class Arthur extends Sprite {
  constructor(x, y, layer) {
    super(x, y, 60, 60);

    this.frame_sets = {
      "up": [1],
      "walk-up": [4],
      "right": [2],
      "walk-right": [2, 3],
      "down": [1],
      "walk-down": [1],
      "left": [5],
      "walk-left": [5, 6]
    };

    this.layer = layer;
    this.visible = true;

    this.pocetakX = x;
    this.pocetakY = y;
    this.zivoti = Postavke.zivotiNaPocetku;
    this.napad = 0;
    this.steta = 0;
  }

  moveRight() {
    this.direction = 90;
    this.velocity_x += 1.7;
  }

  moveLeft() {
    this.direction = 270;
    this.velocity_x -= 1.7;
  }

  jump(h = 42) {
    super.jump(h);
  }

  udari() {
    this.napad = 8;
  }

  napada() {
    return this.napad > 0;
  }

  updatePosition(gravity = 2.1, friction = 0.82) {
    super.updatePosition(gravity, friction);

    if (this.napad > 0) this.napad--;
    if (this.steta > 0) this.steta--;
  }

  resetirajPoziciju() {
    this.x = this.pocetakX;
    this.y = this.pocetakY;
    this.x_old = this.x;
    this.y_old = this.y;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.jumping = true;
    this.napad = 0;
    this.steta = 0;
  }

  pravokutnikNapada() {
    let sirina = 38;

    if (this.direction == 270) {
      return {
        left: this.left - sirina,
        right: this.left + 8,
        top: this.top + 12,
        bottom: this.bottom - 8
      };
    }

    return {
      left: this.right - 8,
      right: this.right + sirina,
      top: this.top + 12,
      bottom: this.bottom - 8
    };
  }

  pogada(sprite) {
    if (!this.napada() || !sprite.visible) return false;

    let a = this.pravokutnikNapada();
    let b = {
      left: sprite.left,
      right: sprite.right,
      top: sprite.top,
      bottom: sprite.bottom
    };

    return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
  }
}

class Goblin extends Item {
  constructor(layer, lijevo, desno) {
    super(layer);

    this.frame_sets = {
      "up": [1],
      "walk-up": [1],
      "right": [1],
      "walk-right": [1, 2, 3, 4],
      "down": [1],
      "walk-down": [1],
      "left": [1],
      "walk-left": [1, 2, 3, 4]
    };

    this.layer = layer;
    this.visible = true;
    this.lijevo = lijevo;
    this.desno = desno;
    this.brzina = 1.2;
    this.direction = 90;
  }

  updatePosition() {
    this.x_old = this.x;
    this.y_old = this.y;
    this.x += this.brzina;

    if (this.x < this.lijevo) {
      this.x = this.lijevo;
      this.brzina = Math.abs(this.brzina);
      this.direction = 90;
    }

    if (this.x > this.desno) {
      this.x = this.desno;
      this.brzina = -Math.abs(this.brzina);
      this.direction = 270;
    }
  }
}

class Goal extends Item {
  constructor(layer) {
    super(layer);
    this.visible = true;
  }

  updatePosition() {
  }
}
