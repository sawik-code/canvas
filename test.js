//getting accest to matter objects
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

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
		wireframes: false
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

//add mouse to world
World.add(
	world,
	MouseConstraint.create(engine, {
		mouse: Mouse.create(render.canvas)
	})
);

// Create Walls
const walls = [
	Bodies.rectangle(400, 0, 800, 40, { isStatic: true }), //top
	Bodies.rectangle(0, 300, 40, 600, { isStatic: true }), //left
	Bodies.rectangle(800, 300, 40, 600, { isStatic: true }), //right
	Bodies.rectangle(400, 600, 800, 40, { isStatic: true }) //bot
];
//add walls
World.add(world, walls);

//create shape- rectangle
const shape = Bodies.rectangle(
	200,
	200,
	50,
	50
	// {
	// 	// isStatic: true //shape stay where it is
	// }
);

// add rectangle to world object
for (let i = 0; i < 60; i++) {
	if (Math.random() > 0.5) {
		World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
	} else {
		World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 20));
	}
}
