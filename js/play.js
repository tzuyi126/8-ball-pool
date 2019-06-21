var customBounds;
var bounds;
var dir = 1;
var blueLeft = 7;
var redLeft = 7;
var turn;//blue false red true
var playerIsSet = false;
var textDisplayed = false;
var playState = {

    create: function () {
        this.add.image(12, 20, 'table');
        this.bgmusic=game.add.audio('bgmusic');
        this.bgmusic.play();

        bounds = new Phaser.Rectangle(50, 57, 925, 475);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0.9;

        this.collidesound=game.add.audio('collide');
        this.goalsound=game.add.audio('goal');

        balls = game.add.physicsGroup(Phaser.Physics.P2JS);

        this.whiteball = balls.create(bounds.x + bounds.width / 4 + 5, bounds.y + bounds.height / 2, 'whiteball');
        this.whiteball.anchor.setTo(0.5, 0.5);
        this.whiteball.body.setCircle(12.5);

        this.blueball = [];
        this.redball = [];
        this.redcount = 0;
        this.bluecount = 0;
        this.j = 0;

        for (var i = 0; i <= this.j; i++) {
            var red_or_blue = game.rnd.pick([0, 1]);

            if (this.j == 2 && i == 1) {
                this.blackball = balls.create(740 + this.j * 25, 293 - 12.5 * this.j + 25 * i, 'blackball');//800,293
                this.blackball.anchor.setTo(0.5, 0.5);
                this.blackball.body.setCircle(12.5);

            } else if (this.j == 4 && i == 0) {
                this.redball[6] = balls.create(740 + this.j * 25, 293 - 12.5 * this.j + 25 * i, 'redball');
                this.redball[6].anchor.setTo(0.5, 0.5);
                this.redball[6].body.setCircle(12.5);

            } else if (this.j == 4 && i == 4) {
                this.blueball[6] = balls.create(740 + this.j * 25, 293 - 12.5 * this.j + 25 * i, 'blueball');
                this.blueball[6].anchor.setTo(0.5, 0.5);
                this.blueball[6].body.setCircle(12.5);

            } else {
                if ((this.redcount < 6 && red_or_blue == 0) || this.bluecount == 6) {

                    this.redball[this.redcount] = balls.create(740 + this.j * 25, 293 - 12.5 * this.j + 25 * i, 'redball');
                    this.redball[this.redcount].anchor.setTo(0.5, 0.5);
                    this.redball[this.redcount].body.setCircle(12.5);
                    this.redcount += 1;
                } else if (this.bluecount < 6 && red_or_blue == 1 || this.redcount == 6) {
                    this.blueball[this.bluecount] = balls.create(740 + this.j * 25, 293 - 12.5 * this.j + 25 * i, 'blueball');
                    this.blueball[this.bluecount].anchor.setTo(0.5, 0.5);
                    this.blueball[this.bluecount].body.setCircle(12.5);
                    this.bluecount += 1;
                }
            }
            if (i == this.j) {
                this.j += 1;
                i = -1;
            }
            if (this.j == 5) break;

        }


        customBounds = { left: null, right: null, top: null, bottom: null };
        this.createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //stick
        this.stick = game.add.sprite(this.whiteball.x, this.whiteball.y, 'stick');
        this.stick.anchor.setTo(1.1, 0.5);
        this.stick.rotation = 0;

        //stick power
        this.power = 0;

        this.text = game.add.text(game.width/2, game.height / 2-120, 'You are REDBALL player!', { font: '28px Arial', fill: 'white', align: "center" });
        this.text.alpha = 0;
        this.text.anchor.setTo(0.5, 0.5);

        //  Just to display the bounds
        // var graphics = game.add.graphics(bounds.x, bounds.y);
        // graphics.lineStyle(4, 0xffd900, 1);
        // graphics.drawRect(0, 0, bounds.width, bounds.height);

        // MOUSE
        game.input.mouse.capture = true;
    },
    createPreviewBounds: function (x, y, w, h) {

        var sim = game.physics.p2;

        //  If you want to use your own collision group then set it here and un-comment the lines below
        var mask = sim.boundsCollisionGroup.mask;

        customBounds.left = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y)], angle: 1.5707963267948966 });
        customBounds.left.addShape(new p2.Plane());
        // customBounds.left.shapes[0].collisionGroup = mask;

        customBounds.right = new p2.Body({ mass: 0, position: [sim.pxmi(x + w), sim.pxmi(y)], angle: -1.5707963267948966 });
        customBounds.right.addShape(new p2.Plane());
        // customBounds.right.shapes[0].collisionGroup = mask;

        customBounds.top = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y)], angle: -3.141592653589793 });
        customBounds.top.addShape(new p2.Plane());
        // customBounds.top.shapes[0].collisionGroup = mask;

        customBounds.bottom = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y + h)] });
        customBounds.bottom.addShape(new p2.Plane());
        // customBounds.bottom.shapes[0].collisionGroup = mask;

        sim.world.addBody(customBounds.left);
        sim.world.addBody(customBounds.right);
        sim.world.addBody(customBounds.top);
        sim.world.addBody(customBounds.bottom);

    },
    update: function () {
        this.checkEnd();

        var moving = this.checkmoving();

        // check goal
        var uselsee = this.checkGoal(this.whiteball);
        useless = this.checkGoal(this.blackball);
        for (var i = 0; i < 7; i++) {
            if (this.blueball[i].alive) {
                blueLeft -= 1;
                this.bluePotted = this.checkGoal(this.blueball[i]);
                if(this.bluePotted && !playerIsSet){
                    playerIsSet = true;
                    turn = false;
                }
            }
        }
        for (var i = 0; i < 7; i++) {
            if (this.redball[i].alive) {
                redLeft -= 1;
                this.redPotted = this.checkGoal(this.redball[i]);
                if(this.redPotted && !playerIsSet){
                    playerIsSet = true;
                    turn = true;
                }
            }
        }
        this.PIStext();

        if (game.input.activePointer.leftButton.isDown && moving == 0) {
            if (this.whiteball.alive) {
                if (dir == 1) {
                    if (this.power == 2000) dir = 0;
                        this.power += 20;
                        this.stick.anchor.x += 0.004;
                } else {
                    if (this.power == 0) dir = 1;
                        this.power -= 20;
                        this.stick.anchor.x -= 0.004;
                }
            }
        } else {
            if (!this.whiteball.alive && moving == 0) {
                this.whiteball.reset(bounds.x + bounds.width / 4 + 5, bounds.y + bounds.height / 2);
            }
            this.ballmoving();
        }

        var opposite = game.input.y - this.stick.position.y;
        var adjacent = game.input.x - this.stick.position.x;
        if (moving == 0) {
            this.stick.rotation = Math.atan2(opposite, adjacent);
            this.stick.x = this.whiteball.x;
            this.stick.y = this.whiteball.y;
            this.stick.alpha = 1;
        }

    },
    checkmoving: function () {
        if (this.whiteball.alive) {
            if (this.whiteball.body.velocity.x != 0 || this.whiteball.body.velocity.y != 0) return 1;
        }
        if (this.blackball.alive) {
            if (this.blackball.body.velocity.x != 0 || this.blackball.body.velocity.y != 0) return 1;
        }

        for (var i = 0; i < 7; i++) {
            if (this.blueball[i].alive) {
                if (this.blueball[i].body.velocity.x != 0 || this.blueball[i].body.velocity.y != 0) return 1;
            }
        }
        for (var i = 0; i < 7; i++) {
            if (this.redball[i].alive) {
                if (this.redball[i].body.velocity.x != 0 || this.redball[i].body.velocity.y != 0) return 1;
            }
        }

        return 0;
    },
    ballmoving: function () {
        var moving = this.checkmoving();

        if (moving == 0) {
            this.whiteball.body.velocity.x = this.power * Math.cos(this.stick.rotation);
            this.whiteball.body.velocity.y = this.power * Math.sin(this.stick.rotation);
            if(this.power!=0){
                this.collidesound.play();
            }
            this.power = 0;
            this.stick.anchor.x = 1.048;
        }
        else {
            //whiteball move when alive
            this.stick.alpha -= 0.02;
            if (this.whiteball.alive) {
                if (this.stopSensor(this.whiteball) == 1) {
                    this.whiteball.body.velocity.x = 0;
                    this.whiteball.body.velocity.y = 0;
                }
                if (Math.abs(this.whiteball.body.velocity.x) > 0) {
                    this.whiteball.body.velocity.x *= 0.99;
                } else {
                    this.whiteball.body.velocity.x = 0;
                }
                if (Math.abs(this.whiteball.body.velocity.y) > 0) {
                    this.whiteball.body.velocity.y *= 0.99;
                } else {
                    this.whiteball.body.velocity.y = 0;
                }
            }
            // blackball
            if (this.blackball.alive) {
                if (this.stopSensor(this.blackball) == 1) {
                    this.blackball.body.velocity.x = 0;
                    this.blackball.body.velocity.y = 0;
                }
                if (Math.abs(this.blackball.body.velocity.x) > 0) {
                    this.blackball.body.velocity.x *= 0.99;
                } else {
                    this.blackball.body.velocity.x = 0;
                }
                if (Math.abs(this.blackball.body.velocity.y) > 0) {
                    this.blackball.body.velocity.y *= 0.99;
                } else {
                    this.blackball.body.velocity.y = 0;
                }
            }

            //blueball
            for (var i = 0; i < 7; i++) {
                if (this.blueball[i].alive) {
                    if (this.stopSensor(this.blueball[i]) == 1) {
                        this.blueball[i].body.velocity.x = 0;
                        this.blueball[i].body.velocity.y = 0;
                    }
                    if (Math.abs(this.blueball[i].body.velocity.x) > 0) {
                        this.blueball[i].body.velocity.x *= 0.99;
                    } else {
                        this.blueball[i].body.velocity.x = 0;
                    }
                    if (Math.abs(this.blueball[i].body.velocity.y) > 0) {
                        this.blueball[i].body.velocity.y *= 0.99;
                    } else {
                        this.blueball[i].body.velocity.y = 0;
                    }
                }
            }
            //redball
            for (var i = 0; i < 7; i++) {
                if (this.redball[i].alive) {
                    if (this.stopSensor(this.redball[i]) == 1) {
                        this.redball[i].body.velocity.x = 0;
                        this.redball[i].body.velocity.y = 0;
                    }
                    if (Math.abs(this.redball[i].body.velocity.x) > 0) {
                        this.redball[i].body.velocity.x *= 0.99;
                    } else {
                        this.redball[i].body.velocity.x = 0;
                    }
                    if (Math.abs(this.redball[i].body.velocity.y) > 0) {
                        this.redball[i].body.velocity.y *= 0.99;
                    } else {
                        this.redball[i].body.velocity.y = 0;
                    }
                }
            }
        }
    },
    ballspeedsqr: function (x, y) {
        return Math.pow(x, 2) * Math.pow(y, 2);
    },
    stopSensor: function (ball) {
        var vx = ball.body.velocity.x;
        var vy = ball.body.velocity.y;
        //console.log(this.ballspeedsqr(vx, vy));
        if (this.ballspeedsqr(vx, vy) < 10000) {
            return 1;
        } else return 0;
    },
    checkGoal: function (ball) {
        var dis = 18;
        var disable = 0;
        if (Math.abs(ball.x - bounds.x) <= dis + 11 && Math.abs(ball.y - bounds.y) <= dis + 11) {
            disable = 1;
        }
        else if (Math.abs(ball.x - bounds.x - bounds.width) <= dis + 11 && Math.abs(ball.y - bounds.y) <= dis + 11) {
            disable = 1;
        }
        else if (Math.abs(ball.x - bounds.x - bounds.width) <= dis + 11 && Math.abs(ball.y - bounds.y - bounds.height) <= dis + 11) {
            disable = 1;
        }
        else if (Math.abs(ball.x - bounds.x) <= dis + 11 && Math.abs(ball.y - bounds.y - bounds.height) <= dis + 11) {
            disable = 1;
        }
        else if (Math.abs(ball.x - bounds.x - bounds.width / 2) <= dis && Math.abs(ball.y - bounds.y) <= dis) {
            disable = 1;
        }
        else if (Math.abs(ball.x - bounds.x - bounds.width / 2) <= dis && Math.abs(ball.y - bounds.y - bounds.height) <= dis) {
            disable = 1;
        }

        if (disable == 1) {
            ball.kill();
            this.goalsound.play();
            return true;
        }
        return false;
    },
    checkEnd: function () {
        var moving = this.checkmoving();
        if (!this.blackball.alive && moving == 0) game.state.start('redwin');
        //// turn false == blue turn, turn true == red turn
        // if (!turn) {
        //     if (blueLeft == 0) {
        //         if (!this.blackball.alive && moving == 0) {
        //             if (this.whiteball.alive) {
        //                 game.state.start('blueWon');
        //             } else game.state.start('redWon');
        //         }
        //     } else {
        //         if (!this.blackball.alive && moving == 0) {
        //             if (this.whiteball.alive) {
        //                 game.state.start('redWon');
        //             } else game.state.start('blueWon');
        //         }
        //     }
        // } else {
        //     if (redLeft == 0) {
        //         if (!this.blackball.alive && moving == 0) {
        //             if (this.whiteball.alive) {
        //                 game.state.start('redWon');
        //             } else game.state.start('blueWon');
        //         }
        //     } else {
        //         if (!this.blackball.alive && moving == 0) {
        //             if (this.whiteball.alive) {
        //                 game.state.start('blueWon');
        //             } else game.state.start('redWon');
        //         }
        //     }
        // }
    },
    PIStext: function(){
        // player is set text
        if(playerIsSet){
            if(textDisplayed){
                if(this.text.alpha>0){
                    this.text.alpha -= 0.005;
                }
            }
            else{
                textDisplayed = 1;
                if(!turn){
                    this.text.setText('You are BLUEBALL player!');
                    this.text.alpha = 1;
                }
                else{
                    this.text.setText('You are REDBALL player!');
                    this.text.alpha = 1;
                }
            }
        }
    }
}
