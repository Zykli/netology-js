'use strict';
function instanceofChecked(value, checkedClass) {
		if (!(value instanceof checkedClass)) {
			throw new Error(`переданный объект не является объектом типа ${checkedClass.name}`);
		} else {
			return value;
		}
};

class Vector {
	constructor(x = 0 , y = 0) {
		this.x = x;
		this.y = y;
  	}
 	plus(elem) {
 		instanceofChecked(elem, Vector);
 		return new Vector(this.x+elem.x, this.y+elem.y);
 	}
 	times(z) {
 		return new Vector(this.x*z, this.y*z);
 	}
}

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		var position = instanceofChecked(pos, Vector);
		var sizeFinal = instanceofChecked(size, Vector);
		this.pos = position;
		this.size = sizeFinal;
		this.speed = instanceofChecked(speed, Vector);
		this.startPosition = new Vector(pos.x, pos.y);
  	}
	get type() {return 'actor'};
	get left() {return this.pos.x};
	get right() {return this.pos.x + this.size.x};
	get top() {return this.pos.y};
	get bottom() {return this.pos.y + this.size.y};

  	isIntersect(obj) {
  		if (this == obj) {
  			return false};

  		if ((obj.size.x < 0 && obj.size.y <0) ||
  			((this.top >= obj.bottom) || 
  			(this.right <= obj.left) || 
  			(this.bottom <= obj.top) || 
  			(this.left >= obj.right))) {
  			return false;
  		} else if(((this.top <= obj.top) || 
  			(this.right >= obj.right) || 
  			(this.bottom >= obj.bottom) || 
  			(this.left <= obj.left))) {
  			return true;
  		}
  		return true;
  		console.log('нет таких условий пересечения');
  	}
  	act() {}
}

class Level {
	constructor(grid, actors) {
		var height = 0, width = 0, player = '';
	  	if (grid instanceof Array) {
	  	  height = grid.length;
	  	  grid.forEach(function(elem) {
	  	  	!elem ? width = 0 : elem instanceof Array ? width = elem.length > width ? elem.length : width : width = elem.length;
	  	  });
	  	}
	  	if (actors instanceof Array) {
	  		actors.forEach(function(elem) {
	  			elem.type === 'player' ? player = elem : "";
	  		});
	  	}
	  	this.grid = grid;
	  	this.height = height;
	  	this.width = width;
	  	this.status = null;
	  	this.finishDelay = 1;
	  	this.actors = actors;
	  	this.player = player;
	}
	isFinished() {
		if (this.status != null && this.finishDelay < 0) {return true};
		if (this.status != null && this.finishDelay > 0) {return false};
		return false;
	}
	actorAt(obj) {
		instanceofChecked(obj, Actor);
		// Вернет объект игрового поля, который пересекается с переданным объектом
		if (this.actors) {
			return this.actors.find(function(item) {
				return item.isIntersect(obj) ? obj : '';
			});
			this.actors.find(item => item.isIntersect(obj));
		}
		// Вернет undefined для пустого уровня
		if (this.height == 0 && this.width == 0) {
			return undefined};
		// Вернет undefined для уровня в котором только один движущийся объект
		if (this.actors.length == 1) {
			return undefined};
		// Вернет undefined если ни один объект игрового поля не пересекается с переданным объектом
		if (obj.pos.x > this.width && obj.pos.y > this.height) {
			return undefined};
	}
	obstacleAt(position, size) {
		if (position.x < 0 || position.y < 0) {return 'wall'};
		if (position.x + size.x > this.width) {return 'wall'};
		if (position.y + size.y > this.height) {return 'lava'};

		for(var y = Math.floor(position.y); y <= Math.floor(position.y + size.y); y++) {
			for(var x = Math.floor(position.x); x <= Math.floor(position.x + size.x); x++) {
				//пересечение правой стороной персонажа лавы
				if(x+1 == Math.floor(position.x + size.x) && this.grid[y][x+1] == 'lava') {
					return this.grid[y][x+1];
				}
				//текущая позиция персонажа
				if (this.grid[y][x] !== undefined) {
					return this.grid[y][x];
				}
			}
		}
	}
	removeActor(obj) {
			var deletingIndex = this.actors.indexOf(obj);
			if(deletingIndex != -1) {
				this.actors.splice(deletingIndex, 1);
			}
		}
	noMoreActors(type) {
		var find = 0;
		if (!this.actors) {return true;}
		this.actors.forEach(function(elem) {
			if (elem.type == type) {find++};
		});
		if (find > 0) {return false;}
		return true;
	}
	playerTouched(type) {
		if (type == 'lava' || type == 'fireball') {return this.status = 'lost'};
		if (type == 'coin') {this.removeActor(arguments[1])};
		var coinCount = this.actors.reduce(function(count, elem) {
			return elem.type == 'coin' ? count += 1 : count;
		}, 0);
		if (coinCount == 0 && this.status != 'lost') {return this.status = 'won'}
	}
}

