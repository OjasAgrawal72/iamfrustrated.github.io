document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');
    let carData = [];
    let currentIndex = -1;

    // Load car data from CSV
    Papa.parse('cars.csv', {
        download: true,
        header: true,
        complete: function(results) {
            carData = results.data.filter(car => car.car_name);
            console.log('Loaded car data:', carData);
        },
        error: function(error) {
            console.error('Error loading CSV:', error);
            showErrorInSuggestions();
        }
    });

    // Handle search input
    searchInput.addEventListener('input', handleSearchInput);

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', handleKeyNavigation);

    // Close suggestions when clicking outside
    document.addEventListener('click', handleClickOutside);

    function handleSearchInput() {
        const query = searchInput.value.trim().toLowerCase();
        suggestions.innerHTML = '';
        currentIndex = -1;
        
        if (query.length < 2) {
            hideSuggestions();
            return;
        }

        if (!carData.length) {
            showErrorInSuggestions();
            return;
        }

        const filteredCars = carData.filter(car => 
            car.car_name.toLowerCase().includes(query))
            .slice(0, 5);

        if (filteredCars.length) {
            showSuggestions(filteredCars, query);
        } else {
            showNoResults();
        }
    }

    function showSuggestions(cars, query) {
        cars.forEach(car => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = highlightMatch(car.car_name, query);
            div.addEventListener('click', () => selectCar(car));
            suggestions.appendChild(div);
        });
        suggestions.classList.add('show');
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    function selectCar(car) {
        try {
            sessionStorage.setItem('selectedCar', JSON.stringify(car));
            window.location.href = `car.html?car=${encodeURIComponent(car.car_name)}`;
        } catch (error) {
            console.error('Error navigating to car page:', error);
        }
    }

    function handleKeyNavigation(e) {
        const items = suggestions.querySelectorAll('.suggestion-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % items.length;
            highlightItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            highlightItem(items);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            items[currentIndex].click();
        }
    }

    function highlightItem(items) {
        items.forEach((item, i) => {
            item.classList.toggle('highlighted', i === currentIndex);
        });
        if (currentIndex >= 0) {
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    function handleClickOutside(e) {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            hideSuggestions();
        }
    }

    function showNoResults() {
        suggestions.innerHTML = '<div class="no-results">No results found</div>';
        suggestions.classList.add('show');
    }

    function showErrorInSuggestions() {
        suggestions.innerHTML = '<div class="no-results">Error loading car data</div>';
        suggestions.classList.add('show');
    }

    function hideSuggestions() {
        suggestions.classList.remove('show');
    }
});