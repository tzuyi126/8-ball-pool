var playState = {
    create: function () {
        game.stage.backgroundColor = "black";
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.table=game.add.sprite(game.width/2,game.height/2,'table');
        this.table.anchor.setTo(0.5,0.5);
    
        this.ball=[];
        this.ball[0]=game.add.sprite(game.width/4+70,game.height/2,'whiteball');
        this.ball[0].anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(this.ball[0]);


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