var overState = {
    preload: function(){
        game.load.spritesheet('button', 'img/button_sprite_sheet.png', 193, 71);
    },

    create: function() {
        //background
        game.add.image(0,0,'menuBack');

        // logo
        var logoimg = game.add.image(game.width/2, game.height/2-150, 'menuTitle');
        logoimg.anchor.setTo(0.5,0.5);

        // SPACE
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(this.start, this);

        // BUTTON
        var button = game.add.button(game.width/2, game.height-80, 'button', this.start, this, 0, 1);
        button.anchor.setTo(0.5, 0.5);
    },
    start: function() {
        game.state.start('menu');
    },
};