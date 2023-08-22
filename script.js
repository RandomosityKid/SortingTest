import { formatSalary, parseSalary, conversionRates } from "./salary.js";

// Global array to store employees
let employees = [];
let currentCurrency = "USD";
let firstNames = [];
let lastNames = [];

// Add event listener to the "Generate Employees" button
const numOfEmployeesInput = document.getElementById("numOfEmployees");
if (numOfEmployeesInput) {
	numOfEmployeesInput.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			generateEmployees();
		}
	});
}

// Add event listener to the "Generate Employees" button
const generateButton = document.getElementById("generateButton");
if (generateButton) {
	generateButton.addEventListener("click", generateEmployees);
}

// Add event listener to the parent element to handle click events for all buttons
const currencyButtons = document.querySelectorAll(".currency-button");
currencyButtons.forEach(button => {
  button.addEventListener("click", function () {
    const currency = this.getAttribute("data-currency");
    changeSalaryCurrency(currency);
  });
});

// Load names from fiels when page loads
Promise.all([
	readNamesFromFile("firstNames.txt"),
	readNamesFromFile("lastNames.txt")
])
.then(([loadedFirstNames, loadedLastNames]) => {
	firstNames = loadedFirstNames;
	lastNames = loadedLastNames;
})
.catch((error) => console.error("Error loading names:", error));

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

	employees = [];
	currentCurrency = "USD";
	for (let i = 0; i < numOfEmployees; i++) {
		generateRandomEmployee();
	}

	displayEmployees();
}

function generateRandomEmployee() {
	if (firstNames === 0 || lastNames === 0) {
		console.error("Names not loaded yet");
		return;
	}

	const newEmployee = {
		name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
		age: Math.floor(Math.random() * 12) + 18,
		salary: Math.floor(Math.random() * 700) + 180,
		sex: randomElement(["Male", "Female"]),
		yearsWorked: Math.floor(Math.random() * 9 + 1)
	};

	employees.push(newEmployee);
}

// Function to read names from a text file
function readNamesFromFile(fileName) {
	return fetch(fileName)
		.then((response) => response.text())
		.then((text) => text.split("\n").filter((name) => name.trim() !== ""));
}

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Function to change the displayed salary currency //onlick when you press button
function changeSalaryCurrency(currency) {
	// Nothing runs if choosing the same currency
	if (currency !== currentCurrency) {
		//Loop through all employees
		employees.forEach((employee) => {
			// Revert to numbers
			employee.salary = parseSalary(employee.salary);
			console.log(`Before: ${employee.salary}`);

			// Direct conversion to new currency
			employee.salary = (employee.salary / conversionRates[currentCurrency] * conversionRates[currency]).toFixed(2);
			console.log(`After: ${employee.salary}`);
		});

		// Change the currency
		currentCurrency = currency;
		displayEmployees();
	}
}

// Function to display employees in the table
function displayEmployees() {
	const tableBody = document.getElementById("employeeListBody");
	let html = "";

	employees.forEach((employee) => {
		html += "<tr>";
		html += `<td>${employee.name}</td>`;
		html += `<td>${employee.age}</td>`;
		html += `<td class = "right-aligned">${formatSalary(employee.salary, currentCurrency)}</td>`;
		html += `<td>${employee.sex}</td>`;
		html += `<td>${employee.yearsWorked}</td>`;
		html += "</tr>";
	});

	tableBody.innerHTML = html;
}
