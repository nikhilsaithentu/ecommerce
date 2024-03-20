$(document).ready(function() {
    var baseURL = 'https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/inventory/';
    var categoryURL = 'https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/Category';

    $('#addProductBtn').click(function() {
        $('#addProductForm').show();
        $('#displayProductForm, #updateProductForm, #deleteConfirmation').hide();
        loadCategoriesForInventory();
    });

    $('#displayProductsBtn').click(function() {
        $('#displayProductForm').show();
        $('#addProductForm, #updateProductForm, #deleteConfirmation').hide();
        loadCategoriesForDisplay();
    });

    $('#submitProductBtn').click(function() {
        var productName = $('#productName').val();
        var productQuantity = $('#productQuantity').val();
        var productPrice = $('#productPrice').val();
        var productCategory = $('#productCategory').val();

        if (productName.trim() !== '' && productQuantity !== '' && productPrice !== '') {
            var formData = {
                fields: {
                    name: { stringValue: productName },
                    quantity: { integerValue: parseInt(productQuantity) },
                    price: { doubleValue: parseFloat(productPrice) },
                    category : { stringValue: productCategory }
                }
            };

            addProduct(formData);
        } else {
            alert("Please fill in all fields.");
        }
    });

    $('#displayCategory').change(function() {
        var selectedCategory = $(this).val();
        if (selectedCategory === "") {
            loadAllProducts(); // Call loadAllProducts() when "All Categories" is selected
        } else {
            loadProductsByCategory(selectedCategory);
        }
    });

    function addProduct(formData) {
        $.ajax({
            url: baseURL,
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                console.log('Product added successfully:', response);
                alert("Product added successfully!");
                $('#productName').val('');
                $('#productQuantity').val('');
                $('#productPrice').val('');
            },
            error: function(xhr, status, error) {
                console.error('Error adding product:', error);
                alert("Error adding product. Please try again later.");
            }
        });
    }

    function loadCategoriesForInventory() {
        $.ajax({
            url: categoryURL,
            type: 'GET',
            success: function(response) {
                var categories = response.documents;
                $('#productCategory').empty(); // Clear previous options
                categories.forEach(function(category) {
                    var categoryName = category.fields.name.stringValue;
                    $('#productCategory').append('<option value="' + categoryName + '">' + categoryName + '</option>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching categories:', error);
                alert("Error fetching categories. Please try again later.");
            }
        });
    }

    function loadCategoriesForDisplay() {
        $.ajax({
            url: categoryURL,
            type: 'GET',
            success: function(response) {
                var categories = response.documents;
                $('#displayCategory').empty(); // Clear previous options
                $('#displayCategory').append('<option value="">All Categories</option>'); // Add option for all categories
                categories.forEach(function(category) {
                    var categoryName = category.fields.name.stringValue;
                    $('#displayCategory').append('<option value="' + categoryName + '">' + categoryName + '</option>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching categories:', error);
                alert("Error fetching categories. Please try again later.");
            }
        });
    }

    function loadProductsByCategory(category) {
        $.ajax({
            url: baseURL,
            type: 'GET',
            success: function(response) {
                var products = response.documents;
                $('#displayProducts').empty(); // Clear previous options
                products.forEach(function(product) {
                    var productCategory = product.fields.category.stringValue;
                    if (productCategory === category) {
                        var productName = product.fields.name.stringValue;
                        var productQuantity = product.fields.quantity.integerValue;
                        var productPrice = product.fields.price.doubleValue;
                        $('#displayProducts').append('<option value="' + productName + '">Name: ' + productName + ' | Quantity: ' + productQuantity + ' | Price: ' + productPrice + '</option>');
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            }
        });
    }

    function loadAllProducts() {
        $.ajax({
            url: baseURL,
            type: 'GET',
            success: function(response) {
                var products = response.documents;
                $('#displayProducts').empty(); // Clear previous options
                products.forEach(function(product) {
                    var productName = product.fields.name.stringValue;
                    var productQuantity = product.fields.quantity.integerValue;
                    var productPrice = product.fields.price.doubleValue;
                    var productCategory = product.fields.category.stringValue;
                    $('#displayProducts').append('<option value="' + productName + '">Name: ' + productName + ' | Quantity: ' + productQuantity + ' | Price: ' + productPrice + ' | Category: ' + productCategory + '</option>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            }
        });
    }

    $('#updateProductBtn').click(function() {
        $('#updateProductForm').show();
        $('#addProductForm, #displayProductForm, #deleteConfirmation').hide();
        loadAllProductsForUpdate();
    });

    function loadAllProductsForUpdate() {
        $.ajax({
            url: baseURL,
            type: 'GET',
            success: function(response) {
                var products = response.documents;
                $('#updateProducts').empty(); // Clear previous options
                products.forEach(function(product) {
                    var productName = product.fields.name.stringValue;
                    var productId = product.name.split('/').pop(); // Extract product ID from Firestore document path
                    $('#updateProducts').append('<option value="' + productId + '">' + productName + '</option>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            }
        });
    }

    // Add event listener for selecting a product to update
    $('#updateProducts').change(function() {
        var productId = $(this).val();
        if (productId !== '') {
            loadProductDetailsForUpdate(productId);
        }
    });

    // Function to load product details for update
    function loadProductDetailsForUpdate(productId) {
        var getProductURL = baseURL + productId;

        $.ajax({
            url: getProductURL,
            type: 'GET',
            success: function(response) {
                var product = response.fields;
                var productName = product.name.stringValue;
                var productCategory = product.category.stringValue;
                var productQuantity = product.quantity.integerValue;
                var productPrice = product.price.doubleValue;

                // Populate the update form fields with product details
                $('#updateProductName').val(productName);
                $('#updateProductCategory').val(productCategory);
                $('#updateProductQuantity').val(productQuantity);
                $('#updateProductPrice').val(productPrice);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching product details:', error);
                alert("Error fetching product details. Please try again later.");
            }
        });
    }

    // Function to update product details
    $('#submitUpdateProductBtn').click(function() {
        var productId = $('#updateProducts').val();
        var newProductName = $('#updateProductName').val();
        var newProductCategory = $('#updateProductCategory').val();
        var newProductQuantity = $('#updateProductQuantity').val();
        var newProductPrice = $('#updateProductPrice').val();

        if (productId && newProductQuantity !== '' && newProductPrice !== '') {
            updateProduct(productId, newProductName, newProductCategory, parseInt(newProductQuantity), parseFloat(newProductPrice));
        } else {
            alert("Please fill in all fields.");
        }
    });

    function updateProduct(productId, newProductName, newProductCategory, newProductQuantity, newProductPrice) {
        var updateURL = baseURL + productId;

        var formData = {
            fields: {
                name: { stringValue: newProductName },
                category: { stringValue: newProductCategory },
                quantity: { integerValue: newProductQuantity },
                price: { doubleValue: newProductPrice }
            }
        };

        $.ajax({
            url: updateURL,
            type: 'PATCH',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                console.log('Product updated successfully:', response);
                alert("Product updated successfully!");
                // Clear form fields after successful update
                $('#updateProductQuantity').val('');
                $('#updateProductPrice').val('');
            },
            error: function(xhr, status, error) {
                console.error('Error updating product:', error);
                alert("Error updating product. Please try again later.");
            }
        });
    }
    
    $('#deleteProductBtn').click(function() {
        $('#deleteConfirmation').show();
        $('#addProductForm, #displayProductForm, #updateProductForm').hide();
        loadAllProductsForDeletion();
    });

    // Function to load all products for deletion
    function loadAllProductsForDeletion() {
        $.ajax({
            url: baseURL,
            type: 'GET',
            success: function(response) {
                var products = response.documents;
                $('#productsForDeletion').empty(); // Clear previous options
                products.forEach(function(product) {
                    var productName = product.fields.name.stringValue;
                    var productId = product.name.split('/').pop(); // Extract product ID from Firestore document path
                    $('#productsForDeletion').append('<option value="' + productId + '">' + productName + '</option>');
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching products:', error);
                alert("Error fetching products. Please try again later.");
            }
        });
    }

    // Function to confirm product deletion
    $('#confirmDeleteBtn').click(function() {
        var productId = $('#productsForDeletion').val();
        if (productId !== '') {
            if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(productId);
            }
        } else {
            alert("Please select a product to delete.");
        }
    });

    // Function to delete product
    function deleteProduct(productId) {
        var deleteURL = baseURL + productId;

        $.ajax({
            url: deleteURL,
            type: 'DELETE',
            success: function(response) {
                console.log('Product deleted successfully:', response);
                alert("Product deleted successfully!");
                // Optionally, you can reload the product list after deletion
                loadAllProductsForDeletion();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting product:', error);
                alert("Error deleting product. Please try again later.");
            }
        });
    }
});