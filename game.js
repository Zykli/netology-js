'use strict';
function instanceofVector (value) {
		try { 
			if (value instanceof Vector) {
				return value;
			} else {
				throw "объект не является вектором";
			}
		} catch (Error) {alert(e)} ;
};
function instanceofActor (value) {
		try { 
			if (value instanceof Actor) {
				return value;
			} else {
				throw "объект не является вектором";
			}
		} catch (Error) {alert(e)} ;
};

var op = 1;

class Vector {
	constructor(x = 0 , y = 0) {
		this.x = x;
		this.y = y;
  	}
 	plus(elem) {
 		instanceofVector(elem);
 		this.x += elem.x;
 		this.y += elem.y;
 		return new Vector(this.x, this.y);
 	}
 	times(z) {
 		this.x = this.x * z;
 		this.y = this.y * z;
 		return this;
 	}
}

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		var position = instanceofVector(pos);
		var sizeFinal = instanceofVector(size);
		this.pos = position;
		this.size = sizeFinal;
		this.speed = instanceofVector(speed);
  	}
	get type () {return 'actor'};
	get left () {return this.pos.x};
	get right () {return this.pos.x + this.size.x};
	get top () {return this.pos.y};
	get bottom () {return this.pos.y + this.size.y};

  	isIntersect (obj) {
  		instanceofActor(obj);
  			console.log('');
			console.log(op);
			console.log('this');
			console.log(`top: ${this.top}; bottom: ${this.bottom}; left: ${this.left}; right: ${this.right}`);
			console.log('obj');
			console.log(`top: ${obj.top}; bottom: ${obj.bottom}; left: ${obj.left}; right: ${obj.right}`);
		op++;
  		if (this == obj) {
  			// console.log('сам с собой'); 
  			return false};

  		if ((obj.size.x < 0 && obj.size.y <0) ||
  			((this.top >= obj.bottom) || 
  			(this.right <= obj.left) || 
  			(this.bottom <= obj.top) || 
  			(this.left >= obj.right))) {
  			console.log('false');
  			return false;
  		} else if(((this.top <= obj.top) || 
  			(this.right >= obj.right) || 
  			(this.bottom >= obj.bottom) || 
  			(this.left <= obj.left))) {
  			console.log('true');
  			return true;
  		}
  			console.log('нет таких условий пересечения');
  	}
  	act () {}
}

