
class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-ball');
        const number = document.createElement('span');
        number.textContent = this.getAttribute('number');
        wrapper.appendChild(number);
        shadow.appendChild(wrapper);
    }
}

class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
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
        shadow.appendChild(container);
    }

    generateNumbers(ballContainer) {
        ballContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        for (const number of numbers) {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            ballContainer.appendChild(lottoBall);
        }
    }
}

customElements.define('lotto-ball', LottoBall);
customElements.define('lotto-machine', LottoMachine);
