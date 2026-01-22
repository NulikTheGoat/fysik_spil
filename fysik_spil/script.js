// Physics game with balls, gravity, and obstacles

class Ball {
    constructor(x, y, radius = 8) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.prevX = x;
        this.prevY = y;
        this.radius = radius;
        this.mass = radius;
        this.restitution = 0.7;
        this.friction = 0.99;
    }

    update(gravity, obstacles) {
        // Store previous position for swept collision detection
        this.prevX = this.x;
        this.prevY = this.y;
        
        // Apply gravity
        this.vy += gravity;
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -this.restitution;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -this.restitution;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -this.restitution;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -this.restitution;
        }

        // Check collision with obstacles using swept collision
        for (let obstacle of obstacles) {
            this.checkObstacleCollision(obstacle);
        }
    }

    checkObstacleCollision(obstacle) {
        // Subdivide long lines for better collision detection
        const segments = this.getLineSegments(obstacle);
        
        for (let segment of segments) {
            const p1 = { x: segment.startX, y: segment.startY };
            const p2 = { x: segment.endX, y: segment.endY };
            
            // Swept collision: check both current and previous position
            let collision = false;
            let closestPoint = null;
            
            // Check against current position
            closestPoint = this.getClosestPointOnLine(this.x, this.y, p1, p2);
            let dx = this.x - closestPoint.x;
            let dy = this.y - closestPoint.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.radius) {
                collision = true;
            } else {
                // Check if movement path intersects the line segment
                closestPoint = this.getClosestPointOnLine(this.prevX, this.prevY, p1, p2);
                dx = this.prevX - closestPoint.x;
                dy = this.prevY - closestPoint.y;
                distance = Math.sqrt(dx * dx + dy * dy);
                
                // Also check if line was crossed this frame
                if (distance < this.radius) {
                    collision = true;
                    // Use current position for collision response
                    closestPoint = this.getClosestPointOnLine(this.x, this.y, p1, p2);
                }
            }
            
            if (collision) {
                // Collision detected
                dx = this.x - closestPoint.x;
                dy = this.y - closestPoint.y;
                distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance === 0) distance = 0.001; // Prevent division by zero
                
                const angle = Math.atan2(dy, dx);
                
                // Push ball out of the surface
                this.x = closestPoint.x + Math.cos(angle) * this.radius;
                this.y = closestPoint.y + Math.sin(angle) * this.radius;
                
                // Calculate normal vector
                const normalX = Math.cos(angle);
                const normalY = Math.sin(angle);
                
                // Calculate tangent vector (perpendicular to normal)
                const tangentX = -normalY;
                const tangentY = normalX;
                
                // Decompose velocity into normal and tangential components
                const normalVel = this.vx * normalX + this.vy * normalY;
                const tangentVel = this.vx * tangentX + this.vy * tangentY;
                
                // Only reflect the normal component (inbound)
                // Keep tangential component for sliding
                const newNormalVel = normalVel > 0 ? -normalVel * this.restitution : 0;
                
                // Reconstruct velocity from components
                this.vx = newNormalVel * normalX + tangentVel * tangentX;
                this.vy = newNormalVel * normalY + tangentVel * tangentY;
                
                return; // Exit after first collision
            }
        }
    }

    getLineSegments(obstacle) {
        // Break long lines into smaller segments for solid collision
        const dx = obstacle.endX - obstacle.startX;
        const dy = obstacle.endY - obstacle.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const segmentLength = 10; // Maximum length of each segment
        const numSegments = Math.ceil(length / segmentLength);
        
        const segments = [];
        
        if (numSegments <= 1) {
            segments.push(obstacle);
        } else {
            for (let i = 0; i < numSegments; i++) {
                const t1 = i / numSegments;
                const t2 = (i + 1) / numSegments;
                
                segments.push({
                    startX: obstacle.startX + dx * t1,
                    startY: obstacle.startY + dy * t1,
                    endX: obstacle.startX + dx * t2,
                    endY: obstacle.startY + dy * t2
                });
            }
        }
        
        return segments;
    }

    getClosestPointOnLine(px, py, p1, p2) {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        const lengthSq = dx * dx + dy * dy;
        
        if (lengthSq === 0) return p1;
        
        let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        
        return {
            x: p1.x + t * dx,
            y: p1.y + t * dy
        };
    }

    draw(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#C92A2A';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isAtRest() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        return speed < 0.5;
    }
}