class Level {
	constructor(grid, actors) {
	  	// console.log('');
	  	// console.log(actors);
		var height = 0, width = 0, player = '';
	  	if (grid instanceof Array) {
	  	  height = grid.length;
	  	  for (let i=0; i<grid.length; i++) {
	  	  	if (grid[i]) {
	  	  		if (grid[i] instanceof Array) {
		  	  		width = grid[i].length > width ? grid[i].length : width;
		  	    } else {
		  	    	width = grid[i].length;
	  	    }
	  	}
	  	  }
	  	}
	  	if (actors instanceof Array) {
	  		for (let i=0; i<actors.length; i++) {
		  	    if (actors[i].type === 'player') {
		  	      player = actors[i] ;
		  	    }
		  	}
	  	}
	  	// console.log(actors);
	  	this.grid = grid;
	  	this.height = height;
	  	this.width = width;
	  	this.status = null;
	  	this.finishDelay = 1;
	  	this.actors = actors;
	  	this.player = player;
	}
	isFinished () {
		if (this.status != null && this.finishDelay < 0) {return true};
		if (this.status != null && this.finishDelay > 0) {return false};
		return false;
	}
	actorAt (obj) {
		// 	console.log('');
		// 	console.log(op);
		// 	console.log('actorAt');
		// 	console.log('this');
		// 	console.log(this);
		// 	console.log(obj);
		// op++;
		instanceofActor(obj);

		// var qwe = new Actor();
		// console.log(qwe);
		var returnElem;
		var	tr = 0;
		if (this.actors) {
			this.actors.forEach(function (elem) {
			if (obj.isIntersect(elem)) {
				returnElem = elem;
				tr++;
			}
		});
		}
		// console.log(tr);
		if (tr > 0) {return returnElem;}
		// Вернет undefined для пустого уровня
		if (this.height == 0 && this.width == 0) {
			// console.log('undefined'); 
			return undefined};

		// Вернет undefined для уровня в котором только один движущийся объект
		if (this.actors.length == 1) {
			// console.log('undefined'); 
			return undefined};

		// Вернет undefined если ни один объект игрового поля не пересекается с переданным объектом
		if (obj.pos.x > this.width && obj.pos.y > this.height) {
			// console.log('undefined'); 
			return undefined};
		// Вернет объект игрового поля, который пересекается с переданным объектом
		
		if (obj.isIntersect(obj)) {console.log('ляляля')}
	}
	obstacleAt (position, size) {
		if (op >= 8) {
		// console.log('');
		// 	console.log(op);
		// 	console.log('this');
		// 	console.log(this.grid);
		// 	console.log('position');
		// 	console.log(position);
		// 	console.log('size');
		// 	console.log(size);
		}
		op++;
		if (position.x < 0 || position.y < 0) {
			// console.log('wall'); 
			return 'wall'};
		if (position.x + size.x > this.width) {
			// console.log('wall'); 
			return 'wall'};
		if (position.y + size.y > this.height) {
			// console.log('lava'); 
			return 'lava'};
		// console.log(0 <= position.x);
		// console.log(position.x + size.x <= this.width);
		// var newActor = new Actor(position, size);
		// 	console.log(newActor);

			for (var i = 0; i < this.grid.length; i++) {
				for (var y = 0; y < this.grid[i].length; y++) {
					if (((i == Math.floor(position.x) && y == Math.floor(position.y)) || 
						(i == Math.ceil(position.x + size.x) && y == Math.ceil(position.y + size.y))) && 
						this.grid[i][y] == 'wall') 
						{
							// console.log('wall'); 
							return 'wall'}
					if (((i == Math.floor(position.x) && y == Math.floor(position.y)) || 
						(i == Math.ceil(position.x + size.x) && y == Math.ceil(position.y + size.y))) && 
						this.grid[i][y] == 'lava') 
						{
							// console.log('lava'); 
							return 'lava'}
				}
			}


		// this.grid.forEach(function (elem) {
		// 	elem.forEach
		// })
		// if ((0 <= position.x && position.x + size.x <= this.width) &&
		// 	(0 <= position.y && position.y + size.y <= this.height))
		//   {console.log('wall'); return 'wall'};

		// return 'wall';
	}
	removeActor (obj) {
			// console.log('');
			// console.log('removeActor');
			// console.log('this');
			// console.log(this);
			// console.log('obj');
			// console.log(obj);

			// this.actors[0].type = 'coin';
			// obj.type = 'coin';

			// for (var i = 0; i < this.actors.length; i++) {
			// console.log('---');
			// 	console.log(this.actors[i]);
			// console.log('---');
			// }

			var findMass = [];

			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i].type == obj.type && this.actors[i].title == obj.title) {
					findMass.push(i);
				}
			}
			// console.log(findMass);

			for (var i = 0; i < findMass.length; i++) {
				this.actors.splice(findMass[i], 1);
				// delete this.actors[findMass[i]];
				// this.actors.length -= 1;
			}

			// findMass.map(function(elem) {
			// 	console.log(elem);
			// 	delete this.actors[elem];
			// 	console.log(this);
			// });

			// console.log('thisEND');
			// console.log(this);
		// i++;
	}
	noMoreActors (type) {
		var find = 0;
		if (!this.actors) {return true;}
		this.actors.map(function (elem) {
			if (elem.type == type) {
				find++;
			}
		});
		if (find > 0) {return false;}
		return true;
	}
	playerTouched (type) {
			// console.log('');
			// console.log(op);
			// console.log('this');
			// console.log(this);
			// console.log('type');
			// console.log(type);
			// console.log(arguments[1]);
			// op++;
			if (type == 'lava' || type == 'fireball') {this.status = 'lost'};
			if (type == 'coin') {this.removeActor(arguments[1])};
			if (this.actors == 0) {this.status = 'won'}
	}
}

class LevelParser  {
	constructor (data) {
		this.data = data;
	}
	actorFromSymbol (symbol) {
		if (!symbol) {
			return undefined;
		} else {
			// console.log(this.data);
			for (var key in this.data) {
				if (key == symbol) {return this.data[key]}
				// console.log(key);
				// if (item[z] == key) {
				// 	forReturn.push(new data[item[z]](new Vector(z,i)));
				// }
			}
			// this.data.forEach(function (item, key) {
			// 	console.log(key);
			// });
		}
	}
	obstacleFromSymbol (symbol) {
		if (!symbol) {return undefined;}
		if (symbol == 'x') {return 'wall'}
		else if (symbol == '!') {return 'lava'}
		else {return undefined;}
	}
	createGrid (plan) {
		// console.log(plan);
		var forReturn = [];
		if (plan.length == 0) {
			return [];
		} else {
			for (var i = 0; i < plan.length; i++) {
				// console.log(plan[i]);
				forReturn.push([]);
				for (var z = 0; z < plan[i].length; z++) {
					// console.log(plan[i][z]);
					if (plan[i][z] == 'x') {
						// console.log(plan[i][z] + '=wall');
						forReturn[i].push('wall');
					} else if (plan[i][z] == '!') {
						// console.log(plan[i][z] + '=lava');
						forReturn[i].push('lava');
					} else {
						forReturn[i].push(undefined);
					}
				}
			}
		// console.log(forReturn);
			return forReturn;
		}
	}
	createActors (plan) {
		var data = this.data;
		var forReturn = [];
		if (plan.length == 0) {
		} else {
			plan.forEach(function(item, i) {
					// console.log(i);
				for (var z = 0; z < item.length; z++) {
					for (var key in data) {
						if (item[z] == key) {
							forReturn.push(new data[item[z]](new Vector(z,i)));
						}
					}
				}
			});
			// console.log(forReturn);
		}
		return forReturn;

	}
	parse (plan) {
		// console.log('');
		// console.log(this);
		// console.log(plan);
		var asd = new Level(plan, this.createActors(plan));
		// console.log(asd);
		asd.grid = this.createGrid(asd.grid);
		return asd;
	}
}

