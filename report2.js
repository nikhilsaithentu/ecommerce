

document.addEventListener('DOMContentLoaded', function() {

    const getOrdersByDateRangeBtn = document.getElementById('getOrdersByDateRange');
    getOrdersByDateRangeBtn.addEventListener('click', getOrdersByDateRange);
});

function getOrdersByDateRange() {
    const startDate = moment(document.getElementById('startDate').value);
    const endDate = moment(document.getElementById('endDate').value);

    console.log("Start Date:", startDate.format());
    console.log("End Date:", endDate.format());

    fetch('https://firestore.googleapis.com/v1/projects/onlinestore-2e219/databases/(default)/documents/Purchase', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched Data:", data);

        const ordersWithinRange = data.documents.filter(order => {
            const orderDate = moment(order.createTime);
            console.log("Order Date:", orderDate.format());
            const isWithinRange = orderDate.isBetween(startDate, endDate, null, '[]');
            console.log("Is within range:", isWithinRange);
            return isWithinRange;
        });

        console.log("Orders within Range:", ordersWithinRange);
        displayOrders(ordersWithinRange);
    })
    .catch(error => {
        console.error('Error fetching orders by date range:', error);
    });
}


function displayOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; // Clear previous content

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders found within the specified date range.</p>';
        return;
    }

    orders.forEach(order => {
        const orderDetails = document.createElement('div');
        orderDetails.classList.add('order');
        orderDetails.innerHTML = `
            <p><strong>Customer ID:</strong> ${order.fields["Customer ID"].stringValue}</p>
            <p><strong>Item Name:</strong> ${order.fields["I Name"].stringValue}</p>
            <p><strong>Quantity:</strong> ${order.fields.Quantity.integerValue}</p>
            <p><strong>Price:</strong> ${order.fields.Price.integerValue}</p>
            <p><strong>Date:</strong> ${order.fields.Date.stringValue}</p>
            <hr>
        `;
        ordersContainer.appendChild(orderDetails);
    });
    console.log("Orders within Range:", ordersWithinRange);
displayOrders(ordersWithinRange);

}