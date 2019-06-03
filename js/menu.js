var title,startLabel;

var menuState = {
    preload: function(){
        
    },
    create: function () {
        // Add a background image
        game.add.image(0, 0, 'menuBack');
        
        title = game.add.image(game.width/2, game.height/2-100, 'menuTitle');
        title.anchor.setTo(0.5,0.5);
        title.alpha = 0;
        
        // Explain how to start the game
        startLabel = game.add.text(game.width/2,game.height/2+200,
            'PRESS SPACE TO START', { font: '18px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        startLabel.alpha = 0;
        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start'
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.start, this);
    },
    update: function() {
        if(title.alpha<1){
            title.alpha += 0.05;
            startLabel.alpha += 0.05;
        }

        
        game.input.mouse.capture = true;
        if(game.input.activePointer.leftButton.isDown){
            this.start();
        }
    },
    start: function () {
        // Start the actual game
        game.state.start('guide');
    },
}; 