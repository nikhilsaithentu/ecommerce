$(document).ready(function() {
    var customers;
    var pageSize = 5;
    
    $("#fetchCustomersBtn").click(function() {
        $.ajax({
            url: "https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Customer",
            type: "GET",
            success: function(response) {
                customers = response.documents;
                displayCustomers(1); // Display first page of customers
            },
            error: function(xhr, status, error) {
                console.error("Error fetching customers:", error);
            }
        });
    });

    function displayCustomers(page) {
        var startIndex = (page - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        var paginatedCustomers = customers.slice(startIndex, endIndex);

        var customerListHTML = "<table><tr><th>Name</th><th>Contact</th><th>Email</th><th>Credit</th></tr>";
        paginatedCustomers.forEach(function(customer) {
            var fields = customer.fields;
            var fullName = fields.fullName.stringValue;
            var contact = fields.contact.stringValue;
            var email = fields.email.stringValue;
            var credit = fields.credit.integerValue;
            customerListHTML += "<tr><td>" + fullName + "</td><td>" + contact + "</td><td>" + email + "</td><td>" + credit + "</td></tr>";
        });
        customerListHTML += "</table>";
        $("#customerList").html(customerListHTML);
        
        displayPagination(page);
    }

    function displayPagination(currentPage) {
        var totalPages = Math.ceil(customers.length / pageSize);
        var paginationHTML = "<div class='pagination'>";
        for (var i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += "<a class='active' href='#'>" + i + "</a>";
            } else {
                paginationHTML += "<a href='#' onclick='displayCustomers(" + i + ")'>" + i + "</a>";
            }
        }
        paginationHTML += "</div>";
        $("#pagination").html(paginationHTML);
    }
});
