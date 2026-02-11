// Blood Bank Handler
// Manages searching and displaying blood bank details

// Fallback Data: Major Government Blood Banks in Tamil Nadu
const BLOOD_BANKS_DATA = [
    {
        name: "Rajiv Gandhi Government General Hospital",
        district: "Chennai",
        contact: "044-25305000",
        address: "Poonamallee High Road, Park Town, Chennai",
        type: "Government"
    },
    {
        name: "Government Rajaji Hospital",
        district: "Madurai",
        contact: "0452-2532535",
        address: "Panagal Road, Madurai",
        type: "Government"
    },
    {
        name: "Coimbatore Medical College Hospital",
        district: "Coimbatore",
        contact: "0422-2301393",
        address: "Avinashi Road, Coimbatore",
        type: "Government"
    },
    {
        name: "Kanyakumari Government Medical College",
        district: "Kanyakumari",
        contact: "04652-223200",
        address: "Asaripallam, Nagercoil",
        type: "Government"
    },
    {
        name: "Thanjavur Medical College Hospital",
        district: "Thanjavur",
        contact: "04362-240024",
        address: "Medical College Road, Thanjavur",
        type: "Government"
    },
    {
        name: "Tirunelveli Medical College Hospital",
        district: "Tirunelveli",
        contact: "0462-2572733",
        address: "High Ground, Palayamkottai, Tirunelveli",
        type: "Government"
    },
    {
        name: "Government Vellore Medical College",
        district: "Vellore",
        contact: "0416-2260900",
        address: "Adukkamparai, Vellore",
        type: "Government"
    },
    {
        name: "Government Stanley Medical College",
        district: "Chennai",
        contact: "044-28144801",
        address: "Stanley Medical College, Chennai",
        type: "NGO"
    },
    {
        name: "Apollo Hospitals Blood Bank",
        district: "Chennai",
        contact: "044-28290000",
        address: "21, Greams Road, Chennai",
        type: "Private"
    },
    {
        name: "Fortis Malar Hospital Blood Bank",
        district: "Chennai",
        contact: "044-49000000",
        address: "52, Greams Road, Chennai",
        type: "Private"
    },
    {
        name: "Sri Ramachandra Medical College Blood Bank",
        district: "Chennai",
        contact: "044-30612222",
        address: "No.1, Ramachandra Nagar, Chennai",
        type: "Private"
    }

];

document.addEventListener('DOMContentLoaded', function() {
    const bankDistrictSelect = document.getElementById('bankDistrict');
    const searchBanksBtn = document.getElementById('searchBanksBtn');

    // Initialize District Dropdown
    if (bankDistrictSelect) {
        if (typeof populateDistricts === 'function') {
            populateDistricts(bankDistrictSelect);
        }
    }

    // Search Button Event
    if (searchBanksBtn) {
        searchBanksBtn.addEventListener('click', searchBloodBanks);
    }
    
    // Load all banks initially
    displayBanks(BLOOD_BANKS_DATA);
});

async function searchBloodBanks() {
    const district = document.getElementById('bankDistrict').value;
    const bankList = document.getElementById('bankList');
    
    bankList.innerHTML = '<div class="loading">Searching...</div>';

    // 1. Try fetching from Backend API (if implemented)
    // const result = await apiClient.request('getBloodBanks', 'GET');
    
    // 2. Fallback to Local Data
    let filteredBanks = BLOOD_BANKS_DATA;
    
    if (district) {
        filteredBanks = BLOOD_BANKS_DATA.filter(bank => bank.district === district);
    }

    displayBanks(filteredBanks);
}

function displayBanks(banks) {
    const bankList = document.getElementById('bankList');
    bankList.innerHTML = '';

    if (banks.length === 0) {
        bankList.innerHTML = `<p class="no-results">${t('noBanksFound') || 'No blood banks found in this area.'}</p>`;
        return;
    }

    banks.forEach(bank => {
        const li = document.createElement('li');
        li.className = 'request-item'; // Reusing existing card style
        li.innerHTML = `
            <div class="request-info">
                <h4>🏥 ${bank.name}</h4>
                <p><strong>${t('district')}:</strong> ${bank.district}</p>
                <p><strong>${t('address')}:</strong> ${bank.address}</p>
                <p><strong>${t('contact')}:</strong> <a href="tel:${bank.contact}">${bank.contact}</a></p>
                <span class="urgent-badge" style="background-color: #28a745;">${bank.type}</span>
            </div>
        `;
        bankList.appendChild(li);
    });
}