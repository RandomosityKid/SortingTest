// Global array to store employees
let employees = [];
let currentCurrency = "USD";
let firstNames = [];
let lastNames = [];

// Add event listener to the "Generate Employees" button
const generateButton = document.getElementById("generateButton");
if (generateButton) {
	generateButton.addEventListener("click", generateEmployees);
} else {
	console.error("Element with id 'generateButton' not found.");
}

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
		age: Math.floor(Math.random() * 13) + 18,
		salary: Math.floor(Math.random() * 350) + 100,
		sex: randomElement(["Male", "Female"]),
		yearsWorked: Math.floor(Math.random() * 11 + 1)
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

// Define the conversion rates object outside the functions
const conversionRates = {
	USD: 1,
	PHP: 55.18,
	GBP: 0.8,
};

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
		html += `<td class = "right-aligned">${formatSalary(employee.salary)}</td>`;
		html += `<td>${employee.sex}</td>`;
		html += `<td>${employee.yearsWorked}</td>`;
		html += "</tr>";
	});

	tableBody.innerHTML = html;
}

// Function to remove commas and special characters and convert to a number
function parseSalary(salaryString) {
	return typeof salaryString === 'string' ? parseFloat(salaryString.replace(/[^0-9.-]+/g, "")) : salaryString;
  }

// Function to format salary to the specified currency with proper commas
function formatSalary(salary) {
	const currencySymbol = getCurrencySymbol();
	
	// Convert to fixed 2 decimals if it's a whole number
	const formattedNumber = Number.isInteger(salary) ? salary.toFixed(2) : salary.toString();

	// Add commas to the number ///\B: boundary assertion   (?=(\d{3})+(?!\d)): positive lookahead assertion	/g: global flag for regular expression
	const numberWithCommas = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Concatenate currency symbol and return
	return `${currencySymbol}${numberWithCommas}`;
}

// Function to get the currency symbol based on the currency code
function getCurrencySymbol() {
	switch (currentCurrency) {
		case "PHP":
			return "₱";
		case "GBP":
			return "£";
		case "USD":
		default:
			return "$";
	}
}
