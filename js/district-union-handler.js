// District-Union Cascading Dropdown Handler
// Manages the hierarchical district-union selection

function initDistrictUnionDropdowns() {
    const districtSelect = document.getElementById('district');
    const unionSelect = document.getElementById('union');
    const searchDistrictSelect = document.getElementById('searchDistrict');
    const searchUnionSelect = document.getElementById('searchUnion');
    const requestDistrictSelect = document.getElementById('requestDistrict');
    const requestUnionSelect = document.getElementById('requestUnion');
    const bankDistrictSelect = document.getElementById('bankDistrict');
    const bankUnionSelect = document.getElementById('bankUnion');

    // Initialize all district dropdowns
    populateDistricts(districtSelect);
    populateDistricts(searchDistrictSelect);
    populateDistricts(requestDistrictSelect);
    populateDistricts(bankDistrictSelect);

    // Handle district change for registration
    if (districtSelect && unionSelect) {
        districtSelect.addEventListener('change', function () {
            populateUnions(unionSelect, this.value);
        });
    }

    // Handle district change for search
    if (searchDistrictSelect && searchUnionSelect) {
        searchDistrictSelect.addEventListener('change', function () {
            populateUnions(searchUnionSelect, this.value);
        });
    }

    // Handle district change for request form
    if (requestDistrictSelect && requestUnionSelect) {
        requestDistrictSelect.addEventListener('change', function () {
            populateUnions(requestUnionSelect, this.value);
        });
    }

    // Handle district change for bank form (Admin)
    if (bankDistrictSelect && bankUnionSelect) {
        bankDistrictSelect.addEventListener('change', function () {
            populateUnions(bankUnionSelect, this.value);
        });
    }
}

// Populate districts dropdown with Tamil translation support
function populateDistricts(selectElement) {
    if (!selectElement) return;

    // Clear existing options except the first one
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = '';
    if (firstOption) {
        selectElement.appendChild(firstOption);
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = t('searchDistrict') || 'Select District';
        selectElement.appendChild(defaultOption);
    }

    // Get current language
    const currentLang = localStorage.getItem('language') || 'en';

    // Add districts with translation
    const districts = Object.keys(TAMIL_NADU_DISTRICTS).sort();
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;

        // Show Tamil translation if Tamil is selected and translation exists
        if (currentLang === 'ta' && typeof getTamilTranslation === 'function') {
            const tamilName = getTamilTranslation(district, 'district');
            option.textContent = tamilName !== district ? `${tamilName} (${district})` : district;
        } else {
            option.textContent = district;
        }

        selectElement.appendChild(option);
    });
}

// Populate unions dropdown based on selected district with Tamil translation
function populateUnions(selectElement, district) {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = t('searchUnion') || 'Select Union';
    selectElement.appendChild(defaultOption);

    if (!district || !TAMIL_NADU_DISTRICTS[district]) {
        return;
    }

    // Get current language
    const currentLang = localStorage.getItem('language') || 'en';

    // Add unions for selected district with translation
    const unions = TAMIL_NADU_DISTRICTS[district].sort();
    unions.forEach(union => {
        const option = document.createElement('option');
        option.value = union;

        // Show Tamil translation if Tamil is selected and translation exists
        if (currentLang === 'ta' && typeof getTamilTranslation === 'function') {
            const tamilName = getTamilTranslation(union, 'union');
            option.textContent = tamilName !== union ? `${tamilName} (${union})` : union;
        } else {
            option.textContent = union;
        }

        selectElement.appendChild(option);
    });
}

// Refresh dropdowns when language changes
function refreshDistrictUnionDropdowns() {
    const districtSelect = document.getElementById('district');
    const unionSelect = document.getElementById('union');
    const searchDistrictSelect = document.getElementById('searchDistrict');
    const searchUnionSelect = document.getElementById('searchUnion');
    const requestDistrictSelect = document.getElementById('requestDistrict');
    const requestUnionSelect = document.getElementById('requestUnion');

    // Refresh all district dropdowns
    if (districtSelect) {
        const selectedValue = districtSelect.value;
        populateDistricts(districtSelect);
        if (selectedValue) {
            districtSelect.value = selectedValue;
            if (unionSelect) {
                populateUnions(unionSelect, selectedValue);
            }
        }
    }

    if (searchDistrictSelect) {
        const selectedValue = searchDistrictSelect.value;
        populateDistricts(searchDistrictSelect);
        if (selectedValue) {
            searchDistrictSelect.value = selectedValue;
            if (searchUnionSelect) {
                populateUnions(searchUnionSelect, selectedValue);
            }
        }
    }

    if (requestDistrictSelect) {
        const selectedValue = requestDistrictSelect.value;
        populateDistricts(requestDistrictSelect);
        if (selectedValue) {
            requestDistrictSelect.value = selectedValue;
            if (requestUnionSelect) {
                populateUnions(requestUnionSelect, selectedValue);
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDistrictUnionDropdowns);
} else {
    initDistrictUnionDropdowns();
}
