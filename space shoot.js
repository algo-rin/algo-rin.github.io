// Inisialisasi Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Variabel Game
let score = 0;
let gameOver = false;
let gameWon = false;  // Variabel untuk kondisi kemenangan
let bullets = [];
let enemies = [];
const targetScore = 100; // Skor untuk menang

// Memuat gambar roket dan alien
const rocketImg = new Image();
rocketImg.src = 'rocket (1).png'; // Gambar pesawat roket

const alienImg = new Image();
alienImg.src = 'alien.png'; // Gambar alien untuk musuh

// Objek pesawat (roket shooter)
let spaceship = {
    x: 370,
    y: 500,
    width: 60,
    height: 60,
    speed: 15
};

// Kontrol Pesawat dengan panah
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (e.key === 'ArrowRight' && spaceship.x < canvas.width - spaceship.width) spaceship.x += spaceship.speed;
    if (e.key === 'ArrowUp') shootBullet(); // Tembak peluru dengan spasi
});

// Fungsi untuk menembak peluru
function shootBullet() {
    bullets.push({
        x: spaceship.x + spaceship.width / 2 - 2.5,
        y: spaceship.y,
        width: 5,
        height: 10,
        speed: 10
    });
}

// Fungsi untuk membuat musuh (alien) secara acak
function spawnEnemy() {
    let x = Math.random() * (canvas.width - 50);
    enemies.push({
        x: x,
        y: 0,
        width: 50,
        height: 50,
        speed: 2
    });
}

// Update posisi peluru dan musuh
function update() {
    if (gameOver || gameWon) return; // Berhenti jika game selesai

    // Update posisi peluru
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Update posisi musuh (alien)
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) gameOver = true; // Game over jika alien mencapai bawah

        // Deteksi tabrakan peluru dengan alien
        bullets.forEach((bullet, bulletIndex) => {
            if (isColliding(bullet, enemy)) {
                score += 10;
                bullets.splice(bulletIndex, 1);
                enemies.splice(index, 1);

                // Periksa apakah skor sudah mencapai target untuk menang
                if (score >= targetScore) gameWon = true;
            }
        });
    });

    // Spawn alien secara acak
    if (Math.random() < 0.02) spawnEnemy();
}

// Fungsi untuk mendeteksi tabrakan
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Render objek di layar
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar roket sebagai pesawat
    ctx.drawImage(rocketImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Gambar peluru
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));

    // Gambar alien sebagai musuh
    enemies.forEach(enemy => {
        ctx.drawImage(alienImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Gambar skor
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Jika game berakhir, tampilkan pesan "Game Over"
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    }

    // Jika pemain menang, tampilkan pesan "You Win!"
    if (gameWon) {
        ctx.fillStyle = 'green';
        ctx.font = '40px Arial';
        ctx.fillText('You Win!', canvas.width / 2 - 100, canvas.height / 2);
    }
}

// Loop Game
function gameLoop() {
    update();
    draw();
    if (!gameOver && !gameWon) requestAnimationFrame(gameLoop);
}

// Mulai Game
gameLoop();
