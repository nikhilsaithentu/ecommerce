// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmrZDN4_kiZ_3RUenA8uyWQXCXCmv5Riw",
    authDomain: "e-commerce-4e958.firebaseapp.com",
    projectId: "e-commerce-4e958",
    storageBucket: "e-commerce-4e958.appspot.com",
    messagingSenderId: "1017430963712",
    appId: "1:1017430963712:web:ca4092611e2db12d9dcae5",
    measurementId: "G-F4XSC3Z6HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

var fullName = document.getElementById("fullname");
var contact = document.getElementById("contact");
var email = document.getElementById("email");
var password = document.getElementById("password");
var copassword = document.getElementById("copassword");
var credit = 1000;

window.signup = function (e) {
    const nameRegex = /^[a-zA-Z]+$/; // Only alphabets
    const contactRegex = /^\d+$/; // Only numbers

    if (fullName.value == "" || contact.value == "" || email.value == "" || password.value == "") {
        alert("All fields are required");
        return;
    }
    if (!nameRegex.test(fullName.value)) {
        alert("Name can only contain alphabets");
        return;
    }
    if (!contactRegex.test(contact.value)) {
        alert("Contact number can only contain numbers");
        return;
    }
    if (password.value != copassword.value) {
        alert("Password Confirmation is Wrong");
        return;
    }

    e.preventDefault();
    var obj = {
        firstName: fullName.value,
        contact: contact.value,
        email: email.value,
        password: password.value,
    };

    // Check if the email matches the admin pattern
    const isAdmin = /nikhilthentu@gmail\.com|sandy27@gmail\.com/.test(obj.email);

    // Create the user using Firebase Authentication
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then(function (userCredential) {
            // User signed up successfully
            const user = userCredential.user;
            const uid = user.uid; // Get the UID of the user
            // Store additional user data in Firestore with UID as document ID
            const role = isAdmin ? "Admin" : "Customer";
            const userDocRef = doc(db, role, uid);
            const userData = {
                fullName: obj.firstName,
                contact: obj.contact,
                email: obj.email,
            };
            if (!isAdmin) {
                userData.credit = credit;
            }
            setDoc(userDocRef, userData)
            .then(() => {
                console.log("User data added to Firestore successfully!");
                // Redirect to login page
                window.location.replace('login.html');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                alert("Error adding user data to Firestore");
            });
        })
        .catch(function (error) {
            console.error("Error creating user: ", error);
            alert("Error creating user: " + error.message);
        });
};
