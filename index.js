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
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), //top
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), //left
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }), //right
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }) //bot
];
//add walls
World.add(world, walls);
