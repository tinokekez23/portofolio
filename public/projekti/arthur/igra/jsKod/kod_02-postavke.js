//#region okvir
/// <reference path="../otter/lib-00-GameSettings.js"/>
/// <reference path="../otter/lib-01-tiled.js"/>
/// <reference path="../otter/lib-02-sensing.js"/>
/// <reference path="../otter/lib-03-display.js"/>
/// <reference path="../otter/lib-04-engine.js"/>
/// <reference path="../otter/lib-05-game.js"/>
/// <reference path="../otter/lib-06-main.js"/>
//#endregion
/// <reference path="kod_00-staticka.js"/>
/// <reference path="kod_01-likovi.js"/>

// što će se pokrenuti kad se klikne button Setup:
let btnSetupGame = document.getElementById("btnSetupGame");
btnSetupGame.addEventListener("click", setup);

window.addEventListener("keydown", function (e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
});

function setup() {
  if (GAME.activeWorldMap == null) {
    prebaciNaLevel("level1");
  }

  GAME.clearSprites();
  Postavke.goblins = [];
  Postavke.arthur = null;
  Postavke.cilj = null;

  let odabrana = GAME.activeWorldMap.name;
  GameSettings.output("Pokrenut je " + odabrana, true);

  switch (odabrana) {
    case "level1":
    case "level2":
      setupLevel();
      break;

    default:
      prebaciNaLevel("level1");
      setupLevel();
      break;
  }

  render_main();
}

/* LEVELS */
function setupLevel() {
  GAME.clearSprites();
  Postavke.goblins = [];

  GAME.activeWorldMap.setCollisions("kolizije");

  let start = GAME.getSpriteLayer("arthurStart");
  let arthurLayer = GAME.getSpriteLayer("arthur");
  Postavke.arthur = new Arthur(start.x, start.y, arthurLayer);
  GAME.addSprite(Postavke.arthur);

  Postavke.cilj = new Goal(GAME.getSpriteLayer("cilj"));
  GAME.addSprite(Postavke.cilj);

  dodajGoblina("g1", 240, 400);
  dodajGoblina("g2", 600, 790);

  ispisiStanje();
}

function dodajGoblina(ime, lijevo, desno) {
  let layer = GAME.getSpriteLayer(ime);
  if (layer == undefined) return;

  let goblin = new Goblin(layer, lijevo, desno);
  Postavke.goblins.push(goblin);
  GAME.addSprite(goblin);
}

function prebaciNaLevel(ime) {
  GAME.clearSprites();
  GAME.setActiveWorldMap(ime);

  DISPLAY = new Display(canvasGame);
  DISPLAY.buffer.canvas.height = GAME.activeWorldMap.heightPx;
  DISPLAY.buffer.canvas.width = GAME.activeWorldMap.widthPx;

  resize_main();
  render_main();
}

function ispisiStanje() {
  GameSettings.output("Životi: " + Postavke.arthur.zivoti + " | Kretanje: strelice | Skok: ↑ | Udarac: SPACE");
}
