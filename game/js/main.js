window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create , update: update, render: render });
    function preload () {
        game.load.image('background', 'game/images/background.png');
  		
  		game.load.atlas('bucket', 'game/images/bucket_sprite.png', 'game/images/bucket_sprite.json');
        game.load.image('glass', 'game/images/bottle.png');
        game.load.image('paper', 'game/images/paper.png');
        game.load.image('alu', 'game/images/can.png');
    }

  	var bucket;
	var garbageGroup;
	var cursors;
	var score = 0;
	var scoreText;
	var BucketType = {
		PAPER: 'paper',
		GLASS: 'glass',
		PLASTICS: 'plastics',
		ALUMINIUM: 'alu'
	};

	var BucketKeys = {
		paper: null,
		glass: null,
		plastics: null,
		aluminium: null
	};

	var waveIndex = 0;
	var waveMatrix = [
		[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];

	function create() {
		game.add.sprite(0, 0, 'background');
	    game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.setImpactEvents(true);
		game.physics.p2.defaultRestitution = 1.0;
		game.physics.p2.gravity.y = 100;
		 //  Turn on impact events for the world, without this we get no collision callbacks
	    game.physics.p2.setImpactEvents(true);

	  //  game.physics.p2.restitution = 0.1;

	    //  Create our collision groups. One for the player, one for the pandas
	    var bucketCollisionGroup = game.physics.p2.createCollisionGroup();
	    var garbageCollisionGroup = game.physics.p2.createCollisionGroup();

	    
	    game.stage.backgroundColor = '#66CCFF';

	    garbageGroup = game.add.group();
	    garbageGroup.enableBody = true;
    	garbageGroup.physicsBodyType = Phaser.Physics.P2JS;

		garbageGroup.createMultiple(50, 'paper', 0, false);
	    garbageGroup.createMultiple(50, 'glass', 0, false);
	    garbageGroup.createMultiple(50, 'alu', 0, false);

	   	game.physics.p2.enable(garbageGroup, false);
	   	for (var i = garbageGroup.length - 1; i >= 0; i--) {
	   	
	   		garbageGroup.getAt(i).body.setCollisionGroup(garbageCollisionGroup);
	   		
        	garbageGroup.getAt(i).body.collides([bucketCollisionGroup]);
       
	   	};
	   	

	    bucket = game.add.sprite(300, 600, 'bucket', 'bucket_paper.png');
	    bucket.type = BucketType.PAPER;

		game.physics.p2.enable(bucket);
		bucket.body.setZeroDamping();
		bucket.body.fixedRotation = true;
		bucket.body.data.gravityScale = 0;
    
	    bucket.body.setCollisionGroup(bucketCollisionGroup);

   		bucket.body.collides(garbageCollisionGroup, collisionHandler, this);
   		
	    cursors = game.input.keyboard.createCursorKeys();
	     
	    BucketKeys.paper  = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    	BucketKeys.paper.onDown.add(setPaperBucket, this);
    	BucketKeys.glass  = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    	BucketKeys.glass.onDown.add(setGlassBucket, this);
    	BucketKeys.plastics  = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    	BucketKeys.plastics.onDown.add(setPlasticsBucket, this);
    	BucketKeys.aluminium  = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    	BucketKeys.aluminium.onDown.add(setAluminiumBucket, this);

	    game.time.events.loop(400, throwGarbage, this);

	   scoreText = game.add.text(16, 16, 'Score: ' + score, { font: '18px Arial', fill: '#ffffff' });

	}

	function setPaperBucket () {
    	bucket.type = BucketType.PAPER;
    	bucket.frameName = 'bucket_paper.png';
	}

	function setGlassBucket () {
    	bucket.type = BucketType.GLASS;
    	bucket.frameName = 'bucket_glass.png';
	}

	function setPlasticsBucket () {
    	bucket.type = BucketType.PLASTICS;
    	bucket.frameName = 'bucket_plastics.png';
	}

	function setAluminiumBucket () {
    	bucket.type = BucketType.ALUMINIUM;
    	bucket.frameName = 'bucket_alu.png';
	}

	function throwGarbage() {

		var wave = waveMatrix[waveIndex];
		for (var i = 0; i < wave.length; i++) {
			var garbage;
			var property;

			if(wave[i] == 0) {
				continue;
			} else if(wave[i] == 1) {
				property = 'paper'
			} else if(wave[i] == 2) {
				property = 'glass'
			} else if(wave[i] == 3) {
				property = 'alu'
			}

			while(!garbage || 
				garbage.exists ||
				garbage.key != property) {
					garbage = garbageGroup.next();
			}
			    
			garbage.frame = game.rnd.integerInRange(0,6);
			garbage.exists = true;
			delete garbage.collided;
			        //garbage.reset(game.world.randomX, 0);
			garbage.reset(800/wave.length*i, 0);
			
		};
		if(waveIndex < waveMatrix.length-1) {
			waveIndex++;	
		} else {
			waveIndex = 0;
		}
	    

	}

	function collisionHandler (bucket, garbage) {
    	if (garbage.x + garbage.sprite.width*3/2 >= bucket.x && (garbage.x + garbage.sprite.width*3/2 <= bucket.x + bucket.sprite.width)) {
    		garbage.sprite.kill();
			if(!garbage.sprite.collided) {
    			garbage.sprite.collided = true;
    			if(bucket.sprite.type == garbage.sprite.key) {
    				score++;
    				bucket.sprite.frameName = 'bucket_'+bucket.sprite.type+"1.png";

    			} else {
    				score--;	

    				bucket.sprite.frameName = 'bucket_'+bucket.sprite.type+".png";
    			}
    			
    			scoreText.setText("Score: " + score);
			}
        	return true;
	    } else {
	    	return false;
	    }

	}

	function update() {

    	bucket.body.setZeroVelocity();
    	bucket.body.y = 532;

	    if (cursors.left.isDown && bucket.body.x - bucket.width/2>0)
	    {
	        bucket.body.moveLeft(400);          
	    }
	    else if (cursors.right.isDown && bucket.body.x+bucket.width/2<800)
	    {
	        bucket.body.moveRight(400);
           
	    }

	    garbageGroup.forEachAlive(checkBounds, this);
	}

	function checkBounds(garbage) {
	    if (garbage.y > 600) {
	        garbage.kill();
	        delete garbage.collided;
	    }
	}

	function render() {
		game.debug.body(bucket);
	}
};