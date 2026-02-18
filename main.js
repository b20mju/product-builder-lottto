
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this._number = null;
    }

    connectedCallback() {
        this.render();
        if (this.hasAttribute('number')) {
            this.startRolling(parseInt(this.getAttribute('number'), 10));
        }
    }

    static get observedAttributes() {
        return ['number'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'number' && oldValue !== newValue && this.shadow.firstChild) {
            this.startRolling(parseInt(newValue, 10));
        }
    }

    startRolling(finalNumber) {
        const span = this.shadow.querySelector('.number');
        if (!span) return;

        let rolls = 0;
        const maxRolls = 10;
        const interval = setInterval(() => {
            span.textContent = Math.floor(Math.random() * 45) + 1;
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(interval);
                span.textContent = finalNumber;
                this._number = finalNumber;
                this.updateColor(finalNumber);
            }
        }, 50);
    }

    updateColor(n) {
        const ball = this.shadow.querySelector('.lotto-ball');
        if (ball) {
            ball.style.background = `radial-gradient(circle at 30% 30%, #fff, ${this.getColor(n)})`;
        }
    }

    render() {
        const color = '#ddd'; // Default rolling color

        const style = document.createElement('style');
        style.textContent = `
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                80% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }

            .lotto-ball {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #fff, ${color});
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
                text-shadow: 1px 1px 1px rgba(255,255,255,0.5);
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                transition: background 0.3s ease;
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-ball');
        const numberSpan = document.createElement('span');
        numberSpan.setAttribute('class', 'number');
        numberSpan.textContent = '?';
        wrapper.appendChild(numberSpan);

        this.shadow.appendChild(style);
        this.shadow.appendChild(wrapper);
    }

    getColor(n) {
        if (n <= 10) return '#fbc400';
        if (n <= 20) return '#69c8f2';
        if (n <= 30) return '#ff7272';
        if (n <= 40) return '#aaaaaa';
        return '#b0d840';
    }
}

class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host { display: block; }
            .lotto-machine { text-align: center; }
            h1 { margin-bottom: 1.5rem; font-size: 1.8rem; color: var(--text-color, #333); }
            .ball-container {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 2rem;
                min-height: 60px;
                flex-wrap: nowrap;
            }
            button {
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                border: none;
                padding: 0.8rem 2.5rem;
                font-size: 1rem;
                font-weight: bold;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
            button:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
        `;

        const container = document.createElement('div');
        container.setAttribute('class', 'lotto-machine');

        const title = document.createElement('h1');
        title.textContent = 'Lucky Lotto 6/45';

        const ballContainer = document.createElement('div');
        ballContainer.setAttribute('class', 'ball-container');

        const button = document.createElement('button');
        button.textContent = 'Draw Numbers';
        button.addEventListener('click', () => {
            this.generateNumbers(ballContainer, button);
        });

        container.appendChild(title);
        container.appendChild(ballContainer);
        container.appendChild(button);
        
        shadow.appendChild(style);
        shadow.appendChild(container);
    }

    async generateNumbers(ballContainer, button) {
        button.disabled = true;
        ballContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        for (let i = 0; i < sortedNumbers.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 150));
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', sortedNumbers[i]);
            ballContainer.appendChild(lottoBall);
        }

        // Wait for last ball to finish rolling
        setTimeout(() => {
            button.disabled = false;
            this.dispatchEvent(new CustomEvent('draw-complete', {
                detail: { numbers: sortedNumbers },
                bubbles: true,
                composed: true
            }));
        }, 600);
    }
}

customElements.define('lotto-ball', LottoBall);
customElements.define('lotto-machine', LottoMachine);

// --- App Logic ---
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const machine = document.getElementById('machine');

// Load history from localStorage
let drawHistory = JSON.parse(localStorage.getItem('lotto-history')) || [];

function renderHistory() {
    historyList.innerHTML = '';
    drawHistory.slice().reverse().forEach((draw, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = document.createElement('span');
        date.className = 'history-date';
        date.textContent = new Date(draw.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const nums = document.createElement('div');
        nums.className = 'history-numbers';
        draw.numbers.forEach(n => {
            const ball = document.createElement('div');
            ball.className = 'mini-ball';
            ball.textContent = n;
            ball.style.backgroundColor = getBallColor(n);
            nums.appendChild(ball);
        });
        
        item.appendChild(date);
        item.appendChild(nums);
        historyList.appendChild(item);
    });
}

function getBallColor(n) {
    if (n <= 10) return '#fbc400';
    if (n <= 20) return '#69c8f2';
    if (n <= 30) return '#ff7272';
    if (n <= 40) return '#aaaaaa';
    return '#b0d840';
}

machine.addEventListener('draw-complete', (e) => {
    const newDraw = {
        numbers: e.detail.numbers,
        date: new Date().toISOString()
    };
    drawHistory.push(newDraw);
    if (drawHistory.length > 10) drawHistory.shift(); // Keep last 10
    localStorage.setItem('lotto-history', JSON.stringify(drawHistory));
    renderHistory();
});

clearHistoryBtn.addEventListener('click', () => {
    drawHistory = [];
    localStorage.removeItem('lotto-history');
    renderHistory();
});

// Initialize History
renderHistory();

// Theme switching logic
const themeToggle = document.getElementById('theme-toggle');
const docElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
docElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = docElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    docElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

function updateThemeButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}
