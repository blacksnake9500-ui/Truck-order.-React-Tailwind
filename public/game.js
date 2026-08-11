(function () {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const road = { x: W * 0.15, w: W * 0.7 };

    let player, obstacles, lines, score, speed, spawnTimer, gameOver;

    function init() {
        const baseY = H - 120;
        player = { w: 40, h: 70, x: W / 2 - 20, y: baseY, baseY, sx: 0, maxSpeed: 6, nitro: 100, nitroActive: false, flyHeight: 140, flySmooth: 0.18 };
        obstacles = [];
        lines = [];
        for (let i = 0; i < 10; i++) lines.push({ x: W / 2 - 2.5, y: i * 80 });
        score = 0; speed = 3; spawnTimer = 0; gameOver = false;
        document.getElementById('score').textContent = 'Score: 0';
        updateNitroBar();
        animate();
    }

    function spawnObstacle() {
        const laneWidth = road.w - 40;
        const xMin = road.x + 20;
        const x = xMin + Math.random() * (laneWidth - 40);
        const w = 40 + Math.random() * 40;
        const h = 50 + Math.random() * 60;
        const colors = ['#c0392b', '#f39c12', '#8e44ad', '#2980b9', '#e74c3c', '#d35400'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const speedFactor = 0.6 + Math.random() * 1.4; // per-obstacle speed multiplier
        obstacles.push({ x, y: -h, w, h, color, speedFactor });
    }

    function rectsOverlap(a, b) {
        return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
    }

    // input
    const keys = { left: false, right: false };
    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    // touch support (simple)
    let touchX = null;
    canvas.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
    canvas.addEventListener('touchmove', e => { touchX = e.touches[0].clientX; e.preventDefault(); });
    canvas.addEventListener('touchend', () => touchX = null);

    function update() {
        if (gameOver) return;
        // player movement
        let move = 0;
        if (keys.left) move = -player.maxSpeed;
        if (keys.right) move = player.maxSpeed;
        if (touchX !== null) {
            const rect = canvas.getBoundingClientRect();
            const tx = touchX - rect.left;
            move = (tx - (player.x + player.w / 2)) * 0.08;
            move = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, move));
        }
        player.x += move;
        // clamp to road
        const leftBound = road.x + 10;
        const rightBound = road.x + road.w - player.w - 10;
        player.x = Math.max(leftBound, Math.min(rightBound, player.x));

        // vertical fly movement: when nitroActive, smoothly move upward to simulate flying over cars
        const targetY = (player.nitroActive && player.nitro > 0) ? Math.max(20, player.baseY - player.flyHeight) : player.baseY;
        player.y += (targetY - player.y) * player.flySmooth;

        // update lines
        for (let line of lines) {
            line.y += speed;
            if (line.y > H) line.y -= H + 80;
        }
    
        // nitro handling
        const nitroConsume = 0.9;
        const nitroRecharge = 0.35;
        if (player.nitroActive && player.nitro > 0) {
            player.nitro = Math.max(0, player.nitro - nitroConsume);
            if (player.nitro <= 0) player.nitroActive = false;
        } else if (!player.nitroActive && player.nitro < 100) {
            player.nitro = Math.min(100, player.nitro + nitroRecharge);
        }
        updateNitroBar();

        // obstacles
        spawnTimer += 1;
        if (spawnTimer > 90 - Math.min(60, Math.floor(score / 5))) { spawnTimer = 0; spawnObstacle(); }
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const ob = obstacles[i];
            ob.y += speed * ob.speedFactor;
            if (ob.y > H) { obstacles.splice(i, 1); score += 1; document.getElementById('score').textContent = 'Score: ' + score; if (score % 10 === 0) speed += 0.5; }
            // collision (skip if nitro active)
            if (!player.nitroActive && rectsOverlap(player, ob)) { gameOver = true; }
        }
    }

    function draw() {
        // clear
        ctx.clearRect(0, 0, W, H);

        // background grass
        ctx.fillStyle = '#116';
        ctx.fillRect(0, 0, W, H);

        // road
        ctx.fillStyle = '#444';
        ctx.fillRect(road.x, 0, road.w, H);

        // side lines
        ctx.fillStyle = '#999';
        ctx.fillRect(road.x + 6, 0, 4, H);
        ctx.fillRect(road.x + road.w - 10, 0, 4, H);

        // center dashed lines
        ctx.fillStyle = '#fff';
        for (let line of lines) {
            ctx.fillRect(W / 2 - 3, line.y, 6, 40);
        }

        // obstacles
        for (let ob of obstacles) {
            ctx.fillStyle = ob.color || '#c0392b';
            roundRect(ctx, ob.x, ob.y, ob.w, ob.h, 6, true);
        }

        // player car (nitro glow)
        if (player.nitroActive) {
            ctx.save();
            ctx.shadowColor = '#7efcdd';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#27ae60';
            roundRect(ctx, player.x, player.y, player.w, player.h, 8, true);
            ctx.restore();
        } else {
            ctx.fillStyle = '#2ecc71';
            roundRect(ctx, player.x, player.y, player.w, player.h, 8, true);
        }
        // windows
        ctx.fillStyle = '#1b6b4a';
        ctx.fillRect(player.x + 8, player.y + 14, player.w - 16, 22);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#fff';
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', W / 2, H / 2 - 22);
            ctx.font = '18px Arial';
            ctx.fillText('Score: ' + score, W / 2, H / 2 + 6);
            ctx.font = '14px Arial';
            ctx.fillText('Press R or Restart to play again', W / 2, H / 2 + 36);
        }
    }

    function animate() {
        update();
        draw();
        if (!gameOver) requestAnimationFrame(animate);
    }

    function roundRect(ctx, x, y, w, h, r, fill) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fill) ctx.fill(); else ctx.stroke();
    }

    document.getElementById('restart').addEventListener('click', () => {
        init();
    });

    // nitro input: hold Shift or Space to activate
    window.addEventListener('keydown', e => {
        if (gameOver) return;
        if (e.key === 'Shift' || e.key === ' ' || e.code === 'Space') {
            if (player && player.nitro > 2) player.nitroActive = true;
        }
        if (e.key === 'r' || e.key === 'R') {
            init();
        }
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'Shift' || e.key === ' ' || e.code === 'Space') {
            if (player) player.nitroActive = false;
        }
    });

    function updateNitroBar(){
        const el = document.getElementById('nitro-bar');
        if(!el || !player) return;
        el.style.width = player.nitro + '%';
        el.style.opacity = player.nitro > 0 ? '1' : '0.4';
    }

    // start
    init();
})();