class LevelParser  {
	constructor (data) {
		this.data = data;
	}
	actorFromSymbol(symbol) {
		if (!symbol) {
			return undefined;
		} else {
			for (var key in this.data) {
				if (key == symbol) {return this.data[key]}
			}
		}
	}
	obstacleFromSymbol(symbol) {
		if (!symbol) {return undefined;}
		if (symbol == 'x') {return 'wall'}
		else if (symbol == '!') {return 'lava'}
		else {return undefined;}
	}
	createGrid(plan) {
		var forReturn = [];
		if (plan.length != 0) {
			plan.map(function(line, y) {
				forReturn.push([]);
				for (var elem of line) {
					if (elem == 'x') {
						forReturn[y].push('wall');
					} else if (elem == '!') {
						forReturn[y].push('lava');
					} else {
						forReturn[y].push(undefined);
					}
				}
			});
		}
		return forReturn;
	}
	createActors(plan) {
		var data = this.data;
		var forReturn = [];
		if (plan.length == 0) {
		} else {
			plan.forEach(function(item, i) {
				for (var z = 0; z < item.length; z++) {
					for (var key in data) {
						if (item[z] == key) {
							if (typeof data[key] == 'function') {
								var newActor = new data[item[z]](new Vector(z,i));
								if (newActor instanceof Actor) {
									forReturn.push(newActor);
								}
							}
						}
					}
				}
			});
		}
		return forReturn;
	}
	parse(plan) {
		var level = new Level(plan, this.createActors(plan));
		level.grid = this.createGrid(level.grid);
		return level;
	}
}

class Fireball extends Actor {
	constructor(pos, speed = new Vector(0, 0)) {
		super(pos);
		this.speed = speed;
	}
	get type() {return 'fireball'};
	getNextPosition(time) {
		var zxc = {};
		if (this.speed.x == 0 && this.speed.y == 0) {return this.pos;}
		if (time) {
			zxc.x = this.pos.x + (this.speed.x * time);
			zxc.y = this.pos.y + (this.speed.y * time);
			return new Vector(zxc.x, zxc.y);
		} else {
			zxc.x = this.pos.x + this.speed.x;
			zxc.y = this.pos.y + this.speed.y;
			return new Vector(zxc.x, zxc.y);
		}
	}
	handleObstacle() {
		this.speed.x *= -1;
		this.speed.y *= -1;
	}
	act(time, level) {
		var newPosition = this.getNextPosition(time);
		if (level.obstacleAt(new Vector(newPosition.x, newPosition.y), this.size)) {
			this.handleObstacle();
		} else {
			this.pos.x = newPosition.x;
			this.pos.y = newPosition.y;
		}
	}
}

class HorizontalFireball extends Fireball {
	constructor(pos) {
		super(pos);
		this.speed = new Vector(2, 0);
	}
}

class VerticalFireball extends Fireball {
	constructor(pos) {
		super(pos);
		this.speed = new Vector(0, 2);
	}
}

class FireRain extends Fireball {
	constructor(pos) {
		super(pos);
		this.speed = new Vector(0, 3);
	}
	handleObstacle() {
		this.pos.x = this.startPosition.x;
		this.pos.y = this.startPosition.y;
	}
}

class Coin extends Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		super(pos, size, speed);
		this.size = new Vector(0.6, 0.6);
		this.pos.x += 0.2;
		this.pos.y += 0.1;
		this.spring = Math.random() * (2 * Math.PI);
		this.springSpeed = 8;
		this.springDist = 0.07;
  	}
	get type() {return 'coin'};
  	updateSpring(time) {
  		if(time) {
  			this.spring += this.springSpeed * time;
  		} else {
  			this.spring += this.springSpeed;
  		}
  	}
  	getSpringVector() {
  		return new Vector(0, Math.sin(this.spring) * this.springDist);
  	}
  	getNextPosition(time) {
  		this.updateSpring(time);
    	return this.pos.plus(this.getSpringVector());
  	}
  	act(time) {
  		this.pos = this.getNextPosition(time);
  	}
}

class Player extends Actor {
	constructor(pos = new Vector(0, 0)) {
		super(pos);
		this.size = new Vector(0.8, 1.5);
		this.pos.y -= 0.5;
  	}
  	get type() {return 'player'}
}



const schemas = [
  [
    '   xxx   ',
    '    v   o',
    '         ',
    'x       x',
    'x o   = x',
    'x   x   x',
    '  x   x  ',
    '    @    ',
    '   xxx   '
  ],
  [
    ' x       ',
    '         ',
    ' |       ',
    ' x      o',
    '       o ',
    '     !xxx',
    ' @o x    ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    ' |       ',
    ' x       ',
    '         ',
    '       o ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '         ',
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
  '|': VerticalFireball,
  'o': Coin
}
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));