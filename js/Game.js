class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.LeaderBoardTitle = createElement("h2");
    this.Leader1 = createElement("h2");
    this.Leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    // C38 TA
    fuels = new Group();
    powerCoins = new Group();
    obs1 = new Group();
    obs2 = new Group();

    // Adding fuel sprite in the game
    this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    this.addSprites(obs1, 10, obs1IMG, 0.05);
    this.addSprites(obs2, 10, obs2IMG, 0.05);
  }

  // C38 TA
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 300, width / 2 - 300);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 250, 130);

    this.LeaderBoardTitle.html("Leaderboard");
    this.LeaderBoardTitle.class("resetText");
    this.LeaderBoardTitle.position(width / 2 - 350, 40);

    this.Leader1.class("leadersText");
    this.Leader1.position(width / 2 - 350, 80);

    this.Leader2.class("leadersText");
    this.Leader2.position(width / 2 - 350, 120);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.ShowLeaderBoard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        // C38  SA
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
          this.handleFuel(index);
          this.handlePowerCoins(index);
        }
      }

      // handling keyboard events
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function (collector, collected) {
      player.score += 20;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: {},
      });
      window.location.reload();
    });
  }
  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
    }
  }
  ShowLeaderBoard() {
    var myLeader1, myLeader2;
    var myplayers = Object.values(allPlayers);
    console.log(myplayers[0]);
    //myplayers [0] means its first player data,myplayers [1] means its second player data
    if (
      (myplayers[0].rank === 0 && myplayers[1].rank === 0) ||
      myplayers[0].rank === 1
    ) {
      myLeader1 =
        myplayers[0].rank +
        "&emsp;" +
        myplayers[0].name +
        "&emsp;" +
        myplayers[0].score;
      myLeader2 =
        myplayers[1].rank +
        "&emsp;" +
        myplayers[1].name +
        "&emsp;" +
        myplayers[1].score;
    }

    if (myplayers[1].rank === 1) {
      myLeader1 =
        myplayers[1].rank +
        "&emsp;" +
        myplayers[1].name +
        "&emsp;" +
        myplayers[1].score;
      myLeader2 =
        myplayers[0].rank +
        "&emsp;" +
        myplayers[0].name +
        "&emsp;" +
        myplayers[0].score;
    }
    this.Leader1.html(myLeader1);
    this.Leader2.html(myLeader2);
  }
}
