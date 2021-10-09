class UI {
    constructor() {
        this.budgetFeedback = document.querySelector(".budget-feedback");
        this.expenseFeedback = document.querySelector(".expense-feedback");
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.budgetAmount = document.getElementById("budget-amount");
        this.expenseAmount = document.getElementById("expense-amount");
        this.balance = document.getElementById("balance");
        this.balanceAmount = document.getElementById("balance-amount");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseInput = document.getElementById("expense-input");
        this.amountInput = document.getElementById("amount-input");
        this.expenseList = document.getElementById("expense-list");
        this.expenseSubmit = document.getElementById("expense-submit");
        this.itemList = [];
        this.itemId = 0;
        this.editItem = null;
    }

    // Submit budget method
    submitBudgetForm() {
        const value = this.budgetInput.value;
        if (value === '' || value < 0) {
            this.budgetFeedback.classList.add('show-item');
            this.budgetFeedback.innerHTML = `<p>Value cannot be empty or negative</p>`;
            setTimeout(() => {
                this.budgetFeedback.classList.remove('show-item');
            }, 5000);
        } else {
            this.budgetAmount.innerHTML = value;
            this.budgetInput.value = "";
            this.showBalance();
        }
    }

    submitExpenseForm() {
        if (this.editItem == null) {
            const expenseValue = this.expenseInput.value;
            const amountValue = this.amountInput.value;
            if (expenseValue == "" || amountValue === "" || amountValue < 0) {
                this.expenseFeedback.classList.add('show-item');
                this.expenseFeedback.innerHTML = `<p>Values cannot be empty or negative</p>`;
                setTimeout(() => {
                    this.expenseFeedback.classList.remove('show-item');
                }, 5000);
            } else {
                let amount = parseInt(amountValue);
                this.expenseInput.value = '';
                this.amountInput.value = '';

                let expense = {
                    id: this.itemId,
                    title: expenseValue,
                    amount: amount
                }

                this.itemId++;
                this.itemList.push(expense);
                this.addExpense(expense);
                this.showBalance();
            }
        } else {
            let itemIndex = -1;
            this.itemList.forEach((item, index) => {
                if (item.id == this.editItem.id) {
                    itemIndex = index;
                }
            });

            const newItem = {
                id: this.editItem.id,
                title: this.expenseInput.value,
                amount: this.amountInput.value,
            }

            this.deleteExpense(this.editItem.id);
            this.addExpense(newItem);

            this.expenseSubmit.innerHTML = "Add Expense";
            this.expenseInput.value = '';
            this.amountInput.value = '';
        }
    }

    deleteExpense(itemId) {
        this.itemList.filter((item) => {
            return item.id == itemId;
        });

        [...this.expenseList.getElementsByClassName("expense-item")].forEach((el) => {
            if (el.getAttribute("data-id") == itemId) {
                el.remove();
            }
        })
    }

    addExpense(expense) {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML = `
		<div class="expense-item d-flex justify-content-between align-items-baseline" data-id="${expense.id}">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>
		`;
        this.expenseAmount.innerHTML = expense.amount;
        this.expenseList.append(div);
    }

    showBalance() {
        const budget = parseInt(this.budgetAmount.innerHTML);
        const expense = this.totalExpenses();
        const balance = budget - expense;
        if (balance < 0) {
            this.balance.classList.remove('showGreen', 'showBlack');
            this.balance.classList.add('showRed');
        } else if (balance > 0) {
            this.balance.classList.remove('showRed', 'showBlack');
            this.balance.classList.add('showGreen');
        } else if (balance === 0) {
            this.balance.classList.remove('showRed', 'showGreen');
            this.balance.classList.add('showBlack');
        }
        this.balanceAmount.innerHTML = balance;
    }

    totalExpenses() {
        let total = 0;

        this.itemList.forEach((item) => {
            total += item.amount;
        });

        return total;
    };

    editExpense(itemId) {
        this.editItem = this.getExpense(itemId);
        this.expenseSubmit.innerHTML = "Update Expense";
    }

    getExpense(id) {
        let returnItem = null;
        this.itemList.forEach((item) => {
            console.log("item ", item);
            if (item.id == id) {
                console.log("true");
                returnItem = item;
            }
        });

        return returnItem;
    }
}

function eventListeners() {
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    // New instance of UI class
    const ui = new UI();

    // Budget form submit
    budgetForm.addEventListener('submit', (event) => {
        event.preventDefault();
        ui.submitBudgetForm();
    });

    // Expense form submit
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        ui.submitExpenseForm();
    });

    // Expense list click
    expenseList.addEventListener('click', (event) => {
        const button = event.target.parentElement;
        const itemId = button.getAttribute("data-id");

        console.log(itemId);
        console.log(ui.itemList);

        if (button.classList.contains("edit-icon")) {
            const expense = ui.getExpense(itemId);

            console.log("expense ", expense);

            if (expense == null) {
                return;
            }

            ui.amountInput.value = expense.amount;
            ui.expenseInput.value = expense.title;

            ui.editExpense(itemId);
        } else if (button.classList.contains("delete-icon")) {
            ui.deleteExpense(itemId);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    eventListeners();
});