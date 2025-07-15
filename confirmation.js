const displayName = document.querySelector("#display-name");
const displayBirthDay = document.querySelector("#display-birthday");
const displayEmail = document.querySelector("#display-email");
const displayPhone = document.querySelector("#display-phone");

const urlParams = new URLSearchParams(window.location.search);

displayName.textContent = urlParams.get("name");
displayBirthDay.textContent = urlParams.get("dateofbirth");
displayEmail.textContent = urlParams.get("email");
displayPhone.textContent = urlParams.get("phone");