class Fireball extends Actor {
	constructor(pos, speed = new Vector(0, 0)) {
		super(pos);
		this.speed = speed;
	}
	get type () {return 'fireball'};
	getNextPosition (time) {
		// console.log(this);
		var zxc = {};
		if (this.speed.x == 0 && this.speed.y == 0) {return this.pos;}
		if (time) {
			zxc.x = this.pos.x + (this.speed.x * time);
			zxc.y = this.pos.y + (this.speed.y * time);
			return zxc;
		} else {
			zxc.x = this.pos.x + this.speed.x;
			zxc.y = this.pos.y + this.speed.y;
			return zxc;
		}
	}
	handleObstacle () {
		this.speed.x *= -1;
		this.speed.y *= -1;
	}
	act	(time, level) {
		var data = this.getNextPosition(time);
		if (level.obstacleAt(new Vector(data.x, data.y), this.size)) {
			this.handleObstacle();
		} else {
			// var newPosition = this.getNextPosition(time);
			this.pos.x = data.x;
			this.pos.y = data.y;
		}
	}
}

class HorizontalFireball extends Fireball {
	constructor() {
		super();
		this.speed = new Vector(2, 0);
	}
}

class VerticalFireball extends Fireball {
	constructor() {
		super();
		this.speed = new Vector(0, 2);
	}
}

class FireRain extends Fireball {
	constructor(pos) {
		super(pos);
		this.startPosition = this.pos;
		this.speed = new Vector(0, 3);
	}
	handleObstacle() {
		this.speed.x;
		this.speed.y;
		this.pos.x = this.startPosition.x;
		this.pos.y = this.startPosition.y;
	}
}







class Coin extends Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		super(pos, size, speed);
		// this.type = "coin";
		this.size = new Vector(0.6, 0.6);
		this.pos.x += 0.2;
		this.pos.y += 0.1;
		this.spring = Math.random() * (2 * Math.PI);
		this.springSpeed = 8;
		this.springDist = 0.07;
  	}
	get type () {return 'coin'};
  	updateSpring (time) {
  		if(time) {
  			this.spring += this.springSpeed * time;
  		} else {
  			this.spring += this.springSpeed;
  		}
  	}
  	getSpringVector () {
  		var newVec = new Vector();
  		newVec.y = Math.sin(this.spring) * this.springDist;
  		return newVec;
  	}
  	getNextPosition (time) {
		// console.log('');
		// console.log(this);
		// console.log(this.pos);
		// console.log(time);
  		if(time) {
  			this.spring += this.springSpeed * time;
  		} else {
  			this.spring += this.springSpeed;
  		}
  		var qwe = new Vector(this.pos.x, this.pos.y + (this.getSpringVector().y));
  		qwe.x = this.pos.x;
  		// console.log(this.getSpringVector().y);
  		qwe.y = this.pos.y + (this.getSpringVector().y);
		// console.log(qwe);
  		this.pos.x = qwe.x;
  		this.pos.y = qwe.y;
  		return this.pos;
  	}
  	act () {
		// console.log(this);
		var asd = this.getNextPosition();
		// console.log(asd);
  		this.pos.x = asd.x;
  		this.pos.y = asd.y;
		// console.log(this);
  	}
}

class Player extends Actor {
	constructor(pos = new Vector(0, 0)) {
		super(pos);
		// console.log(pos);
		// this.type = "player";
		this.size = new Vector(0.8, 1.5);
		// this.size.x = 0.8;
		// this.size.y = 1.5;
		this.pos.y -= 0.5;
  	}
  	get type () {return 'player'}
  	// get size () {return new Vector(0.8, 1.5);}
  	// set type () {return 'player'}
}



const schemas = [
  [
    '        v',
    '         ',
    '         ',
    '         ',
    '       o ',
    '     !xxx',
    '     =   ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain,
  '=': HorizontalFireball,
  'o': Coin
}
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));

// const schema = [
//   '         ',
//   '    =   v',
//   '    |    ',
//   '       o ',
//   '     !xxx',
//   '         ',
//   'xxx!     ',
//   '         '
// ];
// const actorDict = {
//   '@': Player,
//   'v': FireRain,
//   '=': HorizontalFireball,
//   '|': VerticalFireball,
//   'o': Coin
// }
// const parser = new LevelParser(actorDict);
// const level = parser.parse(schema);
// runLevel(level, DOMDisplay);


// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));

// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');  
// }

// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }

// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }

// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);