// Country codes data
const countries = [
    { name: "Malaysia", code: "+60", flag: "🇲🇾"},
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "Thailand", code: "+66", flag: "🇹🇭"},
    { name: "Indonesia", code: "+62", flag: "🇮🇩"},
    { name: "Philippines", code: "+63", flag: "🇵🇭"},
    { name: "Vietnam", code: "+84", flag: "🇻🇳"},
    { name: "United States", code: "+1", flag: "🇺🇸"},
    { name: "United Kingdom", code: "+44", flag: "🇬🇧"},
    { name: "Australia", code: "+61", flag: "🇦🇺"},
    { name: "India", code: "+91", flag: "🇮🇳"},
    { name: "China", code: "+86", flag: "🇨🇳"},
    { name: "Japan", code: "+81", flag: "🇯🇵"},
    { name: "South Korea", code: "+82", flag: "🇰🇷"}
];
const authorizedPhone = "1137867725"
const pattern  = "[0-9]{9,10}";
const minLength = 9;
const maxLength = 10;
const phoneInput = document.getElementById('phone');
const countryCodeSpan = document.querySelector('.country-code');
const arrow = document.querySelector('.arrow');
const tickIcon = document.querySelector('.tick-icon');
const phoneInputWrapper = document.querySelector('.phone-input-wrapper');
const errorPopup = document.querySelector('.error-popup')
const form = document.querySelector('#loyaltyForm')

let currentCountry = countries[0];
//we are creating a invisible drop down div the position is relative add it to the phone-input-wrapper
const dropdown = document.createElement('div');
dropdown.className = 'country-dropdown';
dropdown.style.display = 'none';
phoneInputWrapper.style.position = 'relative';
phoneInputWrapper.appendChild(dropdown);

//filling the drop down with the countries above which is a clickable div
function populateDropdown() {
    dropdown.innerHTML = '';
    countries.forEach(country => {
        const option = document.createElement('div');
        option.className = 'country-option';
        option.innerHTML = `${country.flag} ${country.name} (${country.code})`;
        option.addEventListener('click', () => selectCountry(country));
        dropdown.appendChild(option);
    });
}

/* will be fired when a certain option have been clicked
by changing the text content to the code of shown
*/
function selectCountry(country) {
    currentCountry = country;
    countryCodeSpan.textContent = country.code;
    //hide the drop down
    dropdown.style.display = 'none';

    //make the arrow face down again
    arrow.classList.remove('active');
    
    validatePhone();
}

// when clicking on the arrow  make the class active and visible
function toggleDropdown() {
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        arrow.classList.add('active');
    } else {
        dropdown.style.display = 'none';
        arrow.classList.remove('active');
    }
}

/**
 * get the phone value
 * check if the phone number in the range of minlength and maxlength and only numbers
 * if the phone is valid make the tick green 
 * if it is invalid make the tick red
 * */
function validatePhone() {
    const phoneValue = phoneInput.value;
    const isValid = phoneValue.length >= minLength && 
                   phoneValue.length <= maxLength &&
                   /^\d+$/.test(phoneValue) && 
                   phoneValue.length > 0;
    
    if (phoneValue === '') {
        phoneInput.style.borderColor = 'var(--secondary-color)';
    } else if (isValid) {
        tickIcon.style.opacity = '1';
        tickIcon.querySelector('path').setAttribute('fill', 'var(--ok-color)');
        phoneInput.style.borderColor = 'var(--ok-color)';
    } else {
        tickIcon.style.opacity = '1';
        tickIcon.querySelector('path').setAttribute('fill', 'var(--error-color)');
        phoneInput.style.borderColor = 'var(--error-color)';
    }
}

// restrict to Numbers only
function restrictToNumbers(e) {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow home, end, left, right arrows
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
    
    // Check max length
    if (phoneInput.value.length >= maxLength) {
        e.preventDefault();
    }
}

// Handle paste event to allow only numbers
function handlePaste(e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const numbersOnly = paste.replace(/\D/g, '');
    
    // Respect max length
    const currentLength = phoneInput.value.length;
    const availableLength = maxLength - currentLength;
    
    if (availableLength > 0) {
        const textToInsert = numbersOnly.substring(0, availableLength);
        phoneInput.value += textToInsert;
        validatePhone();
    }
}

function handleClickOutside(e) {
    if (!phoneInputWrapper.contains(e.target)) {
        dropdown.style.display = 'none';
        arrow.classList.remove('active');
    }
}

arrow.addEventListener('click', toggleDropdown);
phoneInput.addEventListener('input', validatePhone);
phoneInput.addEventListener('keydown', restrictToNumbers);
phoneInput.addEventListener('paste', handlePaste);
document.addEventListener('click', handleClickOutside);

// Initialize
populateDropdown();
// make it to malaysia the default one
selectCountry(currentCountry);


// Form submission validation
document.querySelector('.btn').addEventListener('click', function(e) {
    e.preventDefault();
    const phoneValue = phoneInput.value;
    const isValid = currentCountry.code === '+60' && phoneValue === authorizedPhone;
    let errorMessage = "you are not authorized";

    if (isValid) {
        const formData = {
            phone: `${currentCountry.code}${phoneValue}`
        };
        const params = new URLSearchParams();
        params.append('phone', formData.phone);
        
        const encodedData = btoa(JSON.stringify(formData));
        params.append('data', encodedData);
        
        window.location.href = `registration.html?${params.toString()}`;
    } else {
        errorPopup.textContent = errorMessage;
        errorPopup.classList.add("show");
        setTimeout(() => {
            errorPopup.classList.remove("show");
        }, 3000);
        
        phoneInput.focus();
    }
});

const style = document.createElement('style');
style.textContent = `
    .tick-icon {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .country-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .country-option {
        padding: 12px 16px;
        cursor: pointer;
        font-size: 16px;
        color: var(--text-color);
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;
    }
    
    .country-option:hover {
        background-color: var(--border-color);
    }
    
    .country-option:last-child {
        border-bottom: none;
    }
    
    .phone-input-wrapper {
        position: relative;
    }
    
    .arrow {
        transition: transform 0.3s ease;
    }
    
    .arrow.active {
        transform: rotate(180deg);
    }
    
    .country-code {
        cursor: pointer;
        user-select: none;
    }
`;
document.head.appendChild(style);