class Target {
    constructor(x, y, radius = 20) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.restitution = 1.5; // Bouncy bumper - more than elastic
    }

    checkCollision(ball) {
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + ball.radius;
    }

    bounceOffBall(ball) {
        // Bumper collision - bounce the ball away
        const dx = ball.x - this.x;
        const dy = ball.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return; // Prevent division by zero
        
        // Normal vector pointing from bumper to ball
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Push ball away from bumper
        ball.x = this.x + nx * (this.radius + ball.radius);
        ball.y = this.y + ny * (this.radius + ball.radius);
        
        // Reflect and amplify velocity
        const dotProduct = ball.vx * nx + ball.vy * ny;
        ball.vx = nx * dotProduct * 2 * this.restitution - ball.vx;
        ball.vy = ny * dotProduct * 2 * this.restitution - ball.vy;
    }

    draw(ctx) {
        // Draw bumper as a filled circle with a border
        ctx.fillStyle = '#FF1744'; // Red bumper
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#C41C3B';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Obstacle {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    draw(ctx) {
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let balls = [];
let obstacles = [];
let targets = [];
let gameState = 'drawing'; // 'drawing' or 'playing'
let isDrawing = false;
let currentPath = []; // Points for current free hand drawing
let ballsLaunched = 0;
let targetsHit = 0;

// Initialize game
function initGame() {
    // Create targets
    targets = [
        new Target(800, 100),
        new Target(900, 200),
        new Target(150, 150),
        new Target(300, 300)
    ];

    // Reset counters
    ballsLaunched = 0;
    targetsHit = 0;
    updateStats();
}

// Setup event listeners
const strengthInput = document.getElementById('strength');
const angleInput = document.getElementById('angle');
const strengthValue = document.getElementById('strengthValue');
const angleValue = document.getElementById('angleValue');
const launchBtn = document.getElementById('launchBtn');
const resetBtn = document.getElementById('resetBtn');
const modeText = document.getElementById('modeText');
const instructionText = document.getElementById('instructionText');

strengthInput.addEventListener('input', (e) => {
    strengthValue.textContent = e.target.value;
});

angleInput.addEventListener('input', (e) => {
    angleValue.textContent = e.target.value;
});

launchBtn.addEventListener('click', launchBall);
resetBtn.addEventListener('click', resetGame);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    if (gameState !== 'drawing') return;
    
    const rect = canvas.getBoundingClientRect();
    currentPath = [{
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }];
    isDrawing = true;
}

function draw(e) {
    if (!isDrawing || gameState !== 'drawing') return;

    const rect = canvas.getBoundingClientRect();
    const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    // Add point if it's far enough from the last point (avoid too many points)
    const lastPoint = currentPath[currentPath.length - 1];
    const dx = point.x - lastPoint.x;
    const dy = point.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 3) {
        currentPath.push(point);
    }
}

function stopDrawing() {
    if (!isDrawing) return;
    
    // Create obstacles from the path segments
    if (currentPath.length > 1) {
        for (let i = 0; i < currentPath.length - 1; i++) {
            obstacles.push(new Obstacle(
                currentPath[i].x,
                currentPath[i].y,
                currentPath[i + 1].x,
                currentPath[i + 1].y
            ));
        }
    }
    
    isDrawing = false;
    currentPath = [];
}

function launchBall() {
    // Allow launching during both drawing and playing states
    const strength = parseFloat(strengthInput.value) / 2;
    const angleDegrees = parseFloat(angleInput.value);
    const angleRadians = (angleDegrees * Math.PI) / 180;

    // Remove old ball if one exists and hasn't come to rest
    // balls = [];

    const ball = new Ball(100, canvas.height - 100);
    ball.vx = Math.cos(angleRadians) * strength;
    ball.vy = -Math.sin(angleRadians) * strength;

    balls.push(ball);
    ballsLaunched++;
    gameState = 'playing';
    updateGameMode();
    updateStats();
}

