// Hàm thay thế placeholders bằng thông tin thực
function replaceUserInfo() {
    // Lấy tất cả text nodes và thay thế
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }
    
    textNodes.forEach(node => {
        if (node.nodeValue) {
            node.nodeValue = node.nodeValue
                .replace(/\[Name\]/g, userInfo.name)
                .replace(/\[Nickname\]/g, userInfo.nickname)
                .replace(/\[Age\]/g, userInfo.age);
        }
    });
    
    // Cập nhật title
    document.title = `Happy Birthday ${userInfo.name} ❤️`;
}

// Screen Management
let currentScreen = 'welcome-screen';

function switchScreen(fromScreen, toScreen) {
    const from = document.getElementById(fromScreen);
    const to = document.getElementById(toScreen);
    
    from.classList.remove('active');
    setTimeout(() => {
        to.classList.add('active');
        currentScreen = toScreen;
    }, 500);
}

// Fireworks Animation
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }
    
    createParticles() {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff85a2'];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 100,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 2;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }
    
    draw() {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 100;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}

let fireworks = [];
let fireworkInterval;

function startFireworks() {
    fireworkInterval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(x, y));
    }, 500);
    
    animateFireworks();
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    
    if (currentScreen === 'welcome-screen') {
        requestAnimationFrame(animateFireworks);
    }
}

// Confetti Effect
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff85a2', '#a29bfe'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Countdown Timer
function startCountdown() {
    const countdownNumber = document.querySelector('.countdown-number');
    let count = 3;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = 'none';
            setTimeout(() => {
                countdownNumber.style.animation = 'countdownPop 1s ease-in-out';
            }, 10);
        } else {
            clearInterval(interval);
            createConfetti();
            setTimeout(() => {
                switchScreen('countdown-screen', 'card-screen');
                createFloatingHearts();
            }, 500);
        }
    }, 1000);
}

// Floating Hearts
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    
    setInterval(() => {
        if (currentScreen === 'card-screen') {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.animation = `floatHeart ${Math.random() * 5 + 8}s linear`;
            container.appendChild(heart);
            
            setTimeout(() => heart.remove(), 13000);
        }
    }, 800);
}

// Envelope Animation
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const cardContainer = document.querySelector('.card-container');
let envelopeOpened = false;

envelope.addEventListener('click', () => {
    if (!envelopeOpened) {
        envelope.classList.add('open');
        cardContainer.classList.add('opened');
        envelopeOpened = true;
        createConfetti();
        
        // Play a sound effect (optional - requires audio file)
        // const audio = new Audio('open.mp3');
        // audio.play();
    }
});

// Next Button - Go to GIF Screen
document.getElementById('goto-gift-btn').addEventListener('click', () => {
    console.log('Goto gift button clicked');
    switchScreen('card-screen', 'gallery-screen');
    createFloatingBalloons();
    
    // Delay để ensure screen đã switch xong
    setTimeout(() => {
        console.log('Calling playBirthdayGif');
        playBirthdayGif();
    }, 600);
});

// Floating Balloons
function createFloatingBalloons() {
    const container = document.querySelector('.floating-balloons');
    const balloons = ['🎈', '🎉', '🎊', '🎁'];
    
    setInterval(() => {
        if (currentScreen === 'gallery-screen') {
            const balloon = document.createElement('div');
            balloon.textContent = balloons[Math.floor(Math.random() * balloons.length)];
            balloon.style.position = 'absolute';
            balloon.style.left = Math.random() * 100 + '%';
            balloon.style.fontSize = (Math.random() * 30 + 30) + 'px';
            balloon.style.animation = `floatBalloon ${Math.random() * 5 + 12}s linear`;
            container.appendChild(balloon);
            
            setTimeout(() => balloon.remove(), 17000);
        }
    }, 1500);
}

// GIF Controls
let isGifPlaying = false;
let gifListenerAdded = false;
let isFirstLoad = true;

function playAudio() {
    const audio = document.getElementById('birthday-audio');
    if (audio) {
        audio.currentTime = 0; // Reset audio to start
        audio.play().catch(err => {
            console.log('Audio autoplay blocked:', err);
        });
    }
}

function setupGifListener() {
    const birthdayGif = document.getElementById('birthday-gif');
    
    if (birthdayGif && !gifListenerAdded) {
        // Lần đầu tiên: tự động chạy GIF
        if (isFirstLoad) {
            const gifPath = birthdayGif.getAttribute('data-gif');
            birthdayGif.src = gifPath;
            isGifPlaying = true;
            playAudio(); // Phát âm thanh
            console.log('GIF auto-playing on first load');
            
            // Sau khi GIF chạy xong, về lại thumbnail
            setTimeout(() => {
                birthdayGif.src = 'birthday_thumb.png';
                isGifPlaying = false;
                console.log('GIF ended, back to thumbnail');
            }, 1300); // 1.3 giây
            
            isFirstLoad = false;
        }
        
        // Add click listener để chạy lại GIF khi click
        birthdayGif.addEventListener('click', () => {
            if (!isGifPlaying) {
                // Load GIF thực tế
                const gifPath = birthdayGif.getAttribute('data-gif');
                birthdayGif.src = gifPath;
                isGifPlaying = true;
                playAudio(); // Phát âm thanh
                console.log('GIF started playing (by click)');
                
                // Sau khi GIF chạy xong, về lại thumbnail
                setTimeout(() => {
                    birthdayGif.src = 'birthday_thumb.png';
                    isGifPlaying = false;
                    console.log('GIF ended, back to thumbnail');
                }, 1300); // 1.3 giây
            }
        });
        gifListenerAdded = true;
        console.log('GIF listener setup complete');
    }
}

function playBirthdayGif() {
    // Setup listener khi screen hiển thị
    setupGifListener();
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Thay thế thông tin người dùng
    replaceUserInfo();
});

// Replay Button
document.getElementById('replay-btn').addEventListener('click', () => {
    // Reset all states
    envelopeOpened = false;
    envelope.classList.remove('open');
    cardContainer.classList.remove('opened');
    
    // Go back to welcome screen
    switchScreen('gallery-screen', 'welcome-screen');
    
    // Restart fireworks
    setTimeout(() => {
        startFireworks();
    }, 600);
});

// Start Button
document.getElementById('start-btn').addEventListener('click', () => {
    clearInterval(fireworkInterval);
    switchScreen('welcome-screen', 'countdown-screen');
    setTimeout(() => {
        startCountdown();
    }, 500);
});

// Initialize
window.addEventListener('load', () => {
    startFireworks();
});

// Responsive Canvas Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const sparkle = document.createElement('div');
        sparkle.className = 'confetti';
        sparkle.style.left = e.pageX + 'px';
        sparkle.style.top = e.pageY + 'px';
        sparkle.style.position = 'absolute';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.background = '#ffd93d';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'confettiFall 1s linear forwards';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
});

// Typing effect for countdown text
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect
document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const originalText = typingText.textContent;
        typingText.textContent = '';
        setTimeout(() => {
            typeWriter(typingText, originalText, 80);
        }, 500);
    }
});
