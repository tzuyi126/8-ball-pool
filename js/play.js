var stick_x,stick_y;
var input_x,input_y;
var customBounds;

var playState = {
    create: function () {
        game.stage.backgroundColor = "black";

        //  The bounds of our physics simulation
        var bounds = new Phaser.Rectangle(100, 100, 400, 400);

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.physics.p2.restitution = 0.9;

        var table=game.add.sprite(game.width/2,game.height/2,'table');
        table.anchor.setTo(0.5,0.5);
    
        // white ball
        this.whiteball=game.add.sprite(game.width/4+70,game.height/2,'whiteball');
        //this.whiteball.anchor.setTo(0.5,0.5);
        
        game.physics.p2.enable(this.whiteball);
        this.whiteball.body.setCircle(25);
        
        //stick
        this.stick = game.add.sprite(this.whiteball.x,this.whiteball.y,'stick');
        this.stick.anchor.setTo(1.1,0.5);
        this.stick.rotation = 0;
        
        //game.physics.p2.enable(this.stick);
        //this.stick.body.setCircle(0.1);

        //stick power
        this.power = 0;
        this.isShooting = false;

        //  Create a new custom sized bounds, within the world bounds
        customBounds = { left: null, right: null, top: null, bottom: null };

        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(0, 0, bounds.width, bounds.height);

        
        // MOUSE
        game.input.mouse.capture = true;
        // SPACE
        var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //space.onDown.add(this.start, this);
    },
    update: function(){
        // memorize stick_x stick_y
        game.input.onDown.add(Memorize, this);

        if(game.input.activePointer.leftButton.isDown && !this.isShooting){
            this.power = increasePower(this.power);
            if(this.power<600){
                this.stick.anchor.x += 0.01;  
            }
        }
        else if(this.power>0){
            this.isShooting = true;
            this.stick.anchor.x = 1.048;
            this.power -= 10;
            this.whiteball.body.velocity.x = this.power*Math.cos(this.stick.rotation); 
            this.whiteball.body.velocity.y = this.power*Math.sin(this.stick.rotation);
        }
        else{
            this.whiteball.body.velocity.x = 0; 
            this.whiteball.body.velocity.y = 0;
            this.isShooting = false;
            this.stick.position.setTo(this.whiteball.x,this.whiteball.y);
            this.stick.anchor.setTo(1.1,0.5);
        }

        
        var opposite = game.input.y - this.stick.position.y;
        var adjacent = game.input.x - this.stick.position.x;
        if(!this.isShooting){
            this.stick.rotation = Math.atan2(opposite,adjacent);
        }
        
    },

    start: function() {
        game.state.start('over');
    }
}; 

function createPreviewBounds(x, y, w, h) {

    var sim = game.physics.p2;

    //  If you want to use your own collision group then set it here and un-comment the lines below
    var mask = sim.boundsCollisionGroup.mask;

    customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
    customBounds.left.addShape(new p2.Plane());
    // customBounds.left.shapes[0].collisionGroup = mask;

    customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
    customBounds.right.addShape(new p2.Plane());
    // customBounds.right.shapes[0].collisionGroup = mask;

    customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
    customBounds.top.addShape(new p2.Plane());
    // customBounds.top.shapes[0].collisionGroup = mask;

    customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
    customBounds.bottom.addShape(new p2.Plane());
    // customBounds.bottom.shapes[0].collisionGroup = mask;

    sim.world.addBody(customBounds.left);
    sim.world.addBody(customBounds.right);
    sim.world.addBody(customBounds.top);
    sim.world.addBody(customBounds.bottom);

}

function Memorize(){
    stick_x = this.stick.x;
    stick_y = this.stick.y;
    input_x = game.input.x;
    input_y = game.input.y;
}

function increasePower(power){
    if(power<1000)
        power += 20;
    return power;
}