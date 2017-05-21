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



var i = 1;
class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		var position = instanceofVector(pos);
		var sizeFinal = instanceofVector(size);
		this.pos = position;
		this.size = sizeFinal;
		this.speed = instanceofVector(speed);

		// Object.defineProperty(this, 'type', {
		//   value : 'actor',
		//   writable : false
		// });

		this.type = "actor";
		this.act = function() {};
		this.left = position.x;
		this.right = position.x + sizeFinal.x;
		this.top = position.y;
		this.bottom = position.y + sizeFinal.y;
  	}
  	isIntersect (obj) {
  		instanceofActor(obj);
  		console.log('');
  		console.log(i);
  		console.log('this');
  		console.log(`top: ${this.top}; left: ${this.left}; bottom: ${this.bottom}; right: ${this.right}; SIZE: x: ${this.size.x}; y: ${this.size.y};`);
  		console.log('obj');
  		console.log(`top: ${obj.top}; left: ${obj.left}; bottom: ${obj.bottom}; right: ${obj.right}; SIZE: x: ${obj.size.x}; y: ${obj.size.y};`);
  		i++;
  		if (this == obj) {console.log('сам с собой'); return false};

  		// Объект не пересекается с объектом расположенным очень далеко
  		if (((this.top != obj.top) && 
  		  	 (this.right != obj.right) && 
  		  	 (this.bottom != obj.bottom) && 
  		  	 (this.left != obj.left)) && 
			(!(this.top < obj.bottom && this.left < obj.right) ||
			 !(this.top < obj.bottom && this.right > obj.left) ||
			 !(this.bottom > obj.top && this.right > obj.left) ||
			 !(this.bottom > obj.top && this.left < obj.right)) &&
			(!(this.top == obj.bottom) && 
  			 !(this.right == obj.left) && 
  			 !(this.bottom == obj.top) && 
  			 !(this.left == obj.right))) {console.log('расположенным очень далеко'); return false}

  		// Объект не пересекается с объектом со смежными границами
  		 if (((this.top == obj.bottom) || 
			(this.right == obj.left) || 
			(this.bottom == obj.top) || 
			(this.left == obj.right)) 
			// ||
   // 			((this.top == obj.top) || 
   // 			(this.right == obj.right) || 
   // 			(this.bottom == obj.bottom) || 
   // 			(this.left == obj.left))
   			) {console.log('со смежными границами'); return false} 

  		// Объект не пересекается с объектом расположенным в той же точке, но имеющим отрицательный вектор размера
  		else if (((this.top == obj.top) || 
  		  	(this.right == obj.right) || 
  		  	(this.bottom == obj.bottom) || 
  		  	(this.left == obj.left)) && 
  			(obj.size.x < 0 && obj.size.y <0)) {console.log('c отрицательным размером'); return false}

  		// Объект пересекается с объектом, который полностью содержится в нём
  		else if (this.top < obj.top && 
  			this.right > obj.right && 
  			this.bottom > obj.bottom && 
  			this.left < obj.left) {console.log('полностью содержится в нём'); return true}

  		// Объект пересекается с объектом, который частично содержится в нём
		else if ((this.top < obj.bottom && this.left < obj.right) ||
			 (this.top < obj.bottom && this.right > obj.left) ||
			 (this.bottom > obj.top && this.right > obj.left) ||
			 (this.bottom > obj.top && this.left < obj.right)) {console.log('частично содержится в нём'); return true}; 


  	}
}

