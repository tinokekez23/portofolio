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
/// <reference path="kod_02-postavke.js"/>

/**
 * Promjena stanja likova - interakcije
 */
function update_main() {
  if (GAME.activeWorldMap == null) return;

  switch (GAME.activeWorldMap.name) {
    case "level1":
    case "level2":
      igra();
      break;
  }

  GAME.update();
  provjeriNakonFizike();
}

function igra() {
  if (Postavke.arthur == null) return;

  upravljanje();
  provjeriGobline();
  provjeriCilj();
}

function upravljanje() {
  if (SENSING.right.active || SENSING.keyD.active) {
    Postavke.arthur.moveRight();
  }

  if (SENSING.left.active || SENSING.keyA.active) {
    Postavke.arthur.moveLeft();
  }

  if (SENSING.up.active || SENSING.keyW.active) {
    Postavke.arthur.jump();
  }

  if (SENSING.space.active) {
    Postavke.arthur.udari();
  }
}

function provjeriGobline() {
  for (let i = 0; i < Postavke.goblins.length; i++) {
    let goblin = Postavke.goblins[i];
    if (!goblin.visible) continue;

    goblin.updatePosition();

    if (Postavke.arthur.pogada(goblin)) {
      goblin.visible = false;
      GameSettings.output("Goblin je pobijeđen!");
      continue;
    }

    if (Postavke.arthur.touching(goblin)) {
      ostetiIgraca(goblin);
    }
  }
}

function ostetiIgraca(goblin) {
  if (Postavke.arthur.steta > 0) return;

  Postavke.arthur.zivoti--;
  Postavke.arthur.steta = Postavke.stetaPauza;
  Postavke.arthur.velocity_y = -18;

  if (Postavke.arthur.x < goblin.x) {
    Postavke.arthur.velocity_x = -12;
  } else {
    Postavke.arthur.velocity_x = 12;
  }

  GameSettings.output("Goblin te oštetio. Životi: " + Postavke.arthur.zivoti, true);

  if (Postavke.arthur.zivoti <= 0) {
    restartLevela("Nemaš više života.");
  }
}

function provjeriCilj() {
  if (Postavke.cilj != null && Postavke.arthur.touching(Postavke.cilj)) {
    zavrsiLevel();
  }
}

function provjeriNakonFizike() {
  if (Postavke.arthur == null) return;

  // Ako upadne u rupu, framework ga zaustavi na dnu mape, zato dno mape koristimo kao smrt.
  if (Postavke.arthur.bottom >= GAME.activeWorldMap.heightPx - 1) {
    restartLevela("Pao si u rupu.");
  }
}

function restartLevela(razlog) {
  GameSettings.output(razlog + " Level se ponavlja.", true);
  setupLevel();
}

function zavrsiLevel() {
  if (GAME.activeWorldMap.name == "level1") {
    GameSettings.output("Cilj skupljen! Prelazak na level2.", true);
    prebaciNaLevel("level2");
    setupLevel();
    return;
  }

  GameSettings.output("Cilj skupljen! Pobijedio si igru.", true);
  btnStop_click();
}
