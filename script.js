class Calculator {
    constructor(input, output) {
        this.inputDisplay = input;
        this.outputDisplay = output;
        this.inputHistory = [];
    }

    clearAllHistory() {
        this.inputHistory = [];
        this.updateInputDisplay();
        this.updateOutputDisplay("0");
    }

    backspace() {
        switch (this.getLastInputType()) {
            case "number":
                if (this.getLastInputValue().length > 1) {
                    this.editLastInput(this.getLastInputValue().slice(0, -1), "number");
                } else {
                    this.deleteLastInput();
                }
                break;
            case "operator":
                this.deleteLastInput();
                break;
            default:
                return;
        }
    }

    changePercentToDecimal() {
        if (this.getLastInputType() === "number") {
            this.editLastInput(this.getLastInputValue() / 100, "number");
        }
    }

    squareRoot() {
        if (this.getLastInputType() === "number") {
            this.editLastInput(Math.sqrt(this.getLastInputValue()), "number");
        }
    }

    insertNumber(value) {
        if (this.getLastInputType() === "number") {
            this.appendToLastInput(value);
        } else if (this.getLastInputType() === null || this.getLastInputType() === "operator") {
            this.addNewInput(value, "number");
        }
    }

    insertOperation(value) {
        switch (this.getLastInputType()) {
            case "number":
                this.addNewInput(value, "operator");
                break;
            case "operator":
                this.editLastInput(value, "operator");
                break;
            case "equals":
                let output = this.getOutputValue();
                this.clearAllHistory();
                this.addNewInput(output, "number");
                this.addNewInput(value, "operator");
                break;
            default:
                return;
        }
    }

    negateNumber() {
        if (this.getLastInputType() === "number") {
            this.editLastInput(parseFloat(this.getLastInputValue()) * -1, "number");
        }
    }

    insertDecimalPoint() {
        if (this.getLastInputType() === "number" && !this.getLastInputValue().includes(".")) {
            this.appendToLastInput(".");
        } else if (this.getLastInputType() === "operator" || this.getLastInputType() === null) {
            this.addNewInput("0.", "number");
        }
    }

    generateResult() {
        try {
            if (this.getLastInputType() === "number") {
                const self = this;
                const simplifyExpression = function(currentExpression, operator) {
                    if (currentExpression.indexOf(operator) === -1) {
                        return currentExpression;
                    } else {
                        let operatorIdx = currentExpression.indexOf(operator);
                        let leftOperandIdx = operatorIdx - 1;
                        let rightOperandIdx = operatorIdx + 1;

                        let partialSolution = self.performOperation(...currentExpression.slice(leftOperandIdx, rightOperandIdx + 1));

                        currentExpression.splice(leftOperandIdx, 3, partialSolution.toString());

                        return simplifyExpression(currentExpression, operator);
                    }
                }
                let result = ["*", "/", "-", "+", "^"].reduce(simplifyExpression, this.getAllInputValues());

                this.addNewInput("= ", "equals");
                var resultsToLocalStorage = inputDisplay.value + result;
                addToLocalStorage(resultsToLocalStorage);
                this.updateOutputDisplay(result.toString());
            }
        } catch (equals) {
            this.addNewInput("Error");
        }
    }

    //  HELPER FUNCTIONS
    getLastInputType() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length - 1].type;
    }

    getLastInputValue() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length - 1].value;
    }

    getAllInputValues() {
        return this.inputHistory.map(entry => entry.value);
    }

    getOutputValue() {
        return this.outputDisplay.value.replace(/,/g, '');
    }

    addNewInput(value, type) {
        this.inputHistory.push({ "type": type, "value": value.toString() });
        this.updateInputDisplay();
    }

    appendToLastInput(value) {
        this.inputHistory[this.inputHistory.length - 1].value += value.toString();
        this.updateInputDisplay();
    }

    editLastInput(value, type) {
        this.inputHistory.pop();
        this.addNewInput(value, type);
    }

    deleteLastInput() {
        this.inputHistory.pop();
        this.updateInputDisplay();
    }

    updateInputDisplay() {
        this.inputDisplay.value = this.getAllInputValues().join(" ");
    }

    updateOutputDisplay(value) {
        this.outputDisplay.value = Number(value).toLocaleString();
    }

    performOperation(leftOperand, operation, rightOperand) {
        leftOperand = parseFloat(leftOperand);
        rightOperand = parseFloat(rightOperand);

        if (Number.isNaN(leftOperand) || Number.isNaN(rightOperand)) {
            return;
        }

        switch (operation) {
            case "*":
                return leftOperand * rightOperand;
            case "/":
                return leftOperand / rightOperand;
            case "-":
                return leftOperand - rightOperand;
            case "+":
                return leftOperand + rightOperand;
            case "^":
                return (Math.pow(leftOperand, rightOperand));
            default:
                return;
        }

    }

} // End Calculator Class Definition

