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

// Testing Area
let arr = '[]';
let arr2 = Array.from(JSON.parse(arr));
console.log(arr2);

function newItem(categoryNum) {
    let subcategory = -1;

    while (
        subcategory > categories[categoryNum].sub.length - 1 ||
        subcategory < 0
    ) {
        let string = 'Enter subcategory:';
        categories[categoryNum].sub.forEach(function (x, index, arr) {
            string += '\n(' + index + ') ' + x;
        });
        subcategory = 0; // window.prompt(string);
    }

    let value = 200;
    let date = new Date();

    while (date == 'Invalid Date') {
        date = new Date();
    }

    return [subcategory, value, date];
}

function addItem(categoryNum) {
    let item = newItem(categoryNum);

    categories[categoryNum].total += item[1];

    if (localStorage.getItem(categories[categoryNum].name) == null) {
        localStorage.setItem(categories[categoryNum].name, '[]');
    }

    let items = Array.from(
        JSON.parse(localStorage.getItem(categories[categoryNum].name))
    );
    items.push(item);
    localStorage.setItem(categories[categoryNum].name, JSON.stringify(items));
}
