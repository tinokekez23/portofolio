class Postavke {

  constructor() {
    if (this instanceof Postavke) {
      throw new Error("Statička klasa nema instance!");
    }
  }

  /** @type {Arthur} */
  static arthur = null;

  /** @type {Goal} */
  static cilj = null;

  /** @type {Goblin[]} */
  static goblins = [];

  static leveli = ["level1", "level2"];
  static zivotiNaPocetku = 3;
  static stetaPauza = 35;

  static random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
