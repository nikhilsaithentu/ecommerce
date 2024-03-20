document.addEventListener('DOMContentLoaded', function() {
    const getCurrentStockBtn = document.getElementById('getCurrentStockBtn');
    getCurrentStockBtn.addEventListener('click', getCurrentStock);

    const getHighStockBtn = document.getElementById('getHighStockBtn');
    getHighStockBtn.addEventListener('click', getHighStock);

    const getLowStockBtn = document.getElementById('getLowStockBtn');
    getLowStockBtn.addEventListener('click', getLowStock);
});


function getCurrentStock() {
    // Fetch inventory data
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/inventory', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(inventoryData => {
        const inventory = inventoryData.documents.map(item => {
            const name = item.fields.name && item.fields.name.stringValue ? item.fields.name.stringValue : 'N/A';
            const quantity = item.fields.quantity && item.fields.quantity.integerValue ? item.fields.quantity.integerValue : 'N/A';
            return {
                name,
                quantity
            };
        });
        displayInventoryDetails(inventory, 'Stock_report.csv');
    })
    .catch(error => {
        console.error('Error fetching current stock inventory details:', error);
    });
}
 
function displayInventoryDetails(inventory, filename) {
    let csvContent = "";
 
    // Add header row to CSV content
    csvContent += "Name,Quantity\n";
 
    // Add inventory data to CSV content
    inventory.forEach(item => {
        csvContent += `${item.name},${item.quantity}\n`;
    });
 
    // Create a blob from CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
 
    // Create a link element
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename); // Set the filename here
 
    // Append the link to the body and click it to trigger download
    document.body.appendChild(link);
    link.click();
 
    // Clean up by revoking the URL object
    URL.revokeObjectURL(url);
}

function getHighStock() {
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/inventory')
    .then(response => response.json())
    .then(data => {
        const highStockInventory = data.documents.filter(item => {
            const quantity = item.fields.quantity && parseInt(item.fields.quantity.integerValue);
            return quantity && quantity > 100;
        });
        displayInventoryDetails(highStockInventory, 'Higher_Stock_report.csv'); // Set the filename here
    })
    .catch(error => {
        console.error('Error fetching high stock inventory details:', error);
    });
}

function getLowStock() {
    fetch('https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/inventory')
    .then(response => response.json())
    .then(data => {
        const lowStockInventory = data.documents.filter(item => {
            const quantity = item.fields.quantity && parseInt(item.fields.quantity.integerValue);
            return quantity && quantity < 15;
        });
        displayInventoryDetails(lowStockInventory, 'Low_Stock_report.csv'); // Set the filename here
    })
    .catch(error => {
        console.error('Error fetching low stock inventory details:', error);
    });
}
