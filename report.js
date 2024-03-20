document.addEventListener('DOMContentLoaded', function() {
    // Get the anchor elements
    const customerReportsLink = document.querySelector('a[href="customerreport.html"]');
    const inventoryReportsLink = document.querySelector('a[href="inventoryreport.html"]');
    const salesReportsLink = document.querySelector('a[href="salesreport.html"]');
 
    // Add event listeners to handle redirection
    customerReportsLink.addEventListener('click', redirectToCustomerReports);
    inventoryReportsLink.addEventListener('click', redirectToInventoryReports);
    salesReportsLink.addEventListener('click', redirectToSalesReports);
 
    // Functions to handle redirection
    function redirectToCustomerReports(event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = 'customerreport.html'; // Redirect to customer reports page
    }
 
    function redirectToInventoryReports(event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = 'inventoryreport.html'; // Redirect to inventory reports page
    }
 
    function redirectToSalesReports(event) {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = 'salesreport.html'; // Redirect to sales reports page
    }
});
 