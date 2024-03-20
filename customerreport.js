document.addEventListener('DOMContentLoaded', function() {
 
    const getCustomersBtn = document.getElementById('allCustomerBtn');
    getCustomersBtn.addEventListener('click', getTopCustomers);

    const getTopCustomersBtn = document.getElementById('topCustomersBtn');
    getTopCustomersBtn.addEventListener('click', getTop10Customers);
});

function fetchCustomerReports() {
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Customer')
    .then(response => response.json())
    .then(data => {
        console.log('Customer Reports:', data);
    })
    .catch(error => {
        console.error('Error fetching customer reports:', error);
    });
}
 
function getTopCustomers() {
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Customer', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const topCustomers = data.documents.slice(0, 10); // Select the first 10 customers
        displayTopCustomers(topCustomers, 'allcustomers.csv'); // Corrected filename
    })
    .catch(error => {
        console.error('Error fetching customer data:', error);
    });
}
 
function displayTopCustomers(topCustomers, filename) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Customer ID,Name,Email,Contact,Credit\n";
 
    topCustomers.forEach(customer => {
        const customerId = customer.name.split('/').pop();
        const fullName = customer.fields.fullName ? customer.fields.fullName.stringValue : 'N/A';
        const email = customer.fields.email ? customer.fields.email.stringValue : 'N/A';
        const contact = customer.fields.contact ? customer.fields.contact.stringValue : 'N/A';
        const credit = customer.fields.credit ? customer.fields.credit.integerValue : 'N/A';
 
        csvContent += `${customerId},${fullName},${email},${contact},${credit}\n`;
    });
 
    downloadCSV(csvContent, filename);
}
 
function downloadCSV(csvContent, filename) {
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
}


function getTop10Customers() {
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Purchase', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const orderCounts = {};
        if (data.documents) {
            data.documents.forEach(doc => {
                const customerId = doc.fields && doc.fields['Customer ID'] && doc.fields['Customer ID'].stringValue;
                if (customerId) {
                    orderCounts[customerId] = orderCounts[customerId] ? orderCounts[customerId] + 1 : 1;
                }
            });
 
            const topCustomers = Object.keys(orderCounts).sort((a, b) => orderCounts[b] - orderCounts[a]).slice(0, 10);
            fetchCustomerDetails(topCustomers, orderCounts);
        } else {
            console.error('No sales data found');
        }
    })
    .catch(error => {
        console.error('Error fetching sales data:', error);
    });
}

function fetchCustomerDetails(customerIds, orderCounts) {
    const promises = customerIds.map(customerId => {
        return fetch(`https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Customer/${customerId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            const customer = data.fields;
            return {
                customerId: customerId,
                name: customer.fullName ? customer.fullName.stringValue : 'N/A',
                email: customer.email ? customer.email.stringValue : 'N/A',
                orders: orderCounts[customerId] || 0
            };
        })
        .catch(error => {
            console.error(`Error fetching customer details for customer ID ${customerId}:`, error);
            return null;
        });
    });

    Promise.all(promises)
    .then(customers => {
        generateCSV(customers, 'top10customers.csv'); // Corrected filename
    })
    .catch(error => {
        console.error('Error fetching customer details:', error);
    });
}

function generateCSV(customers, filename) {
    let csv = 'Customer ID,Name,Email,Number of Orders\n'; // CSV header

    customers.forEach(customer => {
        csv += `${customer.customerId},${customer.name},${customer.email},${customer.orders}\n`; // Add customer details to CSV
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}
