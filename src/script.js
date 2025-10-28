// Отримання елементів з DOM
const display = document.getElementById('display');
const errorElement = document.getElementById('error');
const numberButtons = document.querySelectorAll('.btn-number');
const operationButtons = document.querySelectorAll('.btn-operation');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clearBtn');
const backspaceButton = document.getElementById('backspace');
const plusMinusButton = document.getElementById('plusMinus');

// Змінні для зберігання стану калькулятора
let currentValue = '0';
let previousValue = null;
let operation = null;
let shouldResetDisplay = false;

// Функція для оновлення дисплею
function updateDisplay() {
    display.textContent = currentValue;
}

// Функція для відображення помилки
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// Функція для очищення калькулятора
function clear() {
    currentValue = '0';
    previousValue = null;
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
    errorElement.classList.remove('show');
}

// Функція для видалення останнього символу
function backspace() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

// Функція для зміни знака числа
function toggleSign() {
    if (currentValue !== '0') {
        if (currentValue.startsWith('-')) {
            currentValue = currentValue.slice(1);
        } else {
            currentValue = '-' + currentValue;
        }
        updateDisplay();
    }
}

// Функція для додавання цифри
function appendNumber(number) {
    // Перевірка на другу крапку
    if (number === '.' && currentValue.includes('.')) {
        return;
    }
    
    if (shouldResetDisplay || currentValue === '0') {
        if (number === '.') {
            currentValue = '0.';
        } else {
            currentValue = number;
        }
        shouldResetDisplay = false;
    } else {
        currentValue += number;
    }
    
    updateDisplay();
}

// Функція для вибору операції
function chooseOperation(op) {
    if (currentValue === '' || currentValue === '-') {
        showError('⚠️ Введіть число перед операцією!');
        return;
    }
    
    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
        calculate();
    }
    
    operation = op;
    previousValue = currentValue;
    shouldResetDisplay = true;
}

// Функція для виконання обчислення
function calculate() {
    if (operation === null || previousValue === null) {
        return;
    }
    
    // Якщо не ввели друге число, беремо поточне значення
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    // Перевірка на коректність чисел
    if (isNaN(prev) || isNaN(current)) {
        showError('⚠️ Некоректні числові значення!');
        clear();
        return;
    }
    
    let result;
    
    switch (operation) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                showError('⚠️ Ділення на нуль неможливе!');
                currentValue = 'Помилка';
                updateDisplay();
                setTimeout(() => {
                    clear();
                }, 2000);
                return;
            }
            result = prev / current;
            // Заокруглення до сотих, якщо не ділиться націло
            if (result % 1 !== 0) {
                result = Math.round(result * 100) / 100;
            }
            break;
        default:
            return;
    }
    
    // Перевірка на переповнення
    if (!isFinite(result)) {
        showError('⚠️ Результат занадто великий!');
        clear();
        return;
    }
    
    currentValue = result.toString();
    operation = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Обробники подій для цифрових кнопок
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.getAttribute('data-number');
        appendNumber(number);
    });
});

// Обробники подій для операцій
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.getAttribute('data-operation');
        chooseOperation(op);
    });
});

// Обробник для кнопки дорівнює
equalsButton.addEventListener('click', calculate);

// Обробник для кнопки очищення
clearButton.addEventListener('click', clear);

// Обробник для кнопки backspace
backspaceButton.addEventListener('click', backspace);

// Обробник для кнопки зміни знака
plusMinusButton.addEventListener('click', toggleSign);

// Обробка клавіатури
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+') {
        chooseOperation('add');
    } else if (e.key === '-') {
        chooseOperation('subtract');
    } else if (e.key === '*') {
        chooseOperation('multiply');
    } else if (e.key === '/') {
        e.preventDefault();
        chooseOperation('divide');
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear();
    } else if (e.key === 'Backspace') {
        backspace();
    }
});

// Ініціалізація дисплею
updateDisplay();