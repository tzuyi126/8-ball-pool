var loadingLabel,progressBar;

var loadState = {
    preload: function () {
        // Add a 'loading...' label on the screen
        game.add.image(0,0,'menuBack');

        loadingLabel = game.add.text(game.width / 2, 250,
            'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        progressBar = game.add.sprite(game.width / 2, 300, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        // Load all game assets
        /*
        game.load.image('player', 'img/bar.png');
        game.load.image('enemy', 'img/bar.png');
        game.load.image('coin', 'img/bar.png');
        game.load.image('wallV', 'img/bar.png');
        game.load.image('wallH', 'img/bar.png');
        */
       // Load a new asset that we will use in the menu state
        game.load.image('menuTitle', 'img/menuTitle.png');
        game.load.image('8ballpool', 'img/8ballpool.png');
    },
    create: function () {
        // Go to the menu state
        //game.state.start('menu');
    },
    update: function(){
        if(loadingLabel.alpha>0){
            loadingLabel.alpha -= 0.01;
            progressBar.alpha -= 0.01;
        }
        else{
            game.state.start('menu');
        }
    }
}; 