function resetGame() {
    balls = [];
    obstacles = [];
    gameState = 'drawing';
    launchBtn.disabled = false;
    initGame();
    updateGameMode();
}

function updateGameMode() {
    if (gameState === 'drawing') {
        modeText.textContent = 'Tilstand: Tegning af hindringer';
        instructionText.textContent = 'Tegn hindringer ved at klikke og trække på canvas\'et';
        launchBtn.disabled = false;
    } else if (gameState === 'playing') {
        modeText.textContent = 'Tilstand: Bold kastet!';
        instructionText.textContent = 'Vent til bolden er i ro eller kast igen';
        launchBtn.disabled = false;
    }
}

function updateStats() {
    document.getElementById('ballCount').textContent = ballsLaunched;
    document.getElementById('targetsHit').textContent = targetsHit;
}

function isGameActive() {
    return balls.some(ball => !ball.isAtRest());
}

function checkBallCollision(ball1, ball2) {
    // Calculate distance between balls
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = ball1.radius + ball2.radius;

    if (distance < minDistance) {
        // Collision detected
        // Normalize collision vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Separate overlapping balls
        const overlap = minDistance - distance;
        const separationX = (overlap / 2) * nx;
        const separationY = (overlap / 2) * ny;

        ball1.x -= separationX;
        ball1.y -= separationY;
        ball2.x += separationX;
        ball2.y += separationY;

        // Calculate relative velocity
        const dvx = ball2.vx - ball1.vx;
        const dvy = ball2.vy - ball1.vy;

        // Relative velocity along collision normal
        const dvDotN = dvx * nx + dvy * ny;

        // Don't collide if balls are moving apart
        if (dvDotN >= 0) return;

        // Calculate restitution (bounciness)
        const restitution = Math.min(ball1.restitution, ball2.restitution);

        // Calculate impulse scalar
        const impulse = -(1 + restitution) * dvDotN / (1 / ball1.mass + 1 / ball2.mass);

        // Apply impulse
        const impulseX = impulse * nx;
        const impulseY = impulse * ny;

        ball1.vx -= impulseX / ball1.mass;
        ball1.vy -= impulseY / ball1.mass;
        ball2.vx += impulseX / ball2.mass;
        ball2.vy += impulseY / ball2.mass;
    }
}

const GRAVITY = 0.5;

function update() {
    // Update all balls
    for (let ball of balls) {
        ball.update(GRAVITY, obstacles);
    }

    // Check collisions between balls
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            checkBallCollision(balls[i], balls[j]);
        }
    }

    // Check collisions with targets
    for (let ball of balls) {
        for (let target of targets) {
            if (target.checkCollision(ball)) {
                target.bounceOffBall(ball);
                targetsHit++;
                updateStats();
            }
        }
    }
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#E8F4F8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid for reference
    ctx.strokeStyle = '#D0D0D0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw launch point
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(100, canvas.height - 100, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw angle indicator
    const angleDegrees = parseFloat(angleInput.value);
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const launchX = 100;
    const launchY = canvas.height - 100;
    const indicatorLength = 80;
    const targetX = launchX + Math.cos(angleRadians) * indicatorLength;
    const targetY = launchY - Math.sin(angleRadians) * indicatorLength;

    // Draw angle line
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(launchX, launchY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw angle arc
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(launchX, launchY, 30, -Math.PI / 2, -Math.PI / 2 + angleRadians, false);
    ctx.stroke();

    // Draw angle text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(angleDegrees + '°', launchX + 40, launchY - 35);

    // Draw obstacles
    for (let obstacle of obstacles) {
        obstacle.draw(ctx);
    }

    // Draw targets
    for (let target of targets) {
        target.draw(ctx);
    }

    // Draw balls
    for (let ball of balls) {
        ball.draw(ctx);
    }

    // Draw current free hand path being drawn
    if (isDrawing && currentPath.length > 0) {
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        
        for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize and start game
initGame();
updateGameMode();
gameLoop();
