// Calculator application state
const calculator = {
    display: document.getElementById('display'),
    historyDisplay: document.createElement('div'),
    currentExpression: '',
    isResultDisplayed: false,
    history: [],
    memory: 0,
    historyVisible: false
};

// Initialize calculator with enhanced display
defineEnhancedDisplay();

// Core calculator functions
function initializeCalculator() {
    calculator.display.textContent = '0';
    calculator.currentExpression = '';
    calculator.isResultDisplayed = false;
}

function clearDisplay() {
    calculator.display.textContent = '0';
    calculator.currentExpression = '';
    calculator.isResultDisplayed = false;
}

function deleteLast() {
    if (calculator.currentExpression.length > 0) {
        calculator.currentExpression = calculator.currentExpression.slice(0, -1);
        calculator.display.textContent = calculator.currentExpression || '0';
    } else {
        calculator.display.textContent = '0';
    }
}

function toggleSign() {
    if (calculator.currentExpression && !calculator.isResultDisplayed) {
        if (calculator.currentExpression.startsWith('-')) {
            calculator.currentExpression = calculator.currentExpression.slice(1);
        } else {
            calculator.currentExpression = '-' + calculator.currentExpression;
        }
        calculator.display.textContent = calculator.currentExpression;
    }
}

function appendNumber(number) {
    if (calculator.isResultDisplayed) {
        calculator.currentExpression = number.toString();
        calculator.isResultDisplayed = false;
    } else {
        if (calculator.currentExpression === '0' && number !== '.') {
            calculator.currentExpression = number.toString();
        } else {
            calculator.currentExpression += number.toString();
        }
    }
    calculator.display.textContent = calculator.currentExpression;
}

function appendOperator(operator) {
    if (calculator.isResultDisplayed) {
        calculator.currentExpression = operator;
        calculator.isResultDisplayed = false;
    } else {
        if (calculator.currentExpression === '') {
            calculator.currentExpression = operator;
        } else {
            // Check if the last character is already an operator
            const lastChar = calculator.currentExpression.slice(-1);
            if (['+', '-', '*', '/', '%'].includes(lastChar)) {
                // Replace the last operator
                calculator.currentExpression = calculator.currentExpression.slice(0, -1) + operator;
            } else {
                calculator.currentExpression += operator;
            }
        }
    }
    calculator.display.textContent = calculator.currentExpression;
}

function calculate() {
    if (!calculator.currentExpression) {
        return;
    }
    
    // Check for invalid expressions
    const lastChar = calculator.currentExpression.slice(-1);
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        // Remove trailing operator
        calculator.currentExpression = calculator.currentExpression.slice(0, -1);
    }
    
    // Replace symbol operators with standard ones
    let expression = calculator.currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
    
    try {
        // Basic validation
        if (/[+\-*/%]{2,}/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Safe evaluation without eval() using Function constructor
        const result = evaluateExpression(expression);
        
        // Store in history
        storeHistory(expression, result);
        
        calculator.currentExpression = result.toString();
        calculator.display.textContent = result;
        calculator.isResultDisplayed = true;
        
    } catch (error) {
        calculator.display.textContent = 'Error';
        calculator.currentExpression = '';
        calculator.isResultDisplayed = false;
    }
}

// Safe expression evaluation function
defineSafeEvaluation();

function evaluateExpression(expression) {
    // Basic arithmetic evaluation without eval
    // Parse and evaluate the expression
    try {
        // Use Function constructor for safer evaluation
        return new Function('return ' + expression)();
    } catch (error) {
        throw new Error('Calculation error');
    }
}

function storeHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    calculator.history.unshift(historyItem);
    
    // Keep only last 10 history items
    if (calculator.history.length > 10) {
        calculator.history.pop();
    }
}

function getHistory() {
    return calculator.history;
}

function clearHistory() {
    calculator.history = [];
}

function memoryAdd() {
    if (calculator.currentExpression && !isNaN(parseFloat(calculator.currentExpression))) {
        calculator.memory += parseFloat(calculator.currentExpression);
    }
}

function memorySubtract() {
    if (calculator.currentExpression && !isNaN(parseFloat(calculator.currentExpression))) {
        calculator.memory -= parseFloat(calculator.currentExpression);
    }
}

function memoryRecall() {
    if (calculator.isResultDisplayed) {
        calculator.currentExpression = calculator.memory.toString();
    } else {
        calculator.currentExpression = calculator.memory.toString();
    }
    calculator.display.textContent = calculator.currentExpression;
    calculator.isResultDisplayed = false;
}

function memoryClear() {
    calculator.memory = 0;
}

function percentage() {
    if (calculator.currentExpression && !isNaN(parseFloat(calculator.currentExpression))) {
        const value = parseFloat(calculator.currentExpression);
        calculator.currentExpression = (value / 100).toString();
        calculator.display.textContent = calculator.currentExpression;
    }
}

// Display enhancement
function defineEnhancedDisplay() {
    // Add history display element
    calculator.historyDisplay.className = 'history-display';
    calculator.historyDisplay.style.fontSize = '0.8rem';
    calculator.historyDisplay.style.color = '#ccc';
    calculator.historyDisplay.style.textAlign = 'right';
    calculator.historyDisplay.style.marginBottom = '5px';
    calculator.historyDisplay.style.minHeight = '20px';
    
    // Find the display element and add history display
    const displayElement = document.getElementById('display');
    const calculatorElement = displayElement.closest('.calculator');
    calculatorElement.insertBefore(calculator.historyDisplay, displayElement);
    
    // Update history display
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (calculator.history.length > 0 && !calculator.historyVisible) {
        const lastCalculation = calculator.history[0];
        calculator.historyDisplay.textContent = `${lastCalculation.expression} = ${lastCalculation.result}`;
    } else if (calculator.historyVisible) {
        // Show all history
        let historyText = 'History:\n';
        calculator.history.forEach((item, index) => {
            historyText += `${item.expression} = ${item.result}\n`;
        });
        calculator.historyDisplay.textContent = historyText;
    } else {
        calculator.historyDisplay.textContent = '';
    }
}

function toggleHistory() {
    calculator.historyVisible = !calculator.historyVisible;
    updateHistoryDisplay();
}

function defineSafeEvaluation() {
    // This function is already defined above
}

// Keyboard support
defineKeyboardSupport();

function defineKeyboardSupport() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Number keys
        if (/^[0-9]$/.test(key)) {
            event.preventDefault();
            appendNumber(key);
        }
        
        // Operator keys
        if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            event.preventDefault();
            appendOperator(key);
        }
        
        // Decimal point
        if (key === '.') {
            event.preventDefault();
            appendNumber(key);
        }
        
        // Enter key for calculation
        if (key === 'Enter') {
            event.preventDefault();
            calculate();
        }
        
        // Escape key for clear
        if (key === 'Escape') {
            event.preventDefault();
            clearDisplay();
        }
        
        // Backspace for delete
        if (key === 'Backspace') {
            event.preventDefault();
            deleteLast();
        }
        
        // Delete key for clear all
        if (key === 'Delete') {
            event.preventDefault();
            clearDisplay();
        }
    });
}

// Initialize the calculator on page load
initializeCalculator();