# Fysik Spil - Physics Game

An interactive 2D physics education game built with vanilla JavaScript and HTML5 Canvas. 

## Features

- **Gravity Simulation** - Realistic gravity physics
- **Ball Mechanics** - Launch balls with adjustable force and angle
- **Obstacle Drawing** - Draw custom obstacles for balls to interact with
- **Smooth Collision** - Swept collision detection ensures balls glide smoothly on surfaces
- **Ball-to-Ball Collisions** - Multiple balls can collide with each other
- **Target System** - Hit targets to score points
- **Real-time Physics** - Smooth 60 FPS physics simulation

## How to Play

1. Open `index.html` in a web browser
2. Draw obstacles by clicking and dragging on the canvas
3. Adjust **Kraft** (force) and **Vinkel** (angle) sliders
4. Click **Kast Bold!** to launch a ball
5. Try to hit the green targets
6. Launch multiple balls to create chain reactions

## Game Mechanics

- **Gravity**: Constant downward force affects all objects
- **Friction**: Balls lose speed over time
- **Restitution**: Balls bounce with realistic elasticity
- **Tangential Sliding**: Balls smoothly glide along surfaces instead of getting stuck

## Learning Concepts

- **Projectile Motion** - Understand how force and angle affect trajectory
- **Collision Physics** - See elastic and inelastic collisions in action
- **Friction & Energy** - Observe how energy dissipates through friction
- **Gravity** - Visualize constant acceleration due to gravity

## Technical Details

- **Language**: Vanilla JavaScript (ES6)
- **Rendering**: HTML5 Canvas API
- **Physics**: Custom physics engine with swept collision detection
- **No Dependencies**: Pure HTML/CSS/JavaScript

## Files

- `index.html` - Game structure and UI
- `style.css` - Styling and layout
- `script.js` - Physics engine and game logic
- `instruktioner_til_ai.md` - Detailed game documentation

## License

MIT
