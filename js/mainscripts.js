// Initialize Category's, name, subcateogries, budget, and totals.
let categories = {
    0: {
        name: 'essentials',
        sub: ['Groceries', 'Medicine', 'Toiletries'],
        total: 0,
        budget: 0,
    },
    1: {
        name: 'transportation',
        sub: ['Public Transit', 'Gas', 'Vehicle Maintenance', 'Car Insurance'],
        total: 0,
        budget: 0,
    },
    2: {
        name: 'savings',
        sub: ['Education Funds', 'Business Savings', 'Investments'],
        total: 0,
        budget: 0,
    },
    3: {
        name: 'miscellaneous',
        sub: ['Personal Spendings', 'Gifts'],
        total: 0,
        budget: 0,
    },
    4: {
        name: 'bills',
        sub: ['Electrical', 'Water', 'Insurance', 'Medical'],
        total: 0,
        budget: 0,
    },
};

// Initialize localStorages
if (localStorage.getItem('notifs') == null) {
    localStorage.setItem('notifs', 'false');
}

if (localStorage.getItem('totalBudget') == null) {
    localStorage.setItem('totalBudget', parseFloat(0));
}

if (localStorage.getItem('catSelected') == null) {
    localStorage.setItem('catSelected', 0);
}

for (let i = 0; i < Object.keys(categories).length; i++) {
    let stgNameBudget = categories[i].name + '-budget';
    if (localStorage.getItem(stgNameBudget) == null) {
        localStorage.setItem(stgNameBudget, 0);
    }
    categories[i].budget = parseFloat(localStorage.getItem(stgNameBudget));

    let stgNameTotal = categories[i].name + '-total';
    if (localStorage.getItem(stgNameTotal) == null) {
        localStorage.setItem(stgNameTotal, 0);
    }
    categories[i].total = parseFloat(localStorage.getItem(stgNameTotal));
}

// Initialize Document Elements

// Initialize Global Variables
let catSelected = parseInt(localStorage.getItem('catSelected'));
const pesos = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
});

// Home Page
function home() {
    window.location.href = 'FinanceManager.html';
}

// Profile Page
function profile() {
    window.location.href = 'pages/ProfileEx.html';
}

// Switch Notifications
function notify() {
    if (localStorage.getItem('notifs') == 'false') {
        window.alert('Your notifications have been turned on.');
        localStorage.setItem('notifs', 'true');
    } else {
        window.alert('Your notifications have been turned off.');
        localStorage.setItem('notifs', 'false');
    }
}

// Category selector
function setCategory(num) {
    localStorage.setItem('catSelected', num);
    catSelected = num;

    loadCategory();

    console.log(localStorage);
}

// Set Total Budget
function setTotalBudget() {
    let totalBudgetPrompt = window
        .prompt('Enter monthly budget: ', localStorage.getItem('totalBudget'))
        .replace(/,/g, '');

    while (totalBudgetPrompt >= 1000000000) {
        totalBudgetPrompt = window
            .prompt('Value to high. Please enter monthly budget again: ')
            .replace(/,/g, '');
    }

    if (totalBudgetPrompt == null) {
        return;
    }

    localStorage.setItem('totalBudget', totalBudgetPrompt);

    loadCategory();

    console.log(localStorage);
}

// Create Item [subcategory, value, date]
function newItem() {
    let string = 'Enter subcategory:';
    categories[catSelected].sub.forEach(function (x, index, arr) {
        string += '\n(' + index + ') ' + x;
    });
    let subcategory = window.prompt(string);

    while (
        subcategory > categories[catSelected].sub.length - 1 ||
        subcategory < 0
    ) {
        subcategory = window.prompt('Invalid input.\n\n' + string);
        if (subcategory == null) {
            break;
        }
    }

    if (subcategory == null || subcategory == '') {
        return;
    } else {
        subcategory = parseInt(subcategory);
    }

    let value = parseFloat(
        window.prompt('Enter value spent:').replace(/,/g, '')
    );

    if (value == null || value == '') {
        return;
    }

    while (value < 0 || value >= 1000000000) {
        window
            .prompt(
                'Invalid value (0 < value < 1,000,000,000).\nEnter value spent:'
            )
            .replace(/,/g, '');
    }

    let date = window.prompt('Enter date: (YYYY-MM-DD)');

    if (date == null || date == '') {
        return;
    } else {
        date = new Date(date);
    }

    while (date == 'Invalid Date') {
        date = new Date(window.prompt('Enter valid date: (YYYY-MM-DD)'));
    }

    return [subcategory, value, date];
}

