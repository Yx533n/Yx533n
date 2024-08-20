// Menu items
const menuItems = {
    dishes: {
        "Birria Beef Tacos": 20,
        "BBQ Jerk Chicken Dumpling Burger": 20,
        "Tacos/Burger": 30
    },
    desserts: {
        "Oreo/Lotus Biscoffapple Crumble": 5,
        "Blue/Pink Sprinkle Cake": 5
    },
    koolAid: {
        "Ice Blue Raspberry Lemonade": 5,
        "Cherry": 5,
        "Pink Lychee Sherbet": 5,
        "Grape": 5
    }
};

// Populate menu
function populateMenu() {
    for (const [category, items] of Object.entries(menuItems)) {
        const section = document.getElementById(`${category}-section`);
        for (const [item, price] of Object.entries(items)) {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h4>${item}</h4>
                <p>£${price}</p>
                <button onclick="addToOrder('${item}', ${price})">Add to Order</button>
            `;
            section.appendChild(itemElement);
        }
    }
}

// Order management
let order = [];

function addToOrder(item, price) {
    order.push({item, price});
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderItems = document.getElementById('order-items');
    orderItems.innerHTML = '';
    let total = 0;
    order.forEach(({item, price}) => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item}: £${price}`;
        orderItems.appendChild(itemElement);
        total += price;
    });
    const totalElement = document.createElement('div');
    totalElement.textContent = `Total: £${total}`;
    orderItems.appendChild(totalElement);
}

// Form submission
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('order', JSON.stringify(order));
    
    // Here you would typically send this data to your server
    // For demonstration, we'll just log it to console
    console.log(Object.fromEntries(formData));
    alert('Order submitted! Check console for details.');
});

// PayPal integration
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: order.reduce((total, {price}) => total + price, 0)
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
        });
    }
}).render('#paypal-button-container');

// Initialize
document.addEventListener('DOMContentLoaded', populateMenu);
