// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // Load the bird sprite
        // game.load.image('bird', '/static/assets/transparent.png'); 
        game.load.image('bird', BIRD_SPRITE);
        game.load.image('pipe', '/static/assets/pipe.png');
        this.CANVAS_WIDTH = game.width
        this.CANVAS_HEIGHT = game.height
        this.BIRD_SPEED = 0.2025 * game.width

        let socket = io()
        socket.emit('message', 'Start Game')
        this.socket = socket

        // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },
    
    create: function() { 

        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';
    
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(0, 0, 'bird');
        this.bird.width = 35
        this.bird.height = 35
    
        // Add physics to the bird
        game.physics.arcade.enable(this.bird);

        //Remove gravity for the bird
        this.bird.body.gravity.y = 0;  
        
        //Initialize controllable keys
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.pipes = game.add.group(); 

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "40px Arial", fill: "#ffffff" });   

        this.rail();
    },

    update: function() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0)
            this.bird.y = 0;
        if (this.bird.y > game.height-this.bird.body.height)
            this.bird.y = game.height-this.bird.body.height
        if (this.bird.x < 0)
            this.bird.x = 0;
        if (this.bird.x > game.width-this.bird.body.width)
            this.bird.x = game.width-this.bird.body.width;

        
        this.bird.body.velocity.x = 0;
        this.bird.body.velocity.y = 0;

        if (this.railing) {
            return;
        }

        if (this.upKey.isDown && this.rightKey.isDown) {
            this.moveUpRight();
        }

        else if (this.upKey.isDown && this.leftKey.isDown) {
            this.moveUpLeft();
        }

        else if (this.downKey.isDown && this.rightKey.isDown) {
            this.moveDownRight();
        }

        else if (this.downKey.isDown && this.leftKey.isDown) {
            this.moveDownLeft();
        }

        else if (this.downKey.isDown) {
            this.moveDown();
        }
    
        else if (this.upKey.isDown) {
            this.moveUp();
        }
        
        else if (this.leftKey.isDown) {
            this.moveLeft();
        }

        else if (this.rightKey.isDown) {
            this.moveRight();
        }

        else {
            this.stop();
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

    },


    moveRight: function() {
        this.bird.body.velocity.x = this.BIRD_SPEED
        this.socket.emit('message', '1')
    },

    moveLeft: function() {
        this.bird.body.velocity.x = -this.BIRD_SPEED
        this.socket.emit('message', '2')

    },

    moveUp: function() {
        this.bird.body.velocity.y = -this.BIRD_SPEED
        this.socket.emit('message', '3')
    },

    moveDown: function() {
        this.bird.body.velocity.y = this.BIRD_SPEED
        this.socket.emit('message', '4')  
    },

    moveUpRight: function() {
        this.bird.body.velocity.x = this.BIRD_SPEED
        this.bird.body.velocity.y = -this.BIRD_SPEED
        this.socket.emit('message', '5')
    },

    moveUpLeft: function() {
        this.bird.body.velocity.x = -this.BIRD_SPEED
        this.bird.body.velocity.y = -this.BIRD_SPEED
        this.socket.emit('message', '6')
    },

    moveDownRight: function() {
        this.bird.body.velocity.x = this.BIRD_SPEED
        this.bird.body.velocity.y = this.BIRD_SPEED
        this.socket.emit('message', '7')
    },

    moveDownLeft: function() {
        this.bird.body.velocity.x = -this.BIRD_SPEED
        this.bird.body.velocity.y = this.BIRD_SPEED
        this.socket.emit('message', '8')
    },

    stop: function() {
        this.socket.emit('message', '0')   
    },

    rail: function() {
        this.railing = true
        // this.socket.emit('message', '2')
        // this.labelScore.text = "Calibrating..."
        // setTimeout( () => {
        //     this.socket.emit('message', '3')
        //     setTimeout ( () => {
        //         this.socket.emit('message', '0')
        //         this.railing = false
        //         this.timer = game.time.events.loop(3000, this.addRowOfPipes, this); 
        //         this.labelScore.text = "Begin!"
        //     }, 5000)
        // }, 5000)   
        
        this.socket.emit('message', '6')
        this.labelScore.text = "Calibrating..."
        setTimeout( () => {
            this.socket.emit('message', '0')
            this.railing = false
            this.timer = game.time.events.loop(3000, this.addRowOfPipes, this); 
            this.labelScore.text = "Begin!"
        }, 5000)        
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
    
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
    
        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);
    
        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -(0.25 * game.width); 
    
        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 10
        // This will be the hole position
        var hole = Math.floor(Math.random() * 6) + 1;
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 16; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(game.width, i * 60 + 20);  
                
        this.score += 1;
        this.labelScore.text = this.score;  
    },   

};

window.onresize = (e) => {
    let size = Math.min(window.innerWidth, window.innerHeight) * 0.9
    game.scale.setGameSize(size, size)
    game.state.start('main')
}

toggleTransparent = () => {
    if (BIRD_SPRITE === '/static/assets/bird.png') {
        BIRD_SPRITE = '/static/assets/transparent.png'
    }
    else {
        BIRD_SPRITE = '/static/assets/bird.png'
    }
    game.state.start('main')
    console.log("toggling")
}


let BIRD_SPRITE = '/static/assets/bird.png'

let size = Math.min(window.innerWidth, window.innerHeight) * 0.9

let game = new Phaser.Game(size, size);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');

window.onload = () => {
    document.getElementById("transparent-mode").onclick = toggleTransparent
}


