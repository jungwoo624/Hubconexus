class LottoDisplay extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'lotto-numbers');
    const style = document.createElement('style');
    style.textContent = `
      .lotto-numbers {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 30px 0;
        perspective: 500px;
      }
      .lotto-number {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 -3px 5px rgba(0,0,0,0.3);
        transform: translateY(20px) rotateX(-90deg);
        opacity: 0;
        transition: transform 0.5s ease, opacity 0.5s ease;
        background-color: #f0f0f0; /* Default color */
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }

  setNumbers(numbers) {
    const wrapper = this.shadowRoot.querySelector('.lotto-numbers');
    wrapper.innerHTML = '';
    numbers.sort((a, b) => a - b).forEach((number, index) => {
      const numberElement = document.createElement('div');
      numberElement.setAttribute('class', 'lotto-number');
      numberElement.textContent = number;

      // Set color based on number range
      let color;
      if (number <= 10) color = '#fbc400'; // Yellow
      else if (number <= 20) color = '#69c8f2'; // Blue
      else if (number <= 30) color = '#ff7272'; // Red
      else if (number <= 40) color = '#aaa'; // Gray
      else color = '#b0d840'; // Green
      numberElement.style.backgroundColor = color;
      
      wrapper.appendChild(numberElement);

      // Animate sequentially
      setTimeout(() => {
          numberElement.style.transform = 'translateY(0) rotateX(0deg)';
          numberElement.style.opacity = '1';
      }, index * 100);
    });
  }
}

customElements.define('lotto-display', LottoDisplay);

// ── Theme toggle ──
(function () {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
  });
})();

function generateAndDisplayNumbers() {
  const lottoDisplay = document.querySelector('lotto-display');
  const numbers = generateLottoNumbers();
  lottoDisplay.setNumbers(numbers);
}

document.getElementById('generator-btn').addEventListener('click', generateAndDisplayNumbers);

// Generate numbers on initial page load
document.addEventListener('DOMContentLoaded', generateAndDisplayNumbers);


function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
}
