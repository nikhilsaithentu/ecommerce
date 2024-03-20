import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCmrZDN4_kiZ_3RUenA8uyWQXCXCmv5Riw",
    authDomain: "e-commerce-4e958.firebaseapp.com",
    projectId: "e-commerce-4e958",
    storageBucket: "e-commerce-4e958.appspot.com",
    messagingSenderId: "1017430963712",
    appId: "1:1017430963712:web:ca4092611e2db12d9dcae5",
    measurementId: "G-F4XSC3Z6HJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submitData = document.getElementById("submit");
const forgotEmail = document.getElementById("email");

submitData.addEventListener("click", () => {
    const email = forgotEmail.value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            forgotEmail.value = "";
            Swal.fire("Congratulation!", "Your Password reset link has been sent to your email!", "success");
            // Redirect to login page after 4 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 4000);
        })
        .catch((error) => {
            console.error("Error sending password reset email:", error);
            const errorMessage = error.message;
            Swal.fire("Oops!", errorMessage, "error");
        });
});
