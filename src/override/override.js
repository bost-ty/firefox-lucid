// L U  C   I    D
// Daniel Eden wrote this code
// He also happened to write this ode
// To focus, clarity, rest, and joy
// Which, I hope, you find in this toy

// Updated by @bost-ty, 2020, for Firefox

// Initialize settings variables
let timezoneOffset;
let colorPreference;
let fontPreference;

let syncObject = {};

let notepad = document.querySelector(".notepad");
let initialNotepadContent = "";
let notepadContent;

// Restore options on load
function restoreOptions() {
  let getting = browser.storage.sync.get();
  getting.then((result) => {
    syncObject = result;
    if (getting) {
      timezoneOffset = result.timezone;
      colorPreference = result.colorPreference;
      fontPreference = result.fontPreference;
      notepadContent = result.notepadContent;
      start();
      console.log(syncObject);
    }
  });
}

// Set color scheme and font preference.
function checkPreferences() {
  const rootStyles = document.documentElement;
  const light = getComputedStyle(rootStyles).getPropertyValue("--light");
  const dark = getComputedStyle(rootStyles).getPropertyValue("--dark");
  const sans = getComputedStyle(rootStyles).getPropertyValue("--sans");
  const mono = getComputedStyle(rootStyles).getPropertyValue("--mono");
  if (!colorPreference) {
    // Default to dark mode
    rootStyles.style.setProperty("--foreground", light);
    rootStyles.style.setProperty("--background", dark);
  } else if (colorPreference == "light") {
    rootStyles.style.setProperty("--foreground", dark);
    rootStyles.style.setProperty("--background", light);
  } else if (colorPreference == "dark") {
    rootStyles.style.setProperty("--foreground", light);
    rootStyles.style.setProperty("--background", dark);
  }
  if (!fontPreference) rootStyles.style.setProperty("--fontStack", mono);
  else if (fontPreference == "sans") rootStyles.style.setProperty("--fontStack", sans);
  else if (fontPreference == "mono") rootStyles.style.setProperty("--fontStack", mono);
}

// Constants
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function listenerUpdate() {
  notepadContent = notepad.textContent;
}

function start() {
  checkPreferences();
  // Determine and format date & time of day
  let now = new Date();
  let timeString = `${weekdays[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;

  // Check if offset from Date is non-zero, and if so, use it by default
  if (now.getTimezoneOffset() !== 0 && timezoneOffset !== 0) {
    timezoneOffset = now.getTimezoneOffset();
  }

  let roughHours = now.getHours() + timezoneOffset;
  let broadTime = roughHours < 12 ? "morning" : roughHours > 17 ? "evening" : "afternoon";

  let greeting = document.querySelector(".greeting");
  greeting.textContent = `Good ${broadTime}. Today is ${timeString}.`;

  // Set up the notepad
  notepad.textContent = notepadContent;
}

// Allow updating content between tabs
let windowIsActive;
let storeListener = setInterval(listenerUpdate, 1000);

window.onfocus = function () {
  windowIsActive = true;
};

window.onblur = function () {
  windowIsActive = false;
  if (storeListener) {
    clearInterval(storeListener);
  }
  storeListener = setInterval(listenerUpdate, 1000);
};

notepad.addEventListener("blur", (e) => {
  if (storeListener) {
    clearInterval(storeListener);
  }
  storeListener = setInterval(listenerUpdate, 1000);
});

notepad.addEventListener("focus", (e) => {
  if (storeListener) {
    clearInterval(storeListener);
  }
});

// Capture scrolling
window.addEventListener("mousewheel", scrollCapture);
function scrollCapture(e) {
  if (e.target !== notepad) notepad.scrollTop += e.deltaY;
}

// Event listeners
document.addEventListener("DOMContentLoaded", restoreOptions);
