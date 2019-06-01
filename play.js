var playState = {
    preload: function () { }, // The proload state does nothing now.
    create: function () {
        // Removed background color, physics system, and roundPixels.
        // replace 'var score = 0' by global score variable.
        game.global.score = 0;
        // The following part is the same as in previous lecture.
        this.walls = game.add.group();
}
}; 