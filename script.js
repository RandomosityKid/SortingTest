// Global array to store employees
let employees = [];
let unsortedEmployees = [];

// Function to read names from a text file
async function readNamesFromFile(fileName) {
    const response = await fetch(fileName);
    const text = await response.text();
    return text.split("\n").filter(name => name.trim() !== "");
}

// Function to generate random employee data
async function generateRandomEmployee() {
    const firstNames = await readNamesFromFile("firstNames.txt");
    const lastNames = await readNamesFromFile("lastNames.txt");
    const sexes = ["Male", "Female"];
    const yearsWorked = Math.floor(Math.random() * 20) + 1;
    console.log(`${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`);
    return {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        age: Math.floor(Math.random() * 30) + 20,
        salary: Math.floor(Math.random() * 100000) + 30000,
        sex: sexes[Math.floor(Math.random() * sexes.length)],
        yearsWorked: yearsWorked
    };
}

// Function to generate employees based on user input
async function generateEmployees() {
    const numOfEmployees = parseInt(document.getElementById("numOfEmployees").value);

    if (isNaN(numOfEmployees) || numOfEmployees <= 0) {
        alert("Please enter a valid number of employees.");
        return;
    }

    employees = [];
    for (let i = 0; i < numOfEmployees; i++) {
        employees.push(await generateRandomEmployee());
    }

    unsortedEmployees = [...employees]; // Copy the employees array to unsortedEmployees
    displayUnsortedEmployees();
    displayEmployees();
}

// Function to display employees in the list
function displayEmployees() {
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    employees.forEach(employee => {
        const listItem = document.createElement("li");
        listItem.textContent = `Name: ${employee.name}, Age: ${employee.age}, Salary: $${employee.salary}, Sex: ${employee.sex}, Years Worked: ${employee.yearsWorked}`;
        employeeList.appendChild(listItem);
    });
}

// Function to display unsorted employees
function displayUnsortedEmployees() {
    const unsortedEmployeeList = document.getElementById("unsortedEmployeeList");
    unsortedEmployeeList.innerHTML = "";

    unsortedEmployees.forEach(employee => {
        const listItem = document.createElement("li");
        listItem.textContent = `Name: ${employee.name}, Age: ${employee.age}, Salary: $${employee.salary}, Sex: ${employee.sex}, Years Worked: ${employee.yearsWorked}`;
        unsortedEmployeeList.appendChild(listItem);
    });
}

// Function to filter employees based on search input
function filterEmployees() {
    const searchInput = document.getElementById("search").value.toLowerCase();

    const filteredEmployees = employees.filter(employee => {
        const nameMatch = employee.name.toLowerCase().includes(searchInput);
        const ageMatch = employee.age.toString().includes(searchInput);
        const salaryMatch = employee.salary.toString().includes(searchInput);
        const sexMatch = employee.sex.toLowerCase().includes(searchInput);
        const yearsWorkedMatch = employee.yearsWorked.toString().includes(searchInput);
        return nameMatch || ageMatch || salaryMatch || sexMatch || yearsWorkedMatch;
    });

    displayFilteredEmployees(filteredEmployees);
}

// Function to display filtered employees
function displayFilteredEmployees(filteredEmployees) {
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    filteredEmployees.forEach(employee => {
        const listItem = document.createElement("li");
        listItem.textContent = `Name: ${employee.name}, Age: ${employee.age}, Salary: $${employee.salary}, Sex: ${employee.sex}, Years Worked: ${employee.yearsWorked}`;
        employeeList.appendChild(listItem);
    });
}

// Function to clear the employee list
function clearEmployeeList() {
    employees = [];
    unsortedEmployees = [];
    displayEmployees();
    displayUnsortedEmployees();
    document.getElementById("sortingTime").textContent = "Sorting Time: N/A";
}

// Function to add event listeners to buttons
function addEventListeners() {
    const generateButton = document.getElementById("generateButton");
    const searchInput = document.getElementById("search");
    const clearButton = document.getElementById("clearButton");
    const sortButton = document.getElementById("sortButton");

    if (generateButton && searchInput && clearButton && sortButton) {
        generateButton.addEventListener("click", generateEmployees);
        searchInput.addEventListener("input", filterEmployees);
        clearButton.addEventListener("click", clearEmployeeList);
        sortButton.addEventListener("click", sortEmployees);
    } else {
        console.error("One or more elements not found in the DOM.");
    }
}

// Function to initialize the webpage
function init() {
    addEventListeners();
}

// Call the init function when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    init();
});

// Sorting algorithms
function bubbleSort(arr) {
    // Implement Bubble Sort algorithm
}

function insertionSort(arr) {
    // Implement Insertion Sort algorithm
}

// Quick Sort implementation
function quickSort(arr) {
    // Implement Quick Sort algorithm
}

// Function to sort employees based on the selected algorithm
async function sortEmployees() {
    const algorithm = document.getElementById("sortAlgorithm").value;
    const startTime = performance.now();

    if (algorithm === "bubble") {
        bubbleSort(employees);
    } else if (algorithm === "insertion") {
        insertionSort(employees);
    } else if (algorithm === "quick") {
        await quickSort(employees);
    }

    const endTime = performance.now();
    const sortingTime = endTime - startTime;
    document.getElementById("sortingTime").textContent = `Sorting Time: ${sortingTime.toFixed(2)} milliseconds`;

    displayEmployees();
}