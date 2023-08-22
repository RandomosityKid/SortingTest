// Define the conversion rates object outside the functions
const conversionRates = {
	USD: 1,
	PHP: 55.18,
	GBP: 0.8,
};

// Function to remove commas and special characters and convert to a number
function parseSalary(salaryString) {
	return typeof salaryString === 'string' ? parseFloat(salaryString.replace(/[^0-9.-]+/g, "")) : salaryString;
}

// Function to format salary to the specified currency with proper commas
function formatSalary(salary, currentCurrency) {
	const currencySymbol = getCurrencySymbol(currentCurrency);
	
	// Convert to fixed 2 decimals if it's a whole number
	const formattedNumber = Number.isInteger(salary) ? salary.toFixed(2) : salary.toString();

	// Add commas to the number ///\B: boundary assertion   (?=(\d{3})+(?!\d)): positive lookahead assertion	/g: global flag for regular expression
	const numberWithCommas = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Concatenate currency symbol and return
	return `${currencySymbol}${numberWithCommas}`;
}

// Function to get the currency symbol based on the currency code
function getCurrencySymbol(currentCurrency) {
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

export{
	conversionRates,
	formatSalary,
	parseSalary
};