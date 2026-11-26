
const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");


registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();


  formMessage.textContent = "";
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  usernameInput.style.borderColor = "";
  emailInput.style.borderColor = "";
  passwordInput.style.borderColor = "";
  confirmPasswordInput.style.borderColor = "";


  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  let isValid = true;

  if (username === "") {
    usernameError.textContent = "Username cannot be empty.";
    usernameInput.style.borderColor = "red";
    isValid = false;
  }


  if (email === "") {
    emailError.textContent = "Email cannot be empty.";
    emailInput.style.borderColor = "red";
    isValid = false;
  } else if (!email.includes("@")) {
    emailError.textContent = "Please enter a valid email address containing '@'.";
    emailInput.style.borderColor = "red";
    isValid = false;
  }

  if (password === "") {
    passwordError.textContent = "Password cannot be empty.";
    passwordInput.style.borderColor = "red";
    isValid = false;
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters long.";
    passwordInput.style.borderColor = "red";
    isValid = false;
  }


  if (confirmPassword === "") {
    confirmPasswordError.textContent = "Please confirm your password.";
    confirmPasswordInput.style.borderColor = "red";
    isValid = false;
  } else if (confirmPassword !== password) {
    confirmPasswordError.textContent = "Passwords do not match.";
    confirmPasswordInput.style.borderColor = "red";
    isValid = false;
  }

  
  if (isValid) {
    formMessage.textContent = "Registration successful!";
    formMessage.style.color = "green";

    console.log({
      username: username,
      email: email
    });

    registrationForm.reset();
  }
});