// Add New Item to localStorage
function addItem() {
    let item = newItem();

    if (item == null) {
        return;
    }

    categories[catSelected].total += item[1];
    localStorage.setItem(
        categories[catSelected].name + '-total',
        categories[catSelected].total
    );

    if (localStorage.getItem(categories[catSelected].name) == null) {
        localStorage.setItem(categories[catSelected].name, JSON.stringify([]));
    }

    let items = Array.from(
        JSON.parse(localStorage.getItem(categories[catSelected].name))
    );
    items.push(item);
    localStorage.setItem(categories[catSelected].name, JSON.stringify(items));

    loadCategory();

    console.log(localStorage);
}

// Set budget of selected category
function setCategoryBudget() {
    let thisBudget = window
        .prompt(
            'Enter new budget for this category:',
            categories[catSelected].budget
        )
        .replace(/,/g, '');

    while (thisBudget >= 1000000000) {
        thisBudget = window
            .prompt(
                'Value to high. Enter new budget for this category:',
                categories[catSelected].budget
            )
            .replace(/,/g, '');
    }

    if (thisBudget == null || thisBudget == '') {
        return;
    }

    categories[catSelected].budget = parseFloat(thisBudget);
    localStorage.setItem(
        categories[catSelected].name + '-budget',
        parseFloat(thisBudget)
    );

    loadCategory();

    console.log(localStorage);
}

// Load Function
function loadCategory() {
    let budget_val = document.getElementById('budget-val');
    let itemContainer = document.getElementById('scrollDiv');

    let categoryTitle = document.getElementById('category-title-text');
    let categoryBudget = document.getElementById('category-title-budget');
    let categoryTotal = document.getElementById('category-title-total');

    let totalBudget = parseFloat(localStorage.getItem('totalBudget'));
    let totalAllocated = 0.0;
    let totalSpend = 0.0;

    let currentCat = categories[catSelected];

    budget_val.innerHTML = pesos.format(totalBudget);
    categoryTitle.innerHTML =
        currentCat.name.charAt(0).toUpperCase() + currentCat.name.slice(1);
    categoryBudget.innerHTML = pesos.format(currentCat.budget);
    categoryTotal.innerHTML = pesos.format(currentCat.total);

    for (let i = 0; i < Object.keys(categories).length; i++) {
        let categoryBudgetMini = document.getElementById(
            categories[i].name + '-budget'
        );
        let categoryTotalMini = document.getElementById(
            categories[i].name + '-total'
        );

        totalAllocated += categories[i].budget;
        totalSpend += categories[i].total;

        categoryBudgetMini.innerHTML = pesos.format(categories[i].budget);
        categoryTotalMini.innerHTML = pesos.format(categories[i].total);
    }

    document.getElementById('alloc-val').innerHTML =
        pesos.format(totalAllocated);
    document.getElementById('total-val').innerHTML = pesos.format(totalSpend);

    itemContainer.innerHTML = '';

    if (localStorage.getItem(currentCat.name) == null) {
        console.log(localStorage);
    } else {
        let items = Array.from(
            JSON.parse(localStorage.getItem(currentCat.name))
        );
        for (let i = 0; i < items.length; i++) {
            let date = new Date(items[i][2]);
            let dateStr =
                date.getFullYear() +
                '-' +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + date.getDate()).slice(-2);

            itemContainer.innerHTML += `
                <div class="itemBar">
                            <div class="itemSub">${
                                currentCat.sub[items[i][0]]
                            }</div>
                            <div class="itemDate">${dateStr}</div>
                            <div class="itemValue">${pesos.format(
                                items[i][1]
                            )}</div>
                            <div class="deleteBtn" onclick="deleteItem(${i})">
                                <img src="imgs/delete.png" height="20px" />
                            </div>
                        </div>`;
        }
        // Color changes
        if (totalSpend > totalAllocated || totalSpend > totalBudget) {
            document.getElementById('total-val').style.color = '#f14975';
        } else {
            document.getElementById('total-val').style.color = '#272643';
        }

        if (totalAllocated > totalBudget) {
            document.getElementById('alloc-val').style.color = '#f14975';
        } else {
            document.getElementById('alloc-val').style.color = '#272643';
        }

        console.log(localStorage);
    }
}

// Delete item
function deleteItem(num) {
    let items = Array.from(
        JSON.parse(localStorage.getItem(categories[catSelected].name))
    );

    categories[catSelected].total -= items[num][1];
    localStorage.setItem(
        categories[catSelected].name + '-total',
        categories[catSelected].total
    );

    items.splice(num, 1);
    localStorage.setItem(categories[catSelected].name, JSON.stringify(items));

    loadCategory();

    console.log(localStorage);
}

window.addEventListener = ('load', loadCategory(), false);
