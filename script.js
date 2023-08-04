// Global array to store employees
let employees = [];
let currentCurrency = "USD";

// Add event listener to the "Generate Employees" button
const generateButton = document.getElementById("generateButton");
if (generateButton) {
  generateButton.addEventListener("click", generateEmployees);
} else {
  console.error("Element with id 'generateButton' not found.");
}

// Function to generate employees when the button is clicked
function generateEmployees() {
  const numOfEmployees = parseInt(
    document.getElementById("numOfEmployees").value
  );
  console.log("Num of Employees:", numOfEmployees); // Debugging line

  if (isNaN(numOfEmployees) || numOfEmployees <= 0) {
    alert("Please enter a valid number of employees.");
    return;
  }

  for (let i = 0; i < numOfEmployees; i++) {
    generateRandomEmployee();
  }
}

function generateRandomEmployee() {
  Promise.all([
    readNamesFromFile("firstNames.txt"),
    readNamesFromFile("lastNames.txt"),
  ])
    .then(([firstNames, lastNames]) => {
      const sexes = ["Male", "Female"];
      const yearsWorked = Math.floor(Math.random() * 20) + 1;

      const newEmployee = {
        name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        age: Math.floor(Math.random() * 30) + 20,
        salary: Math.floor(Math.random() * 50000) + 30000,
        sex: randomElement(sexes),
        yearsWorked,
      };

      employees.push(newEmployee);
      displayEmployees();
    })
    .catch((error) => console.error("Error generating employee:", error));
}

// Function to read names from a text file
function readNamesFromFile(fileName) {
  return fetch(fileName)
    .then((response) => response.text())
    .then((text) => text.split("\n").filter((name) => name.trim() !== ""));
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to display employees in the table
function displayEmployees() {
  const tableBody = document.getElementById("employeeListBody");
  let html = "";

  employees.forEach((employee) => {
    html += "<tr>";
    html += `<td>${employee.name}</td>`;
    html += `<td>${employee.age}</td>`;
    html += `<td>${formatSalary(employee.salary, currentCurrency)}</td>`;
    html += `<td>${employee.sex}</td>`;
    html += `<td>${employee.yearsWorked}</td>`;
    html += "</tr>";
  });

  tableBody.innerHTML = html;
}

// Function to format salary to USD with proper commas
function formatSalary(salary, currency) {
  const conversionRates = {
    USD: 1,
    PHP: 55.18,
    GBP: 0.8,
  };

  if (currency in conversionRates) {
    const convertedSalary = convertSalaryToCurrency(
      salary,
      "USD",
      currency
    );
    const currencySymbol = getCurrencySymbol(currency);

    // Check if the converted salary has a non-zero fractional part
    const hasFractionalPart = convertedSalary % 1 !== 0;
    const formattedSalary = hasFractionalPart
      ? convertedSalary.toFixed(2)
      : convertedSalary.toLocaleString();

    return `${currencySymbol}${formattedSalary}`;
  } else {
    console.error("Unsupported currency:", currency);
    return `${getCurrencySymbol("USD")}${salary.toLocaleString()}`;
  }
}

// Function to convert salary from one currency to another
function convertSalaryToCurrency(salary, fromCurrency, toCurrency) {
  const conversionRates = {
    USD: 1,
    PHP: 55.18,
    GBP: 0.8,
  };

  if (fromCurrency === toCurrency) {
    return salary; // If the currencies are the same, no conversion needed
  }

  if (fromCurrency in conversionRates && toCurrency in conversionRates) {
    // Perform the conversion
    const convertedSalary =
      (salary / conversionRates[fromCurrency]) * conversionRates[toCurrency];
    return convertedSalary;
  } else {
    // If either fromCurrency or toCurrency is not supported, return the original salary
    console.error("Unsupported currency:", fromCurrency, toCurrency);
    return salary;
  }
}

// Function to get the currency symbol based on the currency code
function getCurrencySymbol(currency) {
  const currencySymbols = {
    USD: "$",
    GBP: "£",
    PHP: "₱",
  };

  return currencySymbols[currency] || "";
}

// Function to change the displayed salary currency
function changeSalaryCurrency(currency) {
  currentCurrency = currency;
  displayEmployees();
}
