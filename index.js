// maze
// challenges:
// 1) draw maze on screen :
//    -  tree data structure + recursion
// 2) make keybord controll ball:
//   - canvas element (matter.js)
// 3) detect colission :
//  - Matter js

// Building a Maze:
// 1) create grid of 'cells'
// 2) pick a random starting cell
// 3) for the cell, build randomly-ordered list of neighbours
// 4) if a neighbor has been visited vefore, remove it from the list
// 5) for each remaining neighbor, 'move' to it and remove the wall between those two cells
// 6) repeat for this new neighbor --> 3

// walls:
//    vertical     |
//    horizontal ----
// true -- no wall
// false -- there is wall

//getting accest to matter objects
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 40;
const cellsVertical = 30;

const width = window.innerWidth;
const height = window.innerHeight;
// const width = 600;
// const height = 600;

//cells

//wall length
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: width,
		height: height,
		wireframes: false
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Create Walls
const walls = [
	// position - center of element (x,y, width, height )
	Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }), //top
	Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }), //left
	Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }), //right
	Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }) //bot
];
//add walls
World.add(world, walls);

// maze generation
const shuffle = (arr) => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};
// const grid = [];

// for (let i = 0; i < 3; i++) {
// 	grid.push([]);
// 	for (let j = 0; j < 3; j++) {
// 		grid[i].push(false);
// 	}
// }
// console.log(grid);

const grid = Array(cellsVertical).fill(null).map(() => {
	return Array(cellsHorizontal).fill(false);
});

// walls data
const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

// pick random starting cell

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

// console.log(startRow, startColumn);

//iterating through maze cells
const stepThroughCell = (row, column) => {
	// check if i have visited cell at [row,col]
	if (grid[row][column]) {
		return;
	}
	// mark visited cell
	grid[row][column] = true;

	// assemble randomly order list of neigbour
	const neighbours = shuffle([
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	]);

	// foreach neighbour
	for (const neighbor of neighbours) {
		const [ nextRow, nextColumn, direction ] = neighbor;
		//see if neigbor is out of bounds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue; //don't do anything and continue loop
		}
		//check if we have visited that neighbour and continue to the next
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		//remove a wall from either horizantal or vertical
		stepThroughCell(nextRow, nextColumn);
	}
};

stepThroughCell(startRow, startColumn);

// drawing horizontal segments
horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX / 2,
			rowIndex * unitLengthY + unitLengthY,
			unitLengthX,
			5,
			{
				isStatic: true,
				label: 'wall',
				render: {
					fillStyle: 'red'
				}
			}
		);
		World.add(world, wall);
	});
});

// drawing vertical walls
verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			5,
			unitLengthY,
			{
				isStatic: true,
				label: 'wall',
				render: {
					fillStyle: 'red'
				}
			}
		);
		World.add(world, wall);
	});
});

// goal
const goal = Bodies.rectangle(width - unitLengthX / 2, height - unitLengthY / 2, unitLengthX * 0.7, unitLengthY * 0.7, {
	isStatic: true,
	label: 'goal',
	render: {
		fillStyle: 'green'
	}
});
World.add(world, goal);

// ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
	label: 'ball',
	render: {
		fillStyle: 'blue'
	}
});

World.add(world, ball);

// moving the ball by wsad
document.addEventListener('keydown', (event) => {
	const { x, y } = ball.velocity; //get position
	if (event.keyCode === 87) {
		Body.setVelocity(ball, { x: x, y: y - 5 }); //adding 5 to speed of moving
	}
	if (event.keyCode === 68) {
		//right
		Body.setVelocity(ball, { x: x + 5, y: y }); //adding 5 to speed of moving
	}
	if (event.keyCode === 83) {
		//down
		Body.setVelocity(ball, { x: x, y: y + 5 }); //adding 5 to speed of moving
	}
	if (event.keyCode === 65) {
		//left
		Body.setVelocity(ball, { x: x - 5, y: y }); //adding 5 to speed of moving
	}
});

// colision event
Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [ 'ball', 'goal' ];
		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			document.querySelector('.winner').classList.remove('hidden');
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
