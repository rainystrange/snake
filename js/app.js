var model = {
	board: [],
	snake: [{x: 20, y: 20}],
	direction: {x: 0, y: 1},
	newFood: {x: Math.floor(Math.random(0) * 40), y: Math.floor(Math.random() * 10)},
	oldFood: {x: null, y: null},
	level: 1,

	init: function() {
		for (var i = 0; i < 40 ; i++) {
			var row = []
			for (var j = 0; j < 40 ; j++) {
				var cell = document.createElement("div");
				cell.className = "cell";
				row.push(cell);
			}
			this.board.push(row);
		};
	}
}

var controller = {
	direction: model.direction,
	x: 0,
	y: 0,
	runFunction: null,
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
			
		}				
	},
	checkHitWall: function() {
		var x = this.x + this.direction.x;
		var y = this.y + this.direction.y;
		if (x < 0 || x >= 40 || y < 0 || y >= 40) {
			alert("You lose");
			clearInterval(controller.runFunction);
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
		while (!model.snake.filter(function(e) { return e.x == x1 && e.y == y1 }));
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
	},
	getBoard: function() {
		return model.board;
	},
	run: function() {
		$(model.board[model.newFood.x][model.newFood.y]).addClass("food");
		$(model.board[model.snake[0].x][model.snake[0].y]).addClass("snake");
		this.runFunction = setInterval(this.move, 100);
	}
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
	},
	showBoard: function() {
		var board = controller.getBoard();
		for (var i = 0; i < 40; i++) {
			for (var j = 0; j < 40; j++) {
				$("#board").append(board[i][j]);
			}
		}				
	}
}

model.init();
view.init();
view.showBoard();
controller.run();