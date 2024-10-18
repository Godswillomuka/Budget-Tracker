document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submit-user').addEventListener('click', submitUser);
    document.getElementById('expense-form').addEventListener('submit', addRecord);
    document.getElementById('toggle-mode').addEventListener('click', toggleMode);
});

const userData = {
    "userRecords": {
        "Alice": {
            "dob": "17-10-1996",
            "expenses": [
                {
                    "description": "Groceries",
                    "amount": 50,
                    "currency": "USD",
                    "category": "Groceries",
                    "paymentMethod": "Card",
                    "date": "10/17/2024"
                },
                {
                    "description": "Rent",
                    "amount": 1200,
                    "currency": "USD",
                    "category": "Rent",
                    "paymentMethod": "Bank Transfer",
                    "date": "10/01/2024"
                }
            ]
        },
        "Bob": {
            "dob": "22-05-1989",
            "expenses": [
                {
                    "description": "Groceries",
                    "amount": 100,
                    "currency": "USD",
                    "category": "Groceries",
                    "paymentMethod": "Card",
                    "date": "10/15/2024"
                },
                {
                    "description": "Electric Bill",
                    "amount": 60,
                    "currency": "USD",
                    "category": "Utilities",
                    "paymentMethod": "Cash",
                    "date": "10/01/2024"
                }
            ]
        },
        "Charlie": {
            "dob": "01-01-2000",
            "expenses": [
                {
                    "description": "Concert Tickets",
                    "amount": 100,
                    "currency": "GBP",
                    "category": "Entertainment",
                    "paymentMethod": "Cash",
                    "date": "10/10/2024"
                }
            ]
        },
        "Diana": {
            "dob": "15-07-1995",
            "expenses": [
                {
                    "description": "Utility Bill",
                    "amount": 75,
                    "currency": "EUR",
                    "category": "Utilities",
                    "paymentMethod": "Cash",
                    "date": "10/05/2024"
                }
            ]
        },
        "Ethan": {
            "dob": "30-12-1985",
            "expenses": [
                {
                    "description": "Dinner",
                    "amount": 50,
                    "currency": "USD",
                    "category": "Food",
                    "paymentMethod": "Card",
                    "date": "10/10/2024"
                }
            ]
        },
        "Fiona": {
            "dob": "25-03-1992",
            "expenses": []
        },
        "George": {
            "dob": "11-11-1980",
            "expenses": [
                {
                    "description": "Gym Membership",
                    "amount": 30,
                    "currency": "USD",
                    "category": "Health",
                    "paymentMethod": "Cash",
                    "date": "10/12/2024"
                }
            ]
        }
    }
};

let userName = '';
let totalAmount = 0;
let currencyConversionRates = {
    'USD': 129.87,
    'EUR': 140.85,
    'GBP': 167.11,
    'JPY': 0.86,
    'AUD': 83.33,
    'KSH': 1
};

function submitUser() {
    const newUserName = document.getElementById('name').value.trim();
    const dobInput = document.getElementById('dob').value.trim();

    if (newUserName) {
        userName = newUserName;
        totalAmount = 0;
        document.getElementById('table-body').innerHTML = '';
        document.getElementById('total-amount').textContent = `Total Amount: KSH 0.00`;

        const userInfoDisplay = document.getElementById('user-display');
        const userRecord = userData.userRecords[userName];

        if (userRecord) {
            userInfoDisplay.innerHTML = `
                <h2>Welcome ${userName}!</h2>
                <p>Date of Birth: ${userRecord.dob}</p>
                <p>Here Are Your Budgets</p>
            `;
            userInfoDisplay.style.display = 'block';

            const userExpenses = userRecord.expenses || [];
            if (userExpenses.length > 0) {
                userExpenses.forEach(record => {
                    addRowToTable(record);
                });
                totalAmount = userExpenses.reduce((sum, record) => {
                    return sum + (record.amount * currencyConversionRates[record.currency]);
                }, 0);
                updateTotal();
            } else {
                document.getElementById('expense-table').style.display = 'none';
            }
        } else {
            userData.userRecords[userName] = {
                dob: dobInput || 'N/A',
                expenses: []
            };
            userInfoDisplay.innerHTML = `
                <h2>Welcome ${userName}!</h2>
                <p>Date of Birth: ${dobInput}</p>
                <p>No records found.</p>
            `;
            userInfoDisplay.style.display = 'block';
            document.getElementById('expense-table').style.display = 'none';
        }
    }
}

function addRecord(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const category = document.getElementById('category').value;
    const paymentMethod = document.getElementById('payment-method').value;

    const currentDate = new Date().toLocaleDateString();
    const record = { description, amount, currency, category, paymentMethod, date: currentDate };


    if (!userData.userRecords[userName]) {
        userData.userRecords[userName] = { dob: '01-01-2000', expenses: [] };
    }

    userData.userRecords[userName].expenses.push(record);

    addRowToTable(record);
    totalAmount += amount * currencyConversionRates[currency];
    updateTotal();

    document.getElementById('expense-form').reset();
}

function addRowToTable(record) {
    const tableBody = document.getElementById('table-body');
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = record.description;
    newRow.insertCell(1).textContent = `${record.currency} ${record.amount.toFixed(2)}`;
    newRow.insertCell(2).textContent = record.category;
    newRow.insertCell(3).textContent = record.paymentMethod;
    newRow.insertCell(4).textContent = record.date;


    const deleteCell = newRow.insertCell(5);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'DELETE';
    deleteButton.onclick = function () {
        totalAmount -= record.amount * currencyConversionRates[record.currency];
        updateTotal();
        tableBody.deleteRow(newRow.rowIndex - 1);
        userData.userRecords[userName].expenses = userData.userRecords[userName].expenses.filter(r => r !== record);
    };
    deleteCell.appendChild(deleteButton);

    document.getElementById('expense-table').style.display = 'table';
}

function updateTotal() {
    document.getElementById('total-amount').textContent = `Total Amount: KSH ${totalAmount.toFixed(2)}`;
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
}
