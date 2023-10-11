const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

class Sprite {
  constructor({ position, velocity, color = "blue", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      height: 50,
      width: 100,
    };
    this.isAttacking;
    this.height = 150;
    this.width = 50;
    this.lastKey;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      c.fillStyle = "brown";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //gravity
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 50,
    y: 0,
  },
  color: "red",
});

//keys and movement
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
  l: {
    pressed: false,
  },
};

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -10;
      break;
    case "s":
      player.attack();
      break;

    case "j":
      keys.j.pressed = true;
      enemy.lastKey = "j";
      break;
    case "l":
      keys.l.pressed = true;
      enemy.lastKey = "l";
      break;
    case "i":
      enemy.velocity.y = -10;
      break;
    case "k":
      enemy.attack();
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "j":
      keys.j.pressed = false;
      break;
    case "l":
      keys.l.pressed = false;
      break;
    case "k":
      keys.l.pressed = false;
      break;
  }
  console.log(event.key);
});

function animate() {
  window.requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  // player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }
  //enemy movement
  enemy.velocity.x = 0;
  if (keys.j.pressed && enemy.lastKey === "j") {
    enemy.velocity.x = -5;
  } else if (keys.l.pressed && enemy.lastKey === "l") {
    enemy.velocity.x = 5;
  }
  //detect collision
  if (collision(player, enemy) && player.isAttacking) {
    player.isAttacking = false;
    enemy.velocity.x = 50;
    console.log("HIT");
  }
  if (collision(enemy, player) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.velocity.x = -50;
    console.log("ENEMY HIT");
  }
}
animate();

function collision(rectangle1, rectangle2) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
