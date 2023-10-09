import { formatSalary, parseSalary, conversionRates } from "./salary.js";

// Global array to store employees
let employees = [];
let currentCurrency = "USD";
let firstNames = [];
let lastNames = [];

/* #region  Event listeners/handlers */

// Add event listener to a common parent element to handle click events for all buttons
document.addEventListener("click", function (event) {
	const clickedButton = event.target;

	// Check if the clicked element is a button
	if (clickedButton.tagName === "BUTTON") {
		if (clickedButton.classList.contains("action-button")) {
			const buttonId = clickedButton.id;
			handleActionButtonClick(buttonId);
		} else if (clickedButton.classList.contains("currency-button")) {
			const currency = clickedButton.getAttribute("data-currency");
			changeSalaryCurrency(currency);
		}
	}
});

document.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		const numOfEmployeesInput = document.getElementById("numOfEmployees");
		if (numOfEmployeesInput) {
			generateEmployees();
		}
	}
});

function handleActionButtonClick(buttonId) {
	switch (buttonId) {
		case "generateButton":
			generateEmployees();
			break;
		case "clearButton":
			clearEmployees();
			break;
		case "sortButton":
			sortEmployees();
			break;
		default:
			break;
	}
}
/* #endregion */

/* #region  File readers */
// Load names from fields when page loads
Promise.all([
	readNamesFromFile("firstNames.txt"),
	readNamesFromFile("lastNames.txt"),
])
	.then(([loadedFirstNames, loadedLastNames]) => {
		firstNames = loadedFirstNames;
		lastNames = loadedLastNames;
	})
	.catch((error) => console.error("Error loading names:", error));

// Function to read names from a text file
function readNamesFromFile(fileName) {
	return fetch(fileName)
		.then((response) => response.text())
		.then((text) => text.split("\n").filter((name) => name.trim() !== ""));
}
/* #endregion */

// Function to generate employees when the button is clicked
function generateEmployees() {
	const numOfEmployees = parseInt(document.getElementById("numOfEmployees").value);
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
		yearsWorked: Math.floor(Math.random() * 9 + 1),
	};

	employees.push(newEmployee);
}

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Function to display employees in the table
function displayEmployees() {
	const tableBody = document.getElementById("employeeListBody");
	let html = "";

	employees.forEach((employee) => {
		html += "<tr>";
		html += `<td>${employee.name}</td>`;
		html += `<td>${employee.age}</td>`;
		html += `<td class = "right-aligned">${formatSalary(
			employee.salary,
			currentCurrency
		)}</td>`;
		html += `<td>${employee.sex}</td>`;
		html += `<td>${employee.yearsWorked}</td>`;
		html += "</tr>";
	});

	tableBody.innerHTML = html;
}

function changeSalaryCurrency(currency) {
	// Nothing runs if choosing the same currency
	if (currency !== currentCurrency) {
		employees.forEach((employee) => {
			// Revert to numbers
			employee.salary = parseSalary(employee.salary);
			console.log(`Before: ${employee.salary}`);

			// Direct conversion to new currency
			employee.salary = ((employee.salary / conversionRates[currentCurrency]) * conversionRates[currency]).toFixed(2);
			console.log(`After: ${employee.salary}`);
		});

		// Change the currency
		currentCurrency = currency;
		displayEmployees();
	}
}

function clearEmployees() {
	employees = [];
	currentCurrency = "USD";
	displayEmployees();
}