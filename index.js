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
const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;

//cells
const cells = 3;

//wall length
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: width,
		height: height,
		wireframes: true
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Create Walls
const walls = [
	// position - center of element (x,y, width, height )
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), //top
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), //left
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }), //right
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }) //bot
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

const grid = Array(cells).fill(null).map(() => {
	return Array(cells).fill(false);
});

// walls data
const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

// pick random starting cell

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

console.log(startRow, startColumn);

//iterating through maze cells
const stepThroughCell = (row, column) => {
	// check if i have visited cell at [row,col]
	if (grid[row][column]) {
		return;
	}
	// mark visited cell
	grid[row][column] = true;

	// assemble randomly order list of neigbour
	const neighbours = [
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	];
	shuffle(neighbours);

	// foreach neighbour
	for (const neighbor of neighbours) {
		const [ nextRow, nextColumn, direction ] = neighbor;
		//see if neigbor is out of bounds
		if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
			columnIndex * unitLength + unitLength / 2,
			rowIndex * unitLength + unitLength,
			unitLength,
			10,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});

// drawing vertical wals
verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength,
			rowIndex * unitLength + unitLength / 2,
			10,
			unitLength,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});
