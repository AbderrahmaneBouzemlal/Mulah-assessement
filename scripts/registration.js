const nameInput = document.querySelector("#name");
const birthDay = document.querySelector("#birthday-day");
const birthMonth = document.querySelector("#birthday-month");
const birthYear = document.querySelector("#birthday-year");
const emailInput = document.querySelector("#email");
const form = document.querySelector("#form");
const checkBox = document.querySelector("#checkbox");
const MIN_ACCEP_YEAR = 1930;
let error = null;

function handlePaste(e) {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData).getData("text");
  const numbersOnly = paste.replace(/\D/g, "");

  const currentLength = this.value.length;
  const availableLength = this.maxLength - currentLength;

  if (availableLength > 0) {
    const textToInsert = numbersOnly.substring(0, availableLength);
    this.value += textToInsert;
    validateNumber(this);
  }
}

const urlParams = new URLSearchParams(window.location.search);

const phoneNumberParam = urlParams.get("phone");

function validateNumber(object) {
  if (object) {
    if (object.id === "birthday-day") {
      if (object.valueAsNumber <= 31 && object.valueAsNumber != 0) {
        return;
      } else {
        object.willValidate = false;
      }
    }
    if (object.id === "birthday-month") {
      if (object.valueAsNumber <= 12 && object.valueAsNumber != 0) {
        return;
      } else {
        object.willValidate = false;
      }
    }
    if (object.id === "birthday-year") {
      if (object.valueAsNumber >= MIN_ACCEP_YEAR && object.valueAsNumber != 0) {
        return;
      } else {
        object.willValidate = false;
      }
    }
  }
}

function restrictToNumbers(e) {
  // Allow backspace, delete, tab, escape, enter
  if (
    [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.keyCode === 65 && e.ctrlKey === true) ||
    (e.keyCode === 67 && e.ctrlKey === true) ||
    (e.keyCode === 86 && e.ctrlKey === true) ||
    (e.keyCode === 88 && e.ctrlKey === true) ||
    // Allow home, end, left, right arrows
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    return;
  }

  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }

  // Check max length
  if (this.value.length >= this.maxLength) {
    e.preventDefault();
  }
}

birthDay.addEventListener("keydown", restrictToNumbers);
birthMonth.addEventListener("keydown", restrictToNumbers);
birthYear.addEventListener("keydown", restrictToNumbers);

birthDay.addEventListener("input", validateNumber);
birthMonth.addEventListener("input", validateNumber);
birthYear.addEventListener("input", validateNumber);

birthDay.addEventListener("paste", handlePaste);
birthMonth.addEventListener("paste", handlePaste);
birthYear.addEventListener("paste", handlePaste);

checkBox.addEventListener("change", function (e) {
  if (this.checked) {
    emailInput.disabled = true;
    emailInput.value = "";
  } else {
    emailInput.disabled = false;
  }
});

document.querySelector(".btn").addEventListener("click", function (e) {
  e.preventDefault();
  const inputs = form.querySelectorAll("input[required]");
  let isValid = true;
  let errorMessage = "Please fill out all required fields correctly.";

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      if (input.type === "number") {
        errorMessage = "*Please insert your birthday";
        error = document.querySelector("#birthday-error");
        error.textContent = errorMessage;
      } else if (input.type === "email") {
        errorMessage = "*Please enter a valid email address.";
        error = document.querySelector("#email-error");
        error.textContent = errorMessage;
      } else if (input.type === "text") {
        errorMessage = "*Please insert your name";
        error = document.querySelector("#name-error");
        error.textContent = errorMessage;
      }
    }
    if (!isValid) {
      error.style.display = "block";
    } else {
      const formData = {
        name: nameInput.value,
        phone: phoneNumberParam,
        dateofbirth: `${birthDay.value}/${birthMonth.value}/${birthYear.value}`,
        email: emailInput.value,
      };
      console.log(formData);
      const params = new URLSearchParams();
      params.append("phone", formData.phone);
      params.append("name", formData.name);
      params.append("dateofbirth", formData.dateofbirth);
      params.append("email", formData.email);
      const encodedData = btoa(JSON.stringify(formData));
      params.append("data", encodedData);

      window.location.href = `confirmation.html?${params.toString()}`;
    }
  });
});
