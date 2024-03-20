$(document).ready(function() {
    var baseURL = 'https://firestore.googleapis.com/v1/projects/e-commerce-4e958/databases/(default)/documents/';

    // Load categories initially when the document is ready for deletion
    loadCategoriesForDeletion();

    $('#addCategoryBtn').click(function() {
      var categoryName = $('#categoryName').val();
      if (categoryName.trim() !== '') {
        checkCategoryExistence(categoryName);
      } else {
        alert("Please enter a category name.");
      }
    });

    $('#showAllCategoriesBtn').click(function() {
      loadCategories();
    });

    $('#deleteCategoryBtn').click(function() {
      var selectedCategory = $('#deleteCategorySelect').val();
      if (selectedCategory !== '') {
        var confirmDelete = confirm("Are you sure you want to delete the category?");
        if (confirmDelete) {
          deleteCategory(selectedCategory);
        }
      } else {
        alert("Please select a category to delete.");
      }
    });

    function checkCategoryExistence(categoryName) {
      // Convert input category name to lowercase
      var lowercaseCategoryName = categoryName.toLowerCase();

      // Check if the category already exists
      $.ajax({
        url: baseURL + 'Category',
        type: 'GET',
        success: function(response) {
          var categories = response.documents;
          var categoryExists = categories.some(function(category) {
            // Convert stored category names to lowercase for comparison
            var storedCategoryName = category.fields.name.stringValue.toLowerCase();
            return storedCategoryName === lowercaseCategoryName;
          });
          if (!categoryExists) {
            addCategory(categoryName);
          } else {
            alert("Category already exists.");
          }
        },
        error: function(xhr, status, error) {
          console.error('Error fetching categories:', error);
          alert("Error fetching categories. Please try again later.");
        }
      });
    }

    function addCategory(categoryName) {
      $.ajax({
        url: baseURL + 'Category',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ fields: { name: { stringValue: categoryName } } }),
        success: function(response) {
          console.log('Category added successfully:', response);
          alert("Category added successfully!");
          $('#categoryName').val('');
          loadCategories(); // Reload categories after adding a new one
          loadCategoriesForDeletion(); // Reload categories for deletion after any operation
        },
        error: function(xhr, status, error) {
          console.error('Error adding category:', error);
          alert("Error adding category. Please try again later.");
        }
      });
    }

    function loadCategories() {
      $.ajax({
        url: baseURL + 'Category',
        type: 'GET',
        success: function(response) {
          var categories = response.documents;
          $('#categories').empty(); // Clear previous categories
          categories.forEach(function(category) {
            var categoryName = category.fields.name.stringValue;
            $('#categories').append('<li>' + categoryName + '</li>');
          });
        },
        error: function(xhr, status, error) {
          console.error('Error fetching categories:', error);
          alert("Error fetching categories. Please try again later.");
        }
      });
    }

    function loadCategoriesForDeletion() {
      $.ajax({
        url: baseURL + 'Category',
        type: 'GET',
        success: function(response) {
          var categories = response.documents;
          $('#deleteCategorySelect').empty(); // Clear previous options
          categories.forEach(function(category) {
            var categoryName = category.fields.name.stringValue;
            $('#deleteCategorySelect').append('<option value="' + categoryName + '">' + categoryName + '</option>');
          });
        },
        error: function(xhr, status, error) {
          console.error('Error fetching categories:', error);
          alert("Error fetching categories. Please try again later.");
        }
      });
    }

    function deleteCategory(categoryName) {
      // Convert input category name to lowercase
      var lowercaseCategoryName = categoryName.toLowerCase();

      // Query the database to find the document ID based on the category name
      $.ajax({
        url: baseURL + 'Category',
        type: 'GET',
        success: function(response) {
          var categories = response.documents;
          var categoryId;
          categories.forEach(function(category) {
            var storedCategoryName = category.fields.name.stringValue.toLowerCase();
            if (storedCategoryName === lowercaseCategoryName) {
              categoryId = category.name.split('/').pop(); // Extract the document ID from the document path
            }
          });

          // If a category with the given name is found, delete it
          if (categoryId) {
            $.ajax({
              url: baseURL + 'Category/' + categoryId,
              type: 'DELETE',
              success: function(response) {
                console.log('Category deleted successfully:', response);
                alert("Category deleted successfully!");
                loadCategoriesForDeletion(); // Reload categories for deletion after deletion
              },
              error: function(xhr, status, error) {
                console.error('Error deleting category:', error);
                alert("Error deleting category. Please try again later.");
              }
            });
          } else {
            alert("Category not found.");
          }
        },
        error: function(xhr, status, error) {
          console.error('Error fetching categories:', error);
          alert("Error fetching categories. Please try again later.");
        }
      });
    }
});
