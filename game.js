'use strict';
function instanceofVector(value) {
		try { 
			if (value instanceof Vector) {
				return value;
			} else {
				throw "объект не является вектором";
			}
		} catch (Error) {alert(e)} ;
};
function instanceofActor(value) {
		try { 
			if (value instanceof Actor) {
				return value;
			} else {
				throw "объект не является actor";
			}
		} catch (Error) {alert(e)} ;
};

class Vector {
	constructor(x = 0 , y = 0) {
		this.x = x;
		this.y = y;
  	}
 	plus(elem) {
 		instanceofVector(elem);
 		return new Vector(this.x+elem.x, this.y+elem.y);
 	}
 	times(z) {
 		return new Vector(this.x*z, this.y*z);
 	}
}

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		var position = instanceofVector(pos);
		var sizeFinal = instanceofVector(size);
		this.pos = position;
		this.size = sizeFinal;
		this.speed = instanceofVector(speed);
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
		instanceofActor(obj);
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

		return this.grid.map(function(row) {
        	return row[Math.floor(position.x)];
        }).find(function(cell, y) {
        	if(((y == Math.floor(position.y)) || (y == Math.floor(position.y+size.y))) && (cell !== undefined)) {
				return cell;
        	}
        });

		// for(var y=0; y<this.grid.length; y++) {
		// 	for(var x =0; x<this.grid[y].length; x++) {
		// 		//пересечение правой границей персонажа и лавы
		// 		if (
		// 			(x+1 == Math.floor(position.x + size.x) && y == Math.floor(position.y + size.y))
		// 			&&
		// 			this.grid[y][x+1] == 'lava'
		// 			) {
		// 			return this.grid[y][x+1]
		// 		}

		// 		//пересечение углов персонажа с припятствием
		// 		if (
		// 			(
		// 				(
		// 					x == Math.floor(position.x) && y == Math.floor(position.y)
		// 				)
		// 					||
		// 				(
		// 					x == Math.floor(position.x + size.x) && y == Math.floor(position.y)
		// 				) 
		// 					|| 
		// 				(
		// 					x == Math.floor(position.x + size.x) && y == Math.floor(position.y + size.y)
		// 				)
		// 					|| 
		// 				(
		// 					x == Math.floor(position.x) && y == Math.floor(position.y + size.y)
		// 				)
		// 			) 
		// 				&& 
		// 				this.grid[y][x] !== undefined
		// 			) {
		// 				return this.grid[y][x]
		// 			}
		// 			//если персонаж не допрыгнул, то что бы он не повис на "голове" сквозь блок с правой стороны
		// 			else if (
		// 					(x+1 == Math.floor(position.x + size.x))
		// 					 &&
		// 					(y > Math.floor(position.y) && y < Math.floor(position.y+size.y))
		// 					&&
		// 					this.grid[y][x+1] == 'wall'
		// 			) {
		// 				return this.grid[y][x+1]
		// 			} 
		// 			//если персонаж не допрыгнул, то что бы он не повис на "голове" сквозь блок с левой стороны
		// 			else if (
		// 					(x-1 == Math.floor(position.x))
		// 					 &&
		// 					(y > Math.floor(position.y) && y < Math.floor(position.y+size.y))
		// 					&&
		// 					this.grid[y][x-1] == 'wall'
		// 				) {
		// 				return this.grid[y][x-1]
		// 			}

		// 	}
		// }
	}
	removeActor(obj) {
		// console.log(this);
			var findMass = [];
			// this.actors.map(function(elem, i) {
			// 	(elem.type == obj.type && elem.title == obj.title) ? findMass.push(i) : '';
			// });
			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i].type == obj.type && this.actors[i].title == obj.title) {
					findMass.push(i);
				}
			}
			for (var i = 0; i < findMass.length; i++) {
				this.actors.splice(findMass[i], 1);
			}
	}
	noMoreActors(type) {
		var find = 0;
		if (!this.actors) {return true;}
		this.actors.map(function (elem) {if (elem.type == type) {find++}});
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
				for (var x = 0; x < line.length; x++) {
					if (line[x] == 'x') {
						forReturn[y].push('wall');
					} else if (line[x] == '!') {
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
var coinNumber = 1;
class Coin extends Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		super(pos, size, speed);
		this.size = new Vector(0.6, 0.6);
		this.pos.x += 0.2;
		this.pos.y += 0.1;
		this.spring = Math.random() * (2 * Math.PI);
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.title = 'coin' + coinNumber;
		coinNumber ++;
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
  		var newVec = new Vector();
  		newVec.y = Math.sin(this.spring) * this.springDist;
  		return newVec;
  	}
  	getNextPosition(time) {
  		if(time) {
  			this.spring += this.springSpeed * time;
  		} else {
  			this.spring += this.springSpeed;
  		}
  		// var newPosition = new Vector(this.pos.x, this.pos.y + (this.getSpringVector().y));
  		// newPosition.x = this.pos.x;
  		// newPosition.y = this.pos.y + (this.getSpringVector().y);
  		// this.pos.x = newPosition.x;
  		// this.pos.y = newPosition.y;
  		return new Vector(this.pos.x, this.pos.y + (this.getSpringVector().y));
  	}
  	act() {
		var newPosition = this.getNextPosition();
  		this.pos.x = newPosition.x;
  		this.pos.y = newPosition.y;
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