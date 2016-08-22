

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

// This is where we can load assets.
// This function runs before the game is created.
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms;
var score = 0;
var scoreText;

// This is where we can add assets to the game canvas.
// This function runs when the game is being created.
function create() {
    // We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    game.add.sprite(0, 0, 'sky');

    // The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    // We will enable physics for any object that is created in this group
    platforms.enableBody = true;


    // Here we create the ground and add it to the group.
    // Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // This stops it from falling away when you jump on it
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    // Now let's create two ledges
    var ledge1 = platforms.create(400, 400, 'ground');
    ledge1.body.immovable = true;

    var ledge2 = platforms.create(-150, 250, 'ground');
    ledge2.body.immovable = true;




    // Les't create out player 1
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    // Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    // Starshine Group
    stars = game.add.group();

    // We will enable physics
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 10;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }


    // Keep the score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}


function update() {
    // Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    // Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -150; //  Move to the left
        player.animations.play('left');
    }

    else if (cursors.right.isDown) {
        player.body.velocity.x = 150; //  Move to the right
        player.animations.play('right');
    }

    else {
        player.animations.stop(); //  Stand still
        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }


    // game.physics.arcade.collide(stars, platforms);

    // We will also check to see if the player overlaps
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    game.physics.arcade.overlap(stars, platforms, missedStar, null, this);
}

var collectStar = function (player, star) {
    star.kill(); // Removes the star from the screen

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}

var missedStar = function(star, platforms) {
    //star.body.velocity.y = 0;
    star.kill(); // Removes the star from the screen
}
