(function () {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // HUD elements
    const elScore = document.getElementById('score');
    const elWave = document.getElementById('wave');
    const elAuto = document.getElementById('auto');
    const elMode = document.getElementById('mode');
    const elHealth = document.getElementById('health');
    const elHealth2 = document.getElementById('health2');
    const btnRestart = document.getElementById('restart');
    const btnToggleLandscape = document.getElementById('toggleLandscape');
    const btnToggleAutoAim = document.getElementById('toggleAutoAim');
    const btnToggleAutoFire = document.getElementById('toggleAutoFire');
    const btnFire = document.getElementById('btnFire');

    // input state
    const keys = {};
    const mouse = { x: W / 2, y: H / 2, down: false };
    const touchState = { up: false, down: false, left: false, right: false, fire: false };

    window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mousedown', e => mouse.down = true);
    window.addEventListener('mouseup', e => mouse.down = false);

    function updateTouchKeys() {
        keys['w'] = touchState.up;
        keys['a'] = touchState.left;
        keys['s'] = touchState.down;
        keys['d'] = touchState.right;
        mouse.down = touchState.fire || mouse.down;
    }

    function bindTouchButton(id, key) {
        const button = document.getElementById(id);
        if (!button) return;
        button.addEventListener('pointerdown', () => {
            touchState[key] = true;
            updateTouchKeys();
        });
        button.addEventListener('pointerup', () => {
            touchState[key] = false;
            updateTouchKeys();
        });
        button.addEventListener('pointercancel', () => {
            touchState[key] = false;
            updateTouchKeys();
        });
    }

    bindTouchButton('btnFire', 'fire');
    bindTouchButton('btnMoveUp', 'up');
    bindTouchButton('btnMoveLeft', 'left');
    bindTouchButton('btnMoveDown', 'down');
    bindTouchButton('btnMoveRight', 'right');

    // utils
    const SHOOT_COOLDOWN = 500;
    // shot sound - place your voiceover file at public/sfx/shoot.wav (or .mp3)
    const SHOT_SFX = '/public/awp-shoot-sound-effect-cs_go.mp3';
    const BGM_SRC = '/INTERWORLD - METAMORPHOSIS.mp3';
    let bgmAudio = null;
    function playShotSound() {
        try {
            const s = new Audio(SHOT_SFX);
            s.volume = 0.7;
            s.play().catch(() => { });
        } catch (e) { /* ignore */ }
    }
    function initBgm() {
        try {
            if (!bgmAudio) {
                bgmAudio = new Audio(BGM_SRC);
                bgmAudio.loop = true;
                bgmAudio.volume = 0.18;
                bgmAudio.preload = 'auto';
            }
        } catch (e) { bgmAudio = null; }
    }
    function playBgm() {
        initBgm();
        if (!bgmAudio) return;
        bgmAudio.currentTime = 0;
        bgmAudio.play().catch(() => { });
    }
    function stopBgm() {
        if (!bgmAudio) return;
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
    function dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function nearestEnemy(player) {
        if (!Game || !Game.enemies || Game.enemies.length === 0) return null;
        return Game.enemies.reduce((closest, enemy) => {
            return !closest || dist(player, enemy) < dist(player, closest) ? enemy : closest;
        }, null);
    }

    // classes
    class Player {
        constructor(opts = {}) {
            this.x = opts.x || W / 2; this.y = opts.y || H / 2; this.r = opts.r || 18; this.speed = opts.speed || 3.2;
            this.health = opts.health || 100; this.baseFireRate = opts.fireRate || SHOOT_COOLDOWN; this.fireRate = this.baseFireRate; this._lastFire = 0;
            this.color = opts.color || '#0ff'; this.controls = opts.controls || 'wasd'; this.lastDir = { x: 1, y: 0 };
            this.alive = true;
            this.gunBoostExpires = 0;
            this.shotCount = 1;
            this.shotModeExpires = 0;
            this.weaponMode = 'normal';
            this.weaponExpires = 0;
            this.machineFireRate = 120;
            this.auraUntil = 0;
        }
        update(dt) {
            const now = performance.now();
            if (this.gunBoostExpires && now > this.gunBoostExpires) {
                this.fireRate = this.baseFireRate;
                this.gunBoostExpires = 0;
            }
            if (this.shotModeExpires && now > this.shotModeExpires) {
                this.shotCount = 1;
                this.shotModeExpires = 0;
            }
            if (this.weaponExpires && now > this.weaponExpires) {
                this.weaponMode = 'normal';
                this.weaponExpires = 0;
                this.fireRate = this.baseFireRate;
            }
            let vx = 0, vy = 0;
            // only lock sides when PVP is active and a second player exists
            const isMultiplayerSides = Game && (Game.pvp && !!Game.player2);
            if (isMultiplayerSides) {
                // restrict to vertical movement only for each player's side
                if (this.controls === 'wasd') { if (keys['w']) vy -= 1; if (keys['s']) vy += 1; }
                else { if (keys['arrowup']) vy -= 1; if (keys['arrowdown']) vy += 1; }
            } else {
                if (this.controls === 'wasd') { if (keys['w']) vy -= 1; if (keys['s']) vy += 1; if (keys['a']) vx -= 1; if (keys['d']) vx += 1; }
                else { if (keys['arrowup']) vy -= 1; if (keys['arrowdown']) vy += 1; if (keys['arrowleft']) vx -= 1; if (keys['arrowright']) vx += 1; }
            }
            const len = Math.hypot(vx, vy) || 1; vx /= len; vy /= len;
            if (Math.abs(vx) + Math.abs(vy) > 0.001) { this.lastDir.x = vx; this.lastDir.y = vy; }
            this.x += vx * this.speed * dt; this.y += vy * this.speed * dt;
            // keep inside arena (with margin). In multiplayer lock x to side.
            if (isMultiplayerSides) {
                const fixedX = (this.controls === 'wasd') ? 60 : (W - 60);
                this.x = fixedX;
                this.y = clamp(this.y, 24, H - 24);
            } else {
                this.x = clamp(this.x, 24, W - 24);
                this.y = clamp(this.y, 24, H - 24);
            }
        }
        canFire(now) { return (now - this._lastFire) > this.fireRate; }
        fire(now, targetX, targetY) {
            this._lastFire = now;
            const angle = Math.atan2(targetY - this.y, targetX - this.x);
            const speed = 6.5;
            const vx = Math.cos(angle) * speed; const vy = Math.sin(angle) * speed;
            // spawn from a short energy emitter (close to the player center) to avoid 'rifle' appearance
            return new Projectile(this.x + Math.cos(angle) * (this.r + 2), this.y + Math.sin(angle) * (this.r + 2), vx, vy, this);
        }
        fireDirectional(now, angle) {
            this._lastFire = now;
            const speed = 6.5; const vx = Math.cos(angle) * speed; const vy = Math.sin(angle) * speed;
            return new Projectile(this.x + Math.cos(angle) * (this.r + 2), this.y + Math.sin(angle) * (this.r + 2), vx, vy, this);
        }
        shoot(angle) {
            const now = performance.now();
            this._lastFire = now;
            const bullets = [];
            const spread = 0.12;
            // play shot SFX once per shoot invocation (voiceover file can replace sfx/shoot.wav)
            playShotSound();
            if (this.weaponMode === 'beam') {
                bullets.push(new Projectile(this.x + Math.cos(angle) * (this.r + 4), this.y + Math.sin(angle) * (this.r + 4), Math.cos(angle) * 7, Math.sin(angle) * 7, this, 'beam'));
            } else if (this.shotCount === 1) {
                bullets.push(this.fireDirectional(now, angle));
            } else if (this.shotCount === 2) {
                bullets.push(this.fireDirectional(now, angle - spread));
                bullets.push(this.fireDirectional(now, angle + spread));
            } else {
                bullets.push(this.fireDirectional(now, angle));
                bullets.push(this.fireDirectional(now, angle - spread));
                bullets.push(this.fireDirectional(now, angle + spread));
            }
            return bullets;
        }
        applyGunBoost(now) {
            this.fireRate = Math.max(300, this.baseFireRate * 0.6);
            this.gunBoostExpires = now + 10000;
        }
        applyShotMode(now) {
            const prev = this.shotCount;
            if (this.shotCount === 1) this.shotCount = 2;
            else this.shotCount = 3;
            this.shotModeExpires = now + 10000000;
            console.log('applyShotMode: prev=', prev, 'now=', this.shotCount, 'expires=', this.shotModeExpires);
        }
        applyBeamMode(now) {
            this.weaponMode = 'beam';
            this.weaponExpires = now + 12000;
            this.fireRate = Math.max(200, this.baseFireRate * 0.8);
            console.log('Beam mode enabled until', this.weaponExpires);
        }
        applyMachineGunMode(now) {
            this.weaponMode = 'machine';
            this.weaponExpires = now + 12000;
            this.fireRate = this.machineFireRate;
            console.log('Machine gun mode enabled until', this.weaponExpires);
        }
        draw(ctx) {
            // neon body
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
            // inner core
            ctx.fillStyle = '#093042'; ctx.beginPath(); ctx.arc(0, 0, this.r * 0.6, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            if (performance.now() < this.auraUntil) {
                const auraAngle = Math.atan2(-this.lastDir.y, -this.lastDir.x);
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(auraAngle);
                const auraGrad = ctx.createLinearGradient(-this.r - 18, 0, -this.r - 4, 0);
                auraGrad.addColorStop(0, 'rgba(255,40,40,0.0)');
                auraGrad.addColorStop(0.35, 'rgba(255,40,40,0.45)');
                auraGrad.addColorStop(0.7, 'rgba(255,80,80,0.75)');
                auraGrad.addColorStop(1, 'rgba(255,120,120,1.0)');
                ctx.fillStyle = auraGrad;
                ctx.shadowColor = 'rgba(255,80,80,0.9)';
                ctx.shadowBlur = 18;
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(-this.r * 0.8, i * 4);
                    ctx.quadraticCurveTo(-this.r - 26, i * 12, -this.r - 10, i * 24);
                    ctx.quadraticCurveTo(-this.r - 4, i * 12, -this.r * 0.8, i * 4);
                    ctx.fill();
                }
                ctx.restore();
            }
            // energy emitter cone (neon front)
            // decide visual facing angle: during active battles or PVP we avoid using raw mouse for P1
            const inBattle = Game && Game.enemies && Game.enemies.length > 0;
            let angle;
            if (this.controls === 'wasd') {
                // Only disable raw mouse aim in PVP; in Solo or Duo keep mouse aiming active even during battles
                if (Game && Game.pvp) {
                    if (Game.player2 && Game.player2.alive) angle = Math.atan2(Game.player2.y - this.y, Game.player2.x - this.x);
                    else if (Game.autoAim) { const e = nearestEnemy(this); if (e) angle = Math.atan2(e.y - this.y, e.x - this.x); else angle = Math.atan2(this.lastDir.y, this.lastDir.x); }
                    else angle = Math.atan2(this.lastDir.y, this.lastDir.x);
                } else {
                    angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
                }
            } else {
                angle = Math.atan2(this.lastDir.y, this.lastDir.x);
            }
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            const g = ctx.createLinearGradient(0, -6, 36, 0);
            g.addColorStop(0, 'rgba(120,250,255,0.0)'); g.addColorStop(0.6, 'rgba(120,250,255,0.12)'); g.addColorStop(1, 'rgba(120,250,255,0.02)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.moveTo(this.r * 0.6, -8); ctx.lineTo(this.r + 28, 0); ctx.lineTo(this.r * 0.6, 8); ctx.closePath(); ctx.fill();
            ctx.restore();
            // shot-mode indicator above player
            if (this.shotCount && this.shotCount > 1) {
                ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
                const label = this.shotCount + 'x'; ctx.fillText(label, this.x, this.y - this.r - 10);
                ctx.restore();
            }
        }
    }
    class Enemy {
        constructor(x, y, speed, hp, color, isBoss = false) {
            this.x = x; this.y = y; this.r = isBoss ? 36 : 14; this.speed = speed; this.hp = hp; this.color = color; this.isBoss = !!isBoss;
        }
        update(dt, player) {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed * dt;
            this.y += Math.sin(angle) * this.speed * dt;
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            if (this.isBoss) {
                // boss: big neon orb with ring and HP bar
                const c = this.color;
                ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 28;
                ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
                // inner core
                ctx.fillStyle = '#08030a'; ctx.beginPath(); ctx.arc(0, 0, this.r * 0.55, 0, Math.PI * 2); ctx.fill();
                // hp bar
                const maxHp = this.maxHp || 6;
                const barW = this.r * 1.6; const barH = 6; const pct = Math.max(0, this.hp) / maxHp;
                ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-barW / 2, this.r + 8, barW, barH);
                ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-barW / 2, this.r + 8, barW * pct, barH);
            } else {
                ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.rect(-this.r, -this.r, this.r * 2, this.r * 2); ctx.fill();
                ctx.fillStyle = '#001'; ctx.fillRect(-6, -4, 12, 6);
            }
            ctx.restore();
        }
    }

    class Boss extends Enemy {
        constructor(x, y, speed, hp, color, type) {
            super(x, y, speed, hp, color, true);
            this.type = type;
            this.maxHp = hp;
            this.regenDelay = 3000;
            this.nextRegen = performance.now() + this.regenDelay;
            this.nextShoot = performance.now() + 1600;
            this.nextTeleport = performance.now() + 6000;
            this.nextBomb = performance.now() + 5000;
            this.teleportDelay = 6000;
            this.shootDelay = 2200;
            this.bombDelay = 5000;
            if (type === 'fast') {
                this.shootDelay = 1500;
                this.teleportDelay = 4000;
                this.bombDelay = 0;
                this.speed += 0.16;
                this.maxHp = hp + 2;
            }
            if (type === 'artillery') {
                this.shootDelay = 2600;
                this.teleportDelay = 9000;
                this.bombDelay = 4300;
                this.maxHp = hp + 1;
            }
            if (type === 'tank') {
                this.shootDelay = 2400;
                this.teleportDelay = 7000;
                this.bombDelay = 4000;
                this.regenDelay = 0;
                this.maxHp = hp + 5;
                this.hp = this.maxHp;
                this.speed = Math.max(0.25, this.speed - 0.08);
            }
        }
        update(dt, players) {
            if (!players || players.length === 0) return;
            const target = players.reduce((best, pl) => !best || dist(this, pl) < dist(this, best) ? pl : best, null);
            if (!target) return;
            const angle = Math.atan2(target.y - this.y, target.x - this.x);
            this.x += Math.cos(angle) * this.speed * dt;
            this.y += Math.sin(angle) * this.speed * dt;
            const now = performance.now();
            if (now > this.nextShoot) {
                this.nextShoot = now + this.shootDelay;
                const angleToPlayer = Math.atan2(target.y - this.y, target.x - this.x);
                const speed = 5.5;
                const px = Math.cos(angleToPlayer) * speed;
                const py = Math.sin(angleToPlayer) * speed;
                Game.projectiles.push(new Projectile(this.x + Math.cos(angleToPlayer) * (this.r + 4), this.y + Math.sin(angleToPlayer) * (this.r + 4), px, py, this, 'bullet'));
            }
            if (now > this.nextTeleport) {
                this.nextTeleport = now + this.teleportDelay;
                this.x = clamp(40 + Math.random() * (W - 80), 40, W - 40);
                this.y = clamp(40 + Math.random() * (H - 80), 40, H - 40);
            }
            if (this.bombDelay > 0 && now > this.nextBomb) {
                this.nextBomb = now + this.bombDelay;
                const bx = clamp(40 + Math.random() * (W - 80), 40, W - 40);
                const by = clamp(40 + Math.random() * (H - 80), 40, H - 40);
                Game.bombs.push(new Bomb(bx, by));
            }
            if (this.regenDelay > 0 && now > this.nextRegen) {
                this.nextRegen = now + this.regenDelay;
                this.hp = Math.min(this.maxHp, this.hp + 4);
            }
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 28;
            ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#08030a'; ctx.beginPath(); ctx.arc(0, 0, this.r * 0.55, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(this.type.toUpperCase(), 0, 4);
            const barW = this.r * 1.6; const barH = 6; const pct = Math.max(0, this.hp) / this.maxHp;
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(-barW / 2, this.r + 8, barW, barH);
            ctx.fillStyle = '#ff4d6d'; ctx.fillRect(-barW / 2, this.r + 8, barW * pct, barH);
            ctx.restore();
        }
    }

    class Projectile {
        constructor(x, y, vx, vy, owner = null, type = 'bullet') { this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.r = type === 'beam' ? 8 : 5; this.life = type === 'beam' ? 2200 : 2400; this.owner = owner; this.type = type; }
        update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt * 16; }
        draw(ctx) {
            if (this.type === 'beam') {
                ctx.save();
                ctx.strokeStyle = 'rgba(120,255,255,0.75)'; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(this.x - this.vx * 0.04, this.y - this.vy * 0.04); ctx.lineTo(this.x + this.vx * 0.25, this.y + this.vy * 0.25); ctx.stroke();
                ctx.restore();
            } else {
                ctx.save();
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 18);
                g.addColorStop(0, 'rgba(180,250,255,1)'); g.addColorStop(0.4, 'rgba(120,200,255,0.8)'); g.addColorStop(1, 'rgba(40,80,130,0)');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }
        }
    }

    class Bomb {
        constructor(x, y) { this.x = x; this.y = y; this.timer = 1800; this.radius = 10; this.exploded = false; this.explodeRadius = 90; }
        update(dt) {
            if (this.exploded) return;
            this.timer -= dt * 16;
            if (this.timer <= 0) this.exploded = true;
        }
        draw(ctx) {
            ctx.save();
            if (!this.exploded) {
                ctx.fillStyle = 'rgba(255,120,80,0.8)'; ctx.shadowColor = '#ff8a5c'; ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('B', this.x, this.y + 3);
            } else {
                ctx.strokeStyle = 'rgba(255,80,80,0.45)'; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.explodeRadius, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        }
        damageArea(player) {
            if (!this.exploded) return false;
            return dist(this, player) < this.explodeRadius + player.r;
        }
    }

    class HealthBox {
        constructor(x, y) {
            this.x = x; this.y = y; this.r = 14; this.heal = 40;
            this.color = '#6dff8a';
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 16;
            ctx.beginPath(); ctx.rect(-this.r, -this.r, this.r * 2, this.r * 2); ctx.fill();
            ctx.fillStyle = '#002b00'; ctx.fillRect(-6, -2, 12, 4);
            ctx.fillRect(-2, -6, 4, 12);
            ctx.restore();
        }
    }

    class GunBox {
        constructor(x, y) {
            this.x = x; this.y = y; this.r = 14;
            this.color = '#ffd25c';
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 16;
            ctx.beginPath(); ctx.rect(-this.r, -this.r, this.r * 2, this.r * 2); ctx.fill();
            ctx.fillStyle = '#5c3b00'; ctx.fillRect(-8, -2, 16, 4);
            ctx.fillRect(-2, -8, 4, 16);
            ctx.restore();
        }
    }

    class BeamBox {
        constructor(x, y) {
            this.x = x; this.y = y; this.r = 14;
            this.color = '#81d8ff';
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#c7f3ff'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.stroke();
            ctx.restore();
        }
    }

    class MachineGunBox {
        constructor(x, y) {
            this.x = x; this.y = y; this.r = 14;
            this.color = '#ff76d1';
        }
        draw(ctx) {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 18;
            ctx.beginPath(); ctx.rect(-this.r, -this.r, this.r * 2, this.r * 2); ctx.fill();
            ctx.fillStyle = '#29001c'; ctx.fillRect(-6, -3, 12, 6);
            ctx.fillStyle = '#fff'; ctx.fillRect(-2, -7, 4, 2);
            ctx.restore();
        }
    }

    // Game state
    const Game = {
        player: null,
        player2: null,
        duo: false,
        pvp: false,
        aimAssist: true,
        enemies: [],
        projectiles: [],
        healthBoxes: [],
        gunBoxes: [],
        beamBoxes: [],
        machineGunBoxes: [],
        bombs: [],
        autoAim: false,
        running: false,
        score: 0,
        wave: 0,
        round: 1,
        pvpMaxRounds: 3,
        roundWins: { p1: 0, p2: 0 },
        pvpWinner: null,
        pvpRoundActive: true,
        autoFire: false,
        autoFireP2: false,
        _lastAuto: 0,
        _lastAutoP2: 0,
        lastTime: 0,

        start() {
            // initialize players; only lock to vertical sides in PVP
            if (this.pvp) {
                this.player = new Player({ x: 60, y: H / 2, color: '#0ff', controls: 'wasd' });
                this.player2 = new Player({ x: W - 60, y: H / 2, color: '#ffb84d', controls: 'arrows' });
                // PVP comfort: enable auto-aim, but ensure auto-shoot is off
                this.autoAim = true;
                this.autoFire = false;
                this.autoFireP2 = false;
            } else if (this.duo) {
                // duo: place players near center but allow free movement
                this.player = new Player({ x: W / 2 - 80, y: H / 2, color: '#0ff', controls: 'wasd' });
                this.player2 = new Player({ x: W / 2 + 80, y: H / 2, color: '#ffb84d', controls: 'arrows' });
                this.autoFire = false;
                this.autoFireP2 = false;
            } else {
                this.player = new Player({ x: W / 2 - 40, y: H / 2, color: '#0ff', controls: 'wasd' });
                this.player2 = null;
            }
            this.enemies = []; this.projectiles = []; this.healthBoxes = []; this.gunBoxes = []; this.beamBoxes = []; this.machineGunBoxes = []; this.bombs = []; this.score = 0; this.wave = 0; this.round = 1; this.roundWins = { p1: 0, p2: 0 }; this.pvpWinner = null; this.pvpRoundActive = true; this.running = true; this._lastSpawn = performance.now(); this._lastBoss = performance.now(); this._lastPickup = performance.now(); if (!this.pvp) this.spawnWave(); playBgm(); this.lastTime = performance.now(); requestAnimationFrame(this.loop.bind(this)); updateHUD(); hideOverlay();
        },
        // spawn exactly 3 enemies every 3000ms; wave increments each spawn batch
        spawnWave() { this.wave += 1; const count = 3; const colors = ['#ff2d95', '#34f0e0', '#8a6dff', '#ffb84d']; for (let i = 0; i < count; i++) { const angle = Math.random() * Math.PI * 2; const radius = Math.max(W, H) / 2 + 40; const x = W / 2 + Math.cos(angle) * radius; const y = H / 2 + Math.sin(angle) * radius; const speed = 0.6 + Math.random() * 0.6 + this.wave * 0.03; const hp = 1; const color = colors[Math.floor(Math.random() * colors.length)]; this.enemies.push(new Enemy(x, y, speed, hp, color, false)); } updateHUD(); },
        // spawn a boss (every 10s)
        spawnBoss() { const angle = Math.random() * Math.PI * 2; const radius = Math.max(W, H) / 2 + 60; const x = W / 2 + Math.cos(angle) * radius; const y = H / 2 + Math.sin(angle) * radius; const types = ['fast', 'tank', 'artillery']; const type = types[Math.floor(Math.random() * types.length)]; let speed = 0.45 + Math.random() * 0.15; let hp = 6; let color = '#ff4d6d'; if (type === 'fast') { speed += 0.15; hp = 4; color = '#4dffb8'; } else if (type === 'tank') { speed -= 0.05; hp = 9; color = '#ffd24d'; } else if (type === 'artillery') { speed = 0.4; hp = 7; color = '#9d59ff'; } this.enemies.push(new Boss(x, y, speed, hp, color, type)); updateHUD(); },
        loop(now) {
            if (!this.running) return; const dt = Math.min(1, (now - this.lastTime) / 16.67); this.lastTime = now; // spawn timer: every 3000ms spawn a batch
            if (!this.pvp) {
                if (now - (this._lastSpawn || 0) > 3000) { this._lastSpawn = now; this.spawnWave(); }
                // boss spawn every 10s
                if (now - (this._lastBoss || 0) > 10000) { this._lastBoss = now; this.spawnBoss(); }
            } else {
                // in PVP mode, occasionally spawn pickups (10% chance every 3s)
                if (now - (this._lastPickup || 0) > 3000) {
                    this._lastPickup = now;
                    if (Math.random() < 0.14) {
                        const x = 40 + Math.random() * (W - 80);
                        const y = 40 + Math.random() * (H - 80);
                        this.healthBoxes.push(new HealthBox(x, y));
                    }
                    const drop = Math.random();
                    const x2 = 40 + Math.random() * (W - 80);
                    const y2 = 40 + Math.random() * (H - 80);
                    if (drop < 0.33) this.gunBoxes.push(new GunBox(x2, y2));
                    else if (drop < 0.66) this.beamBoxes.push(new BeamBox(x2, y2));
                    else this.machineGunBoxes.push(new MachineGunBox(x2, y2));
                }
            }
            // auto-fire: every 1000ms spawn 2 projectiles
            if (this.autoFire && (now - (this._lastAuto || 0) > SHOOT_COOLDOWN)) {
                this._lastAuto = now;
                if (this.player && this.player.alive) {
                    const target = (Game.autoAim ? nearestEnemy(this.player) : null);
                    const angle = target ? Math.atan2(target.y - this.player.y, target.x - this.player.x) : Math.atan2(mouse.y - this.player.y, mouse.x - this.player.x);
                    this.projectiles.push(...this.player.shoot(angle));
                }
            }
            if (this.autoFireP2 && (now - (this._lastAutoP2 || 0) > SHOOT_COOLDOWN)) {
                this._lastAutoP2 = now;
                if (this.player2 && this.player2.alive) {
                    const target = (Game.autoAim ? nearestEnemy(this.player2) : null);
                    const angle = target ? Math.atan2(target.y - this.player2.y, target.x - this.player2.x) : Math.atan2(this.player2.lastDir.y, this.player2.lastDir.x);
                    this.projectiles.push(...this.player2.shoot(angle));
                }
            }
            // player2 auto-fire is not automatic by default, but player2 can still be controlled with Enter
            this.update(dt); this.draw(); requestAnimationFrame(this.loop.bind(this));
        },

        update(dt) {
            if (!this.running) return;
            const alivePlayers = [this.player, this.player2].filter(pl => pl && pl.alive);
            if (alivePlayers.length === 0) {
                if (this.pvp) {
                    return this.handlePvpRoundResult('draw');
                }
                return this.gameOver();
            }
            if (this.player && this.player.alive) this.player.update(dt);
            if (this.player2 && this.player2.alive) this.player2.update(dt);
            // firing player1 (mouse or F key)
            // In PVP mode we disable mouse aiming for player1 and aim at player2 instead (or use lastDir).
            if (this.player && this.player.alive) {
                const targetEnemy1 = Game.autoAim ? nearestEnemy(this.player) : null;
                const p2 = (this.player2 && this.player2.alive) ? this.player2 : null;
                // helper to decide aim angle for player1
                const decideAngleP1 = (preferMouse) => {
                    if (Game.pvp) {
                        if (p2) return Math.atan2(p2.y - this.player.y, p2.x - this.player.x);
                        if (Game.autoAim && targetEnemy1) return Math.atan2(targetEnemy1.y - this.player.y, targetEnemy1.x - this.player.x);
                        return Math.atan2(this.player.lastDir.y, this.player.lastDir.x);
                    }
                    if (preferMouse) {
                        return Math.atan2(mouse.y - this.player.y, mouse.x - this.player.x);
                    }
                    if (targetEnemy1) return Math.atan2(targetEnemy1.y - this.player.y, targetEnemy1.x - this.player.x);
                    return Math.atan2(this.player.lastDir.y, this.player.lastDir.x);
                };

                if (mouse.down && this.player.canFire(performance.now())) {
                    let angle = decideAngleP1(!Game.pvp);
                    // apply aim assist when in battle
                    const inBattle = this.enemies && this.enemies.length > 0;
                    if (inBattle && Game.aimAssist) angle = applyAimAssist(this.player, angle);
                    this.projectiles.push(...this.player.shoot(angle));
                }
                if (keys['f'] && this.player.canFire(performance.now())) {
                    let angle = decideAngleP1(!Game.pvp);
                    const inBattle = this.enemies && this.enemies.length > 0;
                    if (inBattle && Game.aimAssist) angle = applyAimAssist(this.player, angle);
                    this.projectiles.push(...this.player.shoot(angle));
                }
            }
            // firing player2 (Enter key) — auto-aim only when Game.autoAim is true
            if (this.player2 && this.player2.alive && keys['enter'] && this.player2.canFire(performance.now())) {
                let angle = 0;
                // In PVP prefer aiming at player1
                if (Game.pvp && this.player && this.player.alive) {
                    angle = Math.atan2(this.player.y - this.player2.y, this.player.x - this.player2.x);
                } else {
                    const targetEnemy2 = Game.autoAim ? nearestEnemy(this.player2) : null;
                    if (targetEnemy2) {
                        angle = Math.atan2(targetEnemy2.y - this.player2.y, targetEnemy2.x - this.player2.x);
                    } else {
                        const dir = this.player2.lastDir;
                        if (Math.abs(dir.x) + Math.abs(dir.y) > 0.001) angle = Math.atan2(dir.y, dir.x);
                        else if (this.enemies.length > 0) { const e = this.enemies[0]; angle = Math.atan2(e.y - this.player2.y, e.x - this.player2.x); }
                    }
                }
                // apply aim-assist for player2 as well during battles
                const inBattle2 = this.enemies && this.enemies.length > 0;
                if (inBattle2 && Game.aimAssist) angle = applyAimAssist(this.player2, angle);
                this.projectiles.push(...this.player2.shoot(angle));
            }
            // update projectiles
            for (let i = this.projectiles.length - 1; i >= 0; i--) { const pr = this.projectiles[i]; pr.update(dt); if (pr.life <= 0 || pr.x < -20 || pr.x > W + 20 || pr.y < -20 || pr.y > H + 20) this.projectiles.splice(i, 1); }
            // update bombs
            for (let i = this.bombs.length - 1; i >= 0; i--) {
                const bomb = this.bombs[i]; bomb.update(dt);
                if (bomb.exploded) {
                    const playerList = [this.player, this.player2].filter(pl => pl && pl.alive);
                    for (const pl of playerList) {
                        if (bomb.damageArea(pl)) { pl.health -= 18; if (pl.health <= 0) pl.alive = false; }
                    }
                    this.bombs.splice(i, 1);
                }
            }
            // projectile vs player (PVP) - projectiles damage players by 10 HP
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const pr = this.projectiles[i];
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (pr.owner && pr.owner === pl) continue; // don't hit owner
                    if (dist(pr, pl) < pr.r + pl.r) {
                        // bullet hit player
                        pl.health -= 10;
                        this.projectiles.splice(i, 1);
                        updateHUD();
                        if (pl.health <= 0) {
                            pl.alive = false;
                            if (this.pvp) {
                                const alive = [this.player, this.player2].filter(p => p && p.alive);
                                if (alive.length <= 1) return this.handlePvpRoundResult();
                            }
                            const alive = [this.player, this.player2].filter(p => p && p.alive);
                            if (alive.length <= 1) { this.gameOver(); return; }
                        }
                        break;
                    }
                }
            }
            // update health boxes
            for (let i = this.healthBoxes.length - 1; i >= 0; i--) {
                const box = this.healthBoxes[i];
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (dist(box, pl) < box.r + pl.r) {
                        pl.health = clamp(pl.health + box.heal, 0, 100);
                        this.healthBoxes.splice(i, 1);
                        updateHUD();
                        break;
                    }
                }
            }
            // update gun boxes
            for (let i = this.gunBoxes.length - 1; i >= 0; i--) {
                const box = this.gunBoxes[i];
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (dist(box, pl) < box.r + pl.r) {
                        const now = performance.now();
                        console.log('GunBox picked by', pl === this.player ? 'P1' : 'P2', 'at', pl.x, pl.y);
                        pl.applyGunBoost(now);
                        if (typeof pl.applyShotMode === 'function') pl.applyShotMode(now);
                        this.gunBoxes.splice(i, 1);
                        updateHUD();
                        break;
                    }
                }
            }
            // update beam boxes
            for (let i = this.beamBoxes.length - 1; i >= 0; i--) {
                const box = this.beamBoxes[i];
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (dist(box, pl) < box.r + pl.r) {
                        const now = performance.now();
                        pl.applyBeamMode(now);
                        this.beamBoxes.splice(i, 1);
                        updateHUD();
                        break;
                    }
                }
            }
            // update machine gun boxes
            for (let i = this.machineGunBoxes.length - 1; i >= 0; i--) {
                const box = this.machineGunBoxes[i];
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (dist(box, pl) < box.r + pl.r) {
                        const now = performance.now();
                        pl.applyMachineGunMode(now);
                        this.machineGunBoxes.splice(i, 1);
                        updateHUD();
                        break;
                    }
                }
            }
            // update enemies
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const en = this.enemies[i];
                const alivePlayers = [this.player, this.player2].filter(pl => pl && pl.alive);
                if (alivePlayers.length > 0) {
                    if (en instanceof Boss) {
                        en.update(dt, alivePlayers);
                    } else {
                        const targetPlayer = alivePlayers.reduce((best, pl) => {
                            return !best || dist(en, pl) < dist(en, best) ? pl : best;
                        }, null);
                        if (targetPlayer) en.update(dt, targetPlayer);
                    }
                }
                // collision with players
                let collided = false;
                const playersToCheck = [this.player, this.player2].filter(pl => pl && pl.alive);
                for (const pl of playersToCheck) {
                    if (dist(en, pl) < en.r + pl.r) {
                        pl.health -= 14;
                        if (pl.health <= 0) pl.alive = false;
                        this.enemies.splice(i, 1);
                        collided = true;
                        updateHUD();
                        if ([this.player, this.player2].filter(p => p && p.alive).length === 0) { this.gameOver(); return; }
                        break;
                    }
                }
                if (collided) continue;
                // collision with projectiles
                for (let j = this.projectiles.length - 1; j >= 0; j--) {
                    const pr = this.projectiles[j]; if (dist(en, pr) < en.r + pr.r) {
                        this.projectiles.splice(j, 1);
                        en.hp -= 1;
                        if (en.hp <= 0) { // enemy dies
                            const reward = en.isBoss ? 100 : 10;
                            if (!en.isBoss && pr.owner && pr.owner.alive) {
                                pr.owner.health = clamp(pr.owner.health + 3, 0, 100);
                            }
                            if (en.isBoss) {
                                if (pr.owner && pr.owner instanceof Player) {
                                    pr.owner.auraUntil = Math.max(pr.owner.auraUntil, performance.now() + 8000);
                                }
                                this.healthBoxes.push(new HealthBox(en.x, en.y));
                                const drop = Math.random();
                                if (drop < 0.33) {
                                    this.gunBoxes.push(new GunBox(en.x, en.y));
                                } else if (drop < 0.66) {
                                    this.beamBoxes.push(new BeamBox(en.x, en.y));
                                } else {
                                    this.machineGunBoxes.push(new MachineGunBox(en.x, en.y));
                                }
                                console.log('Boss drop spawned at', en.x, en.y);
                            }
                            this.enemies.splice(i, 1);
                            this.score += reward;
                            updateHUD();
                            break;
                        } else { // boss hit but alive
                            updateHUD();
                            break;
                        }
                    }
                }
            }
            // spawning handled by timed spawner (3 enemies every 3s)
        },

        // helper to spawn a projectile from player directly (bypass player.fire rate checks)
        _spawnProjectile(angle) { this._spawnProjectileFrom(this.player, angle); },
        _spawnProjectileFrom(player, angle) {
            const speed = 6.5;
            const vx = Math.cos(angle) * speed; const vy = Math.sin(angle) * speed;
            const x = player.x + Math.cos(angle) * (player.r + 2);
            const y = player.y + Math.sin(angle) * (player.r + 2);
            this.projectiles.push(new Projectile(x, y, vx, vy));
        },

        draw() { // clear
            ctx.clearRect(0, 0, W, H);
            // arena grid / neon effect
            drawArena();
            // projectiles
            for (const pr of this.projectiles) pr.draw(ctx);
            // bombs
            for (const bomb of this.bombs) bomb.draw(ctx);
            // enemies
            for (const en of this.enemies) en.draw(ctx);
            // health boxes
            for (const box of this.healthBoxes) box.draw(ctx);
            // gun boxes
            for (const box of this.gunBoxes) box.draw(ctx);
            // beam boxes
            for (const box of this.beamBoxes) box.draw(ctx);
            // machine gun boxes
            for (const box of this.machineGunBoxes) box.draw(ctx);
            // players
            if (this.player && this.player.alive) this.player.draw(ctx);
            if (this.player2 && this.player2.alive) this.player2.draw(ctx);
            // optional HUD crosshair
            drawCrosshair(mouse.x, mouse.y);
            if (!this.running) drawOverlay();
        },

        gameOver() { this.running = false; stopBgm(); showOverlay('Game Over', 'Score: ' + this.score); },
        handlePvpRoundResult(result) {
            if (!this.pvp || !this.pvpRoundActive) return;
            this.pvpRoundActive = false;
            const p1Dead = !this.player || !this.player.alive;
            const p2Dead = !this.player2 || !this.player2.alive;
            if (result === 'draw' || (p1Dead && p2Dead)) {
                this.roundWins.p1 += 1;
                this.roundWins.p2 += 1;
            } else if (p1Dead) {
                this.roundWins.p2 += 1;
            } else if (p2Dead) {
                this.roundWins.p1 += 1;
            }
            updateHUD();
            if (this.roundWins.p1 > this.pvpMaxRounds / 2 || this.roundWins.p2 > this.pvpMaxRounds / 2 || this.round >= this.pvpMaxRounds) {
                this.pvpWinner = this.roundWins.p1 > this.roundWins.p2 ? 'P1' : this.roundWins.p2 > this.roundWins.p1 ? 'P2' : 'Draw';
                this.running = false;
                showOverlay('Match Over', this.pvpWinner === 'Draw' ? 'Match Tied' : this.pvpWinner + ' Wins!');
                return;
            }
            this.round += 1;
            this.projectiles = [];
            this.bombs = [];
            this.healthBoxes = [];
            this.gunBoxes = [];
            this.beamBoxes = [];
            this.machineGunBoxes = [];
            if (this.player) {
                this.player.health = 100;
                this.player.alive = true;
                this.player.x = 60;
                this.player.y = H / 2;
            }
            if (this.player2) {
                this.player2.health = 100;
                this.player2.alive = true;
                this.player2.x = W - 60;
                this.player2.y = H / 2;
            }
            this.pvpRoundActive = true;
            updateHUD();
        },
        restart() { this.start(); }
    };

    function drawArena() { // subtle grid and glow center
        // dim vignette
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(8,16,30,0.0)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // radial center glow
        const rg = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 380); rg.addColorStop(0, 'rgba(10,60,80,0.14)'); rg.addColorStop(1, 'rgba(4,6,10,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

        // grid lines
        ctx.save(); ctx.strokeStyle = 'rgba(60,150,200,0.03)'; ctx.lineWidth = 1; for (let i = 0; i < 20; i++) { const y = (i / 20) * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
    }

    function drawCrosshair(x, y) { ctx.save(); ctx.strokeStyle = 'rgba(180,255,255,0.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }

    // aim-assist helpers
    function normalizeAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
    function applyAimAssist(player, baseAngle) {
        if (!Game || !Game.aimAssist) return baseAngle;
        const radius = 120;
        const e = nearestEnemy(player);
        if (!e) return baseAngle;
        if (dist(player, e) > radius) return baseAngle;
        const enemyAngle = Math.atan2(e.y - player.y, e.x - player.x);
        const diff = normalizeAngle(enemyAngle - baseAngle);
        if (Math.abs(diff) > 1.2) return baseAngle;
        const blend = 0.6; // how strongly to nudge toward enemy
        return baseAngle + diff * blend;
    }

    function updateHUD() {
        elScore.textContent = 'Score: ' + Game.score;
        elWave.textContent = Game.pvp ? 'Round: ' + Game.round + '/' + Game.pvpMaxRounds : 'Wave: ' + Game.wave;
        elHealth.textContent = 'P1: ' + Math.max(0, Math.round(Game.player ? Game.player.health : 0));
        if (elHealth2) elHealth2.textContent = 'P2: ' + (Game.player2 ? Math.max(0, Math.round(Game.player2.health)) : '-');
        updateAutoHUD(); updateModeHUD();
    }
    function updateAutoHUD() { if (elAuto) elAuto.textContent = 'P1 Auto: ' + (Game.autoFire ? 'On' : 'Off') + ' | P2 Auto: ' + (Game.autoFireP2 ? 'On' : 'Off') + ' | Aim: ' + (Game.autoAim ? 'On' : 'Off'); }
    function updateModeHUD() {
        if (elMode) {
            let text = 'Mode: ' + (Game.duo ? 'Duo' : 'Solo');
            if (Game.pvp) {
                text += ' | PVP | Round ' + Game.round + '/' + Game.pvpMaxRounds + ' | P1 ' + Game.roundWins.p1 + ' - ' + Game.roundWins.p2 + ' P2';
            }
            if (Game.aimAssist) text += ' | AimAssist';
            elMode.textContent = text;
        }
    }

    // overlay handling
    let overlayEl = null;
    function showOverlay(title = 'Game Over', text = 'Score: ' + Game.score) {
        if (overlayEl) return;
        overlayEl = document.createElement('div'); overlayEl.className = 'overlay';
        const panel = document.createElement('div'); panel.className = 'panel';
        const h2 = document.createElement('h2'); h2.textContent = title;
        const p = document.createElement('p'); p.textContent = text;
        const btn = document.createElement('button'); btn.textContent = 'Restart';
        btn.addEventListener('click', () => { Game.restart(); const parent = document.querySelector('.game-area'); if (parent && overlayEl) { parent.removeChild(overlayEl); } overlayEl = null; });
        panel.appendChild(h2); panel.appendChild(p); panel.appendChild(btn); overlayEl.appendChild(panel);
        document.querySelector('.game-area').appendChild(overlayEl);
    }
    function hideOverlay() { if (overlayEl) { const parent = document.querySelector('.game-area'); if (parent && parent.contains(overlayEl)) parent.removeChild(overlayEl); overlayEl = null; } }
    function drawOverlay() { /* placeholder if needed on canvas */ }

    // start menu overlay (choose Solo or Duo)
    function showStartMenu() { if (overlayEl) return; overlayEl = document.createElement('div'); overlayEl.className = 'overlay'; const panel = document.createElement('div'); panel.className = 'panel'; const h2 = document.createElement('h2'); h2.textContent = 'Neon Arena'; const p = document.createElement('p'); p.textContent = 'Choose mode to start'; const btnSolo = document.createElement('button'); btnSolo.textContent = 'Solo'; btnSolo.addEventListener('click', () => { Game.duo = false; Game.pvp = false; Game.start(); const parent = document.querySelector('.game-area'); if (parent && overlayEl) { parent.removeChild(overlayEl); overlayEl = null; } }); const btnDuo = document.createElement('button'); btnDuo.textContent = 'Duo'; btnDuo.addEventListener('click', () => { Game.duo = true; Game.pvp = false; Game.start(); const parent = document.querySelector('.game-area'); if (parent && overlayEl) { parent.removeChild(overlayEl); overlayEl = null; } }); const btnPVP = document.createElement('button'); btnPVP.textContent = 'PVP'; btnPVP.addEventListener('click', () => { Game.pvp = true; Game.duo = false; Game.start(); const parent = document.querySelector('.game-area'); if (parent && overlayEl) { parent.removeChild(overlayEl); overlayEl = null; } }); panel.appendChild(h2); panel.appendChild(p); panel.appendChild(btnSolo); panel.appendChild(btnDuo); panel.appendChild(btnPVP); overlayEl.appendChild(panel); document.querySelector('.game-area').appendChild(overlayEl); }

    // restart button
    btnRestart.addEventListener('click', () => { Game.restart(); if (overlayEl) { document.querySelector('.game-area').removeChild(overlayEl); overlayEl = null; } });
    if (btnToggleLandscape) {
        btnToggleLandscape.addEventListener('click', () => {
            document.body.classList.toggle('landscape-mode');
            const active = document.body.classList.contains('landscape-mode');
            btnToggleLandscape.textContent = 'Landscape: ' + (active ? 'On' : 'Off');
        });
    }
    if (btnToggleAutoAim) {
        btnToggleAutoAim.addEventListener('click', () => {
            Game.autoAim = !Game.autoAim;
            btnToggleAutoAim.textContent = 'Auto Aim: ' + (Game.autoAim ? 'On' : 'Off');
            updateAutoHUD();
        });
    }
    if (btnToggleAutoFire) {
        btnToggleAutoFire.addEventListener('click', () => {
            Game.autoFire = !Game.autoFire;
            btnToggleAutoFire.textContent = 'Auto Fire: ' + (Game.autoFire ? 'On' : 'Off');
            updateAutoHUD();
        });
    }
    if (btnFire) {
        btnFire.addEventListener('pointerdown', () => { touchState.fire = true; updateTouchKeys(); });
        btnFire.addEventListener('pointerup', () => { touchState.fire = false; updateTouchKeys(); });
        btnFire.addEventListener('pointercancel', () => { touchState.fire = false; updateTouchKeys(); });
    }

    // auto-fire toggle (press G for P1, L for P2) and auto-aim toggle (T)
    window.addEventListener('keydown', e => {
        if (e.key === 'g' || e.key === 'G') {
            Game.autoFire = !Game.autoFire;
            updateAutoHUD();
        }
        if (e.key === 'l' || e.key === 'L') {
            Game.autoFireP2 = !Game.autoFireP2;
            updateAutoHUD();
        }
        if (e.key === 't' || e.key === 'T') {
            Game.autoAim = !Game.autoAim;
            updateAutoHUD();
        }
    });

    // start menu on entry
    showStartMenu();

})();