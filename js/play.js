var playState = {
    preload: function () {

    },
    create: function () {
        // SPACE
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.start, this);
    },
    update: function(){
        game.input.mouse.capture = true;
        if(game.input.activePointer.leftButton.isDown){
            this.start();
        }
    },
    start: function() {
        game.state.start('over');
    }
}; 