// HISTORY LIST
const historyList = document.getElementById('history-list');

// HISTORY LIST ENDS 




// Create bindings to access DOM elements
const inputDisplay = document.querySelector('#history');
const outputDisplay = document.querySelector('#result');

const allClearButton = document.querySelector('[data-all-clear]');
const backspaceButton = document.querySelector('[data-backspace]');
const percentButton = document.querySelector('[data-percent]');
const operationButtons = document.querySelectorAll('[data-operator]');
const numberButtons = document.querySelectorAll('[data-number]');
const negationButton = document.querySelector('[data-negation]');
const decimalButton = document.querySelector('[data-decimal]');
const sqrtButton = document.querySelector('[data-sqrt]');
const equalsButton = document.querySelector('[data-equals]');

// Create a new Calculator
const calculator = new Calculator(inputDisplay, outputDisplay);

// Add event handlers to the calculator buttons
allClearButton.addEventListener("click", () => {
    calculator.clearAllHistory();
});

backspaceButton.addEventListener("click", () => {
    calculator.backspace();
});

percentButton.addEventListener("click", () => {
    calculator.changePercentToDecimal();
});

sqrtButton.addEventListener("click", () => {
    calculator.squareRoot();
});

operationButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        let { target } = event;
        calculator.insertOperation(target.dataset.operator);
    })
});

numberButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        let { target } = event;
        calculator.insertNumber(target.dataset.number);
    })
});

negationButton.addEventListener("click", () => {
    calculator.negateNumber();
});

decimalButton.addEventListener("click", () => {
    calculator.insertDecimalPoint();
});

equalsButton.addEventListener("click", () => {
    calculator.generateResult();
});



eventListener();

function eventListener() {
    historyList.addEventListener('click', deleteElement);
    document.addEventListener('DOMContentLoaded', getElementsFromLocalStorage);
}

function deleteElement(equals) {
    equals.preventDefault();
    if (equals.target.className === 'button-color') {
        deleteResultFromLocalStorage(equals.target.parentElement.innerText);
        equals.target.parentElement.remove();
    }
}

function addToLocalStorage(val) {
    var results = getResultsFromLocalStorage();
    results.push(val);
    localStorage.setItem('results', JSON.stringify(results));
}

function getResultsFromLocalStorage() {
    let results;
    if (localStorage.getItem('results') === null) {
        results = [];
    } else {
        results = JSON.parse(localStorage.getItem('results'));
    }
    return results;
}

// List elements from localstorage

function getElementsFromLocalStorage() {
    let results = getResultsFromLocalStorage();
    results.forEach(function(result) {
        // Create delete button of results
        var deleteBtn = document.createElement('button');
        deleteBtn.classList = 'button-color';
        deleteBtn.innerHTML = 'x';

        // create element to list results
        var li = document.createElement('li');
        li.innerText = result;

        // Add element and button to list results
        li.appendChild(deleteBtn);
        historyList.appendChild(li);
    })

}

// Delete element to localstorage
function deleteResultFromLocalStorage(element) {
    let results, elementDeleted;

    //Delete the x from element
    elementDeleted = element.substring(0, element.length - 1);

    results = getResultsFromLocalStorage();

    results.forEach(function(element, index) {
        if (elementDeleted === element) {
            results.splice(index, 1);
        }
    });

    localStorage.setItem('results', JSON.stringify(results));
}