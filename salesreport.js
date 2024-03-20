$(document).ready(function() {
    // Show All Sales button click event
    $('#showAllSalesBtn').on('click', function() {
        fetchAndDisplaySales('All', 'sales.csv');
    });

    // Credit Sales button click event
    $('#showCreditSalesBtn').on('click', function() {
        fetchAndDisplaySales('credit', 'creditsales.csv');
    });

    // Cash Sales button click event
    $('#showCashSalesBtn').on('click', function() {
        fetchAndDisplaySales('cash', 'cashsales.csv');
    });

    // Filter By Date button click event
    $('#getOrdersByDateRange').on('click', function() {
        var fromDate = $('#fromDate').val();
        var toDate = $('#toDate').val();
        if (fromDate && toDate) {
            getOrdersByDateRange();
        } else {
            alert('Please select both From and To dates.');
        }
    });

    // Function to fetch and display sales based on payment method
    function fetchAndDisplaySales(paymentMethod, fileName) {
        $.ajax({
            url: 'https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Purchase',
            type: 'GET',
            success: function(response) {
                var sales = response.documents;
                var filteredSales = [];

                if (paymentMethod === 'All') {
                    filteredSales = sales;
                } else {
                    filteredSales = sales.filter(function(sale) {
                        return getFieldTextValue(sale.fields['Payment Mode']) === paymentMethod;
                    });
                }

                downloadSalesAsCSV(filteredSales, fileName);
            },
            error: function(error) {
                console.error('Error fetching sales:', error);
            }
        });
    }

    // Function to convert sales data to CSV format and trigger download
    function downloadSalesAsCSV(sales, fileName) {
        var csv = 'Sale ID,Customer ID,Date,Item Name,Price,Quantity,Payment Method\n';
        sales.forEach(function(sale) {
            var saleId = sale.name.split('/').pop();
            var customerId = getFieldTextValue(sale.fields['Customer ID']);
            var date = getFieldTextValue(sale.fields['Date']);
            var itemName = getFieldTextValue(sale.fields['I Name']);
            var price = getFieldTextValue(sale.fields['Price']);
            var quantity = getFieldTextValue(sale.fields['Quantity']);
            var paymentMethod = getFieldTextValue(sale.fields['Payment Mode']);
            csv += saleId + ',' + customerId + ',' + date + ',' + itemName + ',' + price + ',' + quantity + ',' + paymentMethod + '\n';
        });

        // Create a hidden link element to trigger the download
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName; // Set the filename
        hiddenElement.click();
    }

    // Function to get text value of a field
    function getFieldTextValue(fieldValue) {
        if (fieldValue && fieldValue.stringValue !== undefined) {
            return fieldValue.stringValue;
        } else if (fieldValue && fieldValue.integerValue !== undefined) {
            return fieldValue.integerValue;
        } else if (fieldValue && fieldValue.doubleValue !== undefined) {
            return fieldValue.doubleValue;
        } else if (fieldValue && fieldValue.timestampValue !== undefined) {
            return new Date(fieldValue.timestampValue).toLocaleDateString();
        } else {
            return 'Unknown';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
 
    const getOrdersByDateRangeBtn = document.getElementById('getOrdersByDateRange');
    getOrdersByDateRangeBtn.addEventListener('click', getOrdersByDateRange);
});
 
 

 
function getOrdersByDateRange() {
    const startDate = moment(document.getElementById('fromDate').value);
    const endDate = moment(document.getElementById('toDate').value);
 
    console.log("Start Date:", startDate.format());
    console.log("End Date:", endDate.format());
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Purchase', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched Data:", data);
 
        const ordersWithinRange = data.documents.filter(order => {
            const orderTimestamp = order.createTime;
            const orderDate = moment(orderTimestamp, 'YYYY-MM-DD'); // Adjust the format as per your timestamp format
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
       
        // Convert timestamp to JavaScript Date object
        const date = new Date(order.fields.Date.timestampValue);
        const formattedDate = date.toLocaleString(); // Format the date as per your requirement
       
        orderDetails.innerHTML = `
            <p><strong>Customer ID:</strong> ${order.fields["Customer ID"].stringValue}</p>
            <p><strong>Item Name:</strong> ${order.fields["I Name"].stringValue}</p>
            <p><strong>Quantity:</strong> ${order.fields.Quantity.integerValue}</p>
            <p><strong>Price:</strong> ${order.fields.Price.integerValue}</p>
            <p><strong>Date:</strong> ${formattedDate}</p> <!-- Display the formatted date -->
            <hr>
        `;
        ordersContainer.appendChild(orderDetails);
    });
}

   