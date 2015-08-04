var model = {
	board: null,
	snake: null,
	direction: null,
	newFood: null,
	oldFood: null,
	level: null,
	firstTime: null,
	count: null,
	score: null,
	specialFood: null,
	speed: null,
	countSpecialEaten: null,
	init: function() {
		this.snake = [{x: 20, y: 20}];
		this.direction = {x: 0, y: 1};
		this.newFood = {x: Math.floor(Math.random() * 40), y: Math.floor(Math.random() * 10)};
		this.oldFood = {x: null, y: null};
		this.level = 1;
		this.firstTime = true;
		this.count = 0;
		this.score = 0;
		this.board = [];
		this.specialFood = [];
		this.speed = 100;
		this.countSpecialEaten = 0;
		for (var i = 0; i < 40 ; i++) {
			var row = []
			for (var j = 0; j < 40 ; j++) {
				var cell = document.createElement("div");
				cell.className = "cell";
				row.push(cell);
			}
			this.board.push(row);
		}
	}
}

var controller = {
	direction: model.direction,
	x: 0,
	y: 0,
	runFunction: null,
	runFoodFunction: null,
	init: function() {
		$(model.board[model.newFood.x][model.newFood.y]).addClass("food");
		$(model.board[model.snake[0].x][model.snake[0].y]).addClass("snake");
	},	
	move: function() {
		this.x = model.snake[0].x;
		this.y = model.snake[0].y;
		var board = model.board;
		var tail = model.snake[model.snake.length - 1];

		this.direction = model.direction;		
		if (!(controller.checkHitWall.bind(this)() || controller.checkHitSelf(this))) {
			if (!(tail.x == model.oldFood.x && tail.y == model.oldFood.y)) {
				$(board[tail.x][tail.y]).removeClass("snake");
				model.snake.pop();
			}
			else {
				model.oldFood.x = null;
				model.oldFood.y = null;
			}
			this.x += this.direction.x;
			this.y += this.direction.y;			
			$(board[this.x][this.y]).addClass("snake");			
			model.snake.unshift({x: this.x, y: this.y});
			controller.checkFood(this);
			controller.eatSpecialFood.bind(this)();			
		}				
	},
	checkHitWall: function() {
		var x = this.x + this.direction.x;
		var y = this.y + this.direction.y;
		if (x < 0 || x >= 40 || y < 0 || y >= 40) {
			alert("You lose");
			clearInterval(controller.runFunction);
			clearInterval(controller.runFoodFunction);
			return true;
		}
		return false;
	},
	checkHitSelf: function(that) {
		var x = that.x + that.direction.x;
		var y = that.y + that.direction.y;
		if (model.snake.filter(function(e) {
			return e.x == x && e.y == y;
		}).length > 0) {
			alert("You lose");
			clearInterval(controller.runFunction);
			clearInterval(controller.runFoodFunction);
			return true;
		}
		return false;
	},
	checkFood: function(that) {
		if (that.x == model.newFood.x && that.y == model.newFood.y) {
			model.oldFood.x = model.newFood.x;
			model.oldFood.y = model.newFood.y;	
			model.newFood = controller.generateFood();
			controller.showAndHideFood();			
			controller.showScore();
			controller.levelUp();			
		}
	},
	showAndHideFood: function() {
		$(model.board[model.oldFood.x][model.oldFood.y]).removeClass("food");
		$(model.board[model.newFood.x][model.newFood.y]).addClass("food");
	},

	generateFood: function() {
		var x1 = 0;
		var y1 = 0;
		do {
			x1 = Math.floor(Math.random() * 40);
			y1 = Math.floor(Math.random() * 40);
		}
		while (model.snake.filter(function(e) { return e.x == x1 && e.y == y1 }).length > 0 || 
			(x1 == model.newFood.x && y1 == model.newFood.y) || 
			model.specialFood.filter(function(e) { return e.x == x1 && e.y == y1}).length > 0);
		return {x: x1, y: y1};
	},
	setDirection: function(direction) {
		switch (direction) {
			case "left":
			model.direction = {x: 0, y: -1};
			break;

			case "down":
			model.direction = {x: 1, y: 0};
			break;

			case "right":
			model.direction = {x: 0, y: 1};
			break;

			case "up":
			model.direction = {x: -1, y: 0};
			break;
		}
		if (model.firstTime) {
			controller.run();
			model.firstTime = false;
		}					
	},
	getBoard: function() {
		return model.board;
	},
	run: function() {
		this.runFunction = setInterval(controller.move, model.speed);
		this.runFoodFunction = setInterval(controller.lookForFood, 500);
	},
	levelUp: function() {
		if (model.count == 4) {
			model.level += 1;
			view.showLevel(model.level);
			view.showLevelUp();
			model.count = 0;
			model.speed -= 20;
			clearInterval(controller.runFunction);
			controller.runFunction = setInterval(controller.move, model.speed);
		} 
		else {
			model.count += 1;
		}
	},
	showScore: function() {
		model.score += model.level * 10;
		view.showScore(model.score);
	},
	newGame: function() {
		model.init();
		view.reset();
		controller.init();
	},
	createSpecialFood: function() {
		var n = Math.floor(Math.random() * 101);
		var food = controller.generateFood();
		if (n < 40) { //black
			model.specialFood.push({x: food.x, y: food.y, kind: "black", timeLeft: 8});
			view.showSpecialFood("black", food.x, food.y);
		}
		else if (n < 80) { // blue
			model.specialFood.push({x: food.x, y: food.y, kind: "blue", timeLeft: 6});
			view.showSpecialFood("blue", food.x, food.y);
		}
		else { // gold
			model.specialFood.push({x: food.x, y: food.y, kind: "gold", timeLeft: 5});
			view.showSpecialFood("gold", food.x, food.y);
		}
	},
	lookForFood: function() {
		var n = Math.floor(Math.random() * 101);
		if (n < 6) {
			controller.createSpecialFood();
		}
		var food;
		for (var i = model.specialFood.length - 1; i >= 0; i--) {
			food = model.specialFood[i];
			if (food.timeLeft <= 0) {
				view.hideSpecialFood(food.kind, food.x, food.y);
				model.specialFood.splice(i, 1);
				if (food.kind == "blue" || food.kind == "gold") {
					model.countSpecialEaten = 0;
				}
			}
			else {
				food.timeLeft -= 0.5;
			}
		}
	},
	eatSpecialFood: function() {
		var food;
		for (var i = 0; i < model.specialFood.length; i++) {
			food = model.specialFood[i];
			if (this.x == food.x && this.y == food.y) {
				if (food.kind == "blue") { // x2 score
					model.score += model.level * 10 * 2;
					model.specialFood.splice(i, 1);
					view.hideSpecialFood("blue", food.x, food.y)
					view.showScore(model.score);
					model.countSpecialEaten += 1;
					if (model.countSpecialEaten == 2) {
						controller.shrinkSnake();
					}
					break;
				}
				else if (food.kind == "black") {
					alert("You lose");
					clearInterval(controller.runFunction);
					clearInterval(controller.runFoodFunction);
				}
				else {
					model.score += model.level * 10 * 3;
					model.speed += 25;
					model.specialFood.splice(i, 1);
					view.hideSpecialFood("gold", food.x, food.y);
					view.showScore(model.score);
					clearInterval(controller.runFunction);
					controller.runFunction = setInterval(controller.move, model.speed);
					model.countSpecialEaten += 1;
					if (model.countSpecialEaten == 4) {
						controller.shrinkSnake();
					}
				}
			}
		}
	},
	shrinkSnake: function() {		
		var tail = model.snake[model.snake.length - 1];
		$(model.board[tail.x][tail.y]).removeClass("snake");
		model.snake.pop();
	},
}

var view = {
	init: function() {
		$(document).keydown(function(e) {
			switch(e.which) {
				case 37:
				controller.setDirection("left");
				break;

				case 38:
				controller.setDirection("up");
				break;

				case 39:
				controller.setDirection("right");
				break;

				case 40:
				controller.setDirection("down");
				break;
			}
			e.preventDefault();
		});
		$('.newGame').click(function(e) {
			controller.newGame();
		});
	},
	reset: function() {
		$("#board").empty();
		view.showBoard();
	},
	showBoard: function() {
		var board = controller.getBoard();
		for (var i = 0; i < 40; i++) {
			for (var j = 0; j < 40; j++) {
				$("#board").append(board[i][j]);
			}
		}
		$('.level').text(1);
		$('.score').text(0);				
	},
	showScore: function(score) {
		$('.score').text(score);
	},
	showLevel: function(level) {
		$('.level').text(level);
	},
	showSpecialFood: function(kind, x, y) {
		$(controller.getBoard()[x][y]).addClass(kind + "Food");
	},
	hideSpecialFood: function(kind, x, y) {
		$(controller.getBoard()[x][y]).removeClass(kind + "Food");
	},
	showLevelUp: function() {
		$('.levelUp').animate( {
			opacity: 1
		}, 1000);
		$('.levelUp').animate( {
			opacity: 0
		}, 1000)
	}
}
model.init();
view.init();
view.showBoard();
controller.init();