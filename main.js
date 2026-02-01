
class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .lotto-ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--ball-color);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--text-color);
                box-shadow: 0 4px 8px var(--shadow-color);
                transition: transform 0.2s, background-color 0.3s ease, color 0.3s ease;
            }

            .lotto-ball:hover {
                transform: scale(1.1);
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-ball');
        const number = document.createElement('span');
        number.textContent = this.getAttribute('number');
        wrapper.appendChild(number);

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }
}

class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .lotto-machine {
                text-align: center;
            }

            h1 {
                color: var(--text-color);
                margin-bottom: 2rem;
                transition: color 0.3s ease;
            }

            .ball-container {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                min-height: 60px;
            }

            button {
                background-color: var(--button-background);
                color: white;
                border: none;
                padding: 1rem 2rem;
                font-size: 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            button:hover {
                background-color: var(--button-hover-background);
            }
        `;

        const container = document.createElement('div');
        container.setAttribute('class', 'lotto-machine');

        const title = document.createElement('h1');
        title.textContent = 'Lotto Number Generator';

        const ballContainer = document.createElement('div');
        ballContainer.setAttribute('class', 'ball-container');

        const button = document.createElement('button');
        button.textContent = 'Generate Numbers';
        button.addEventListener('click', () => {
            this.generateNumbers(ballContainer);
        });

        container.appendChild(title);
        container.appendChild(ballContainer);
        container.appendChild(button);
        
        shadow.appendChild(style);
        shadow.appendChild(container);
    }

    generateNumbers(ballContainer) {
        ballContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        for (const number of sortedNumbers) {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
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

themeToggle.addEventListener('click', () => {
    const currentTheme = docElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    docElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
