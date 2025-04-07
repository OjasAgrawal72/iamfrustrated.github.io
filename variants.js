// Get car name from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const carName = urlParams.get('car');

// Load car data from the CSV file
Papa.parse('car_variants.csv', {
    download: true,
    header: true,
    complete: function(results) {
        const carData = processCarData(results.data);
        const carDetails = carData[carName];
        displayCarDetails(carName, carDetails);
    }
});

// Function to process carData from CSV format to needed structure
function processCarData(csvData) {
    const carData = {};
    csvData.forEach(car => {
        const carName = car['car_name'];
        const variant = car['variant_name'];
        const price = car['price'];

        if (!carData[carName]) {
            carData[carName] = { basePrice: price, variants: [] };
        }

        carData[carName].variants.push({ name: variant, price: price });
    });

    return carData;
}

// Function to display car details
function displayCarDetails(carName, carDetails) {
    // Set the base price for the car
    document.getElementById('car-title').innerText = carName;
    document.getElementById('car-price').innerText = `Price: ${carDetails.basePrice}`;

    const variantList = document.getElementById('variant-list');
    
    // Skip the first variant (base price)
    carDetails.variants.slice(1).forEach(variant => {
        const variantButton = document.createElement('button');
        variantButton.innerText = variant.name;
        variantButton.onclick = () => updatePrice(variant.price);
        variantList.appendChild(variantButton);
    });
}

// Update price when a variant is selected
function updatePrice(price) {
    document.getElementById('car-price').innerText = `Price: ${price}`;
}