const gridContainer = document.getElementById("grid-container");
const hexStringElem = document.getElementById("hex-string");
const bitcoinAddressElem = document.getElementById("bitcoin-address");
const targetAddressSelect = document.getElementById("target-address");
const foundHexElem = document.getElementById("found-hex");
const maxHex = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"; // Max 256-bit hex
 
let holdInterval;
// Function to update the hexadecimal string display
function updateHexString() {
  const cells = document.querySelectorAll(".cell");
  let binaryString = "";
  cells.forEach(cell => {
    binaryString += cell.classList.contains("active") ? "1" : "0";
  });

  // Convert binary string to hexadecimal
  let hexString = BigInt("0b" + binaryString).toString(16).toUpperCase().padStart(64, '0');
  hexStringElem.textContent = hexString;

  const bitcoinAddress = bitcoinaddress(hexString);
  bitcoinAddressElem.textContent = bitcoinAddress;

  checkForMatch(bitcoinAddress, hexString);
}

// Create 16x16 cells
function createGrid(size = 16) {
  gridContainer.innerHTML = '';  // Clear existing cells
  for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = 256-i;
      cell.addEventListener("click", () => {
          cell.classList.toggle("active");
          updateHexString();
      });
      gridContainer.appendChild(cell);
  }
  updateHexString();  // Initial display update
}

function adjustHexValue(amount) {
  let currentHex = hexStringElem.textContent;
  let newValue = BigInt("0x" + currentHex) + BigInt(amount);

  // Clamp value within 0 and max 256-bit value
  if (newValue < 0) newValue = BigInt(0);
  if (newValue > BigInt("0x" + maxHex)) newValue = BigInt("0x" + maxHex);

  // Convert to 64-character hex string
  const newHex = newValue.toString(16).toUpperCase().padStart(64, '0');

  // Update grid and display
  hexStringElem.textContent = newHex;
  applyHexToGrid(newHex);
  const bitcoinAddress = bitcoinaddress(newHex);
  bitcoinAddressElem.textContent = bitcoinAddress;

  checkForMatch(bitcoinAddress, newHex);
}

// Function to apply hex string to the grid (each hex digit converted to binary)
function applyHexToGrid(hexString) {
  const binaryString = BigInt("0x" + hexString).toString(2).padStart(16 * 16, '0');
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
      if (binaryString[index] === "1") {
          cell.classList.add("active");
      } else {
          cell.classList.remove("active");
      }
  });
}

function checkForMatch(generatedAddress, hexString) {
  const targetAddress = targetAddressSelect.value;
  if (generatedAddress == targetAddress) {
      foundHexElem.textContent = hexString;
  }
}

document.getElementById("copy-key").addEventListener("click", () => {
  const privatekey = hexStringElem.textContent;
  navigator.clipboard.writeText(privatekey).then(() => {
      alert("Private key copied to clipboard!");
  });
});

document.getElementById("copy-address").addEventListener("click", () => {
  const address = bitcoinAddressElem.textContent;
  navigator.clipboard.writeText(address).then(() => {
      alert("Bitcoin Address copied to clipboard!");
  });
});

// Save grid state to localStorage
document.getElementById("save-grid").addEventListener("click", () => {
  const cells = Array.from(document.querySelectorAll(".cell"));
  const binaryState = cells.map(cell => (cell.classList.contains("active") ? "1" : "0")).join("");
  localStorage.setItem("gridState", binaryState);
  alert("Grid state saved!");
});

// Load grid state from localStorage
document.getElementById("load-grid").addEventListener("click", () => {
  const binaryState = localStorage.getItem("gridState");
  if (binaryState) {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell, index) => {
          if (binaryState[index] === "1") {
              cell.classList.add("active");
              cell.textContent = "1";
          } else {
              cell.classList.remove("active");
              cell.textContent = "0";
          }
      });
      updateHexString();
  } else {
      alert("No saved grid state found!");
  }
});

document.getElementById("clear-grid").addEventListener("click", () => {
  document.querySelectorAll(".cell").forEach(cell => {
      cell.classList.remove("active");
      bitcoinAddressElem.textContent = "N/A";
      foundHexElem.textContent = "N/A";
  });
  updateHexString();
});

// Function to start holding increment or decrement
function startHold(amount) {
  holdInterval = setInterval(() => adjustHexValue(amount), 0.1);
}

// Function to stop holding increment or decrement
function stopHold() {
  clearInterval(holdInterval);
}

document.getElementById("prev-btn").addEventListener("mousedown", () => startHold(-1));
document.getElementById("prev-btn").addEventListener("mouseup", stopHold);
document.getElementById("prev-btn").addEventListener("mouseleave", stopHold);

document.getElementById("next-btn").addEventListener("mousedown", () => startHold(1));
document.getElementById("next-btn").addEventListener("mouseup", stopHold);
document.getElementById("next-btn").addEventListener("mouseleave", stopHold);

// Initialize grid
createGrid();