class Level {
	constructor(grid, actors) {
		var height = 0, width = 0, player = '';
	  	if (grid instanceof Array) {
	  	  height = grid.length;
	  	  for (let i=0; i<grid.length; i++) {
	  	    if (grid[i] instanceof Array) {
	  	      width = grid[i].length > width ? grid[i].length : width ;
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
			console.log('');
			console.log(i);
			console.log('this');
			console.log(this);
			console.log('actorAt');
			console.log(obj);
		instanceofActor(obj);

		var qwe = new Actor();
		console.log(qwe);

		// Вернет undefined для пустого уровня
		if (this.height == 0 && this.width == 0) {console.log('undefined'); return undefined};

		// Вернет undefined для уровня в котором только один движущийся объект
		if (this.actors.length == 1) {console.log('undefined'); return undefined};

		// Вернет undefined если ни один объект игрового поля не пересекается с переданным объектом
		if (obj.pos.x > this.width && obj.pos.y > this.height) {console.log('undefined'); return undefined};

		return qwe;
	}
	obstacleAt (position, size) {
		if (i >= 6) {
			console.log('');
			console.log(i);
			console.log('this');
			console.log(this);
			console.log('position');
			console.log(position);
			console.log('size');
			console.log(size);
		}
		i++;
		if (position.x < 0 || position.y < 0) {console.log('wall'); return 'wall'};
		if (position.x + size.x > this.width) {console.log('wall'); return 'wall'};
		if (position.y + size.y > this.height) {console.log('lava'); return 'lava'};

		// return 'wall';
	}
	removeActor (obj) {
			console.log('');
			console.log('removeActor');
			console.log('this');
			console.log(this);
			console.log('obj');
			console.log(obj);

			// this.actors[0].type = 'coin';
			// obj.type = 'coin';

			// for (var i = 0; i < this.actors.length; i++) {
			// console.log('---');
			// 	console.log(this.actors[i]);
			// console.log('---');
			// }

			var findMass = [];

			for (var i = 0; i < this.actors.length; i++) {
				if (this.actors[i].type == obj.type) {
					findMass.push(i);
				}
			}
			console.log(findMass);

			for (var i = 0; i < findMass.length; i++) {
				delete this.actors[findMass[i]];
				// this.actors.length -= 1;
			}

			// findMass.map(function(elem) {
			// 	console.log(elem);
			// 	delete this.actors[elem];
			// 	console.log(this);
			// });

			console.log('thisEND');
			console.log(this);
		i++;
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
			console.log('');
			console.log(i);
			console.log('this');
			console.log(this);
			console.log('type');
			console.log(type);
			console.log(arguments[1]);
			i++;

			if (type == 'lava' || type == 'fireball') {this.status = 'lost'};

			// if (type == 'coin') {this.removeActor(arguments[1])};



			// var coinCuantity = 0;
			// this.actors.map(function (elem) {
			// 	if (elem.type == 'coin') {coinCuantity ++};
			// });
			// if (coinCuantity == 0) {this.status = 'won'}


			// console.log('this');
			// console.log(this);


	}
}


class Fireball extends Actor{
	constructor() {
		super();
		this.type = "fireball";
		// this = new Actor();
	}
	getNextPosition (time) {
		console.log(time);
		if (time) {
			return	this.pos.x *= time; 

		} else {
			if (this.speed.x == 0 && this.speed.y == 0) {
				return this.pos;
			} else if (this.speed.x > 0) {
				return this.pos.x += this.speed.x;
			} else if (this.speed.y > 0) {
				return this.pos.y += this.speed.y;
			}
		}
	}
	handleObstacle () {
		this.speed.x *= -1;
		this.speed.y *= -1;
	}
	act () {

	}
}





class FireRain extends Fireball {

}







class Coin extends Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		super(pos, size, speed);
		this.type = "coin";
		this.size = new Vector(0.6, 0.6);
		this.pos.x += 0.2;
		this.pos.y += 0.1;
		this.spring = Math.random() * (2 * Math.PI);
		this.springSpeed = 8;
		this.springDist = 0.07;
  	}
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
		console.log('');
		console.log(this);
		console.log(this.pos);
		console.log(time);
  		if(time) {
  			this.spring += this.springSpeed * time;
  		} else {
  			this.spring += this.springSpeed;
  		}
  		var qwe = new Vector(this.pos.x, this.pos.y);
  		qwe.x = this.pos.x;
  		console.log(this.getSpringVector().y);
  		qwe.y = this.pos.y + (this.getSpringVector().y);
		console.log(qwe);
  		return qwe;
  	}
  	act () {
		console.log(this);
		console.log(arguments);
		var asd = getNextPosition();
  		this.pos.x = asd.x;
  		this.pos.y = asd.y;
		console.log(this);
  	}
}

class Player extends Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
		super(pos, size, speed);
		console.log(pos);
		this.type = "player";
		this.size = new Vector(0.8, 1.5);
		this.pos.y -= 0.5;
  	}
}