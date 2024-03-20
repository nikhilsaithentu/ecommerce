$(document).ready(function() {
    // Show Orders button click event
    $('#showOrdersBtn').on('click', function() {
        // AJAX request to fetch and display orders
        $.ajax({
            url: 'https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Purchase',
            type: 'GET',
            success: function(response) {
                displayOrders(response.documents);
            },
            error: function(error) {
                console.error('Error fetching orders:', error);
            }
        });
    });

    // Delete Orders button click event
    $('#deleteOrdersBtn').on('click', function() {
        var confirmDeleteAll = confirm("Are you sure you want to delete all orders?");
        if (confirmDeleteAll) {
            // AJAX request to delete all orders
            $.ajax({
                url: 'https://firestore.googleapis.com/v1/projects/e-commerce-4e95/databases/(default)/documents/Purchase',
                type: 'DELETE',
                success: function(response) {
                    alert("All orders deleted successfully!");
                    // Refresh orders list
                    $('#showOrdersBtn').click(); // Trigger click event to reload orders
                },
                error: function(error) {
                    console.error('Error deleting all orders:', error);
                    alert("Error deleting orders. Please try again later.");
                }
            });
        }
    });

    // Function to display orders
    function displayOrders(orders) {
        var ordersContainer = $('#ordersContainer');
        ordersContainer.empty();

        if (orders.length === 0) {
            ordersContainer.append('<p>No orders found</p>');
        } else {
            ordersContainer.append('<h2>Orders:</h2>');
            var list = $('<ul></ul>');

            orders.forEach(function(order) {
                var listItem = $('<li></li>');
                listItem.text('Order ID: ' + order.name.split('/').pop());

                var deleteButton = $('<button class="deleteBtn">Delete</button>');
                deleteButton.data('orderId', order.name.split('/').pop()); // Store order ID as data attribute
                deleteButton.on('click', function() {
                    var orderId = $(this).data('orderId'); // Retrieve order ID from data attribute
                    var confirmDelete = confirm("Are you sure you want to delete this order?");
                    if (confirmDelete) {
                        deleteOrder(orderId);
                    }
                });

                var orderDetails = $('<ul></ul>');
                Object.keys(order.fields).forEach(function(key) {
                    var fieldValue = order.fields[key];
                    orderDetails.append('<li><strong>' + key + ':</strong> ' + getFieldTextValue(fieldValue) + '</li>');
                });

                listItem.append(orderDetails);
                listItem.append(deleteButton);
                list.append(listItem);
            });

            ordersContainer.append(list);
        }
    }

    // Function to delete a single order
    function deleteOrder(orderId) {
        $.ajax({
            url: 'https://firestore.googleapis.com/v1/projects/onlinestore-2e219/databases/(default)/documents/Purchase/' + orderId,
            type: 'DELETE',
            success: function(response) {
                alert("Order deleted successfully!");
                // Refresh orders list
                $('#showOrdersBtn').click(); // Trigger click event to reload orders
            },
            error: function(error) {
                console.error('Error deleting order:', error);
                alert("Error deleting order. Please try again later.");
            }
        });
    }
    // Function to get text value of a field
    function getFieldTextValue(fieldValue) {
        if (fieldValue.stringValue !== undefined) {
            return fieldValue.stringValue;
        } else if (fieldValue.integerValue !== undefined) {
            return fieldValue.integerValue;
        } else if (fieldValue.timestampValue !== undefined) {
            return new Date(fieldValue.timestampValue).toLocaleString();
        } else if (fieldValue.arrayValue !== undefined) {
            return fieldValue.arrayValue.values.map(function(item) {
                return getFieldTextValue(item);
            }).join(', ');
        } else {
            return 'Unknown';
        }
    }
});
