
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = parseInt(this.getAttribute('number'), 10);
        const color = this.getColor(number);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes popIn {
                0% { transform: scale(0); opacity: 0; }
                80% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }

            .lotto-ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, #fff, ${color});
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: #333; /* Dark text for better contrast on bright balls */
                text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-ball');
        const numberSpan = document.createElement('span');
        numberSpan.textContent = number;
        wrapper.appendChild(numberSpan);

        this.shadow.appendChild(style);
        this.shadow.appendChild(wrapper);
    }

    getColor(n) {
        if (n <= 10) return '#fbc400'; // Yellow
        if (n <= 20) return '#69c8f2'; // Blue
        if (n <= 30) return '#ff7272'; // Red
        if (n <= 40) return '#aaaaaa'; // Grey
        return '#b0d840'; // Green
    }
}

class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .lotto-machine {
                text-align: center;
                padding: 2rem;
            }

            h1 {
                margin-bottom: 2rem;
                font-size: 2rem;
                color: var(--text-color, #333);
            }

            .ball-container {
                display: flex;
                justify-content: center;
                gap: 0.8rem;
                margin-bottom: 2.5rem;
                min-height: 70px;
                flex-wrap: nowrap;
            }

            button {
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                color: white;
                border: none;
                padding: 1rem 3rem;
                font-size: 1.1rem;
                font-weight: bold;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            
            button:active {
                transform: translateY(1px);
            }
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
            this.generateNumbers(ballContainer);
        });

        container.appendChild(title);
        container.appendChild(ballContainer);
        container.appendChild(button);
        
        shadow.appendChild(style);
        shadow.appendChild(container);
    }

    async generateNumbers(ballContainer) {
        ballContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        for (let i = 0; i < sortedNumbers.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 200)); // Delay for effect
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', sortedNumbers[i]);
            ballContainer.appendChild(lottoBall);
        }
    }
}

customElements.define('lotto-ball', LottoBall);
customElements.define('lotto-machine', LottoMachine);

// Theme switching logic
const themeToggle = document.getElementById('theme-toggle');
const docElement = document.documentElement;

// Apply saved theme on load
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
