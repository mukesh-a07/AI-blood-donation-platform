// API Client for Google Apps Script Backend
// Handles all communication with the backend API

const API_CONFIG = {
    // PASTE YOUR NEW GOOGLE APPS SCRIPT WEB APP URL BELOW:
    BASE_URL: 'https://script.google.com/macros/s/AKfycbw-5PrHjCJrR1wpJQ2YBAHpSCqlpKxW9roBwiDQwlhLQHDuKzBCh6wmRaWrMNBCvxJN/exec',
    USE_LOCAL_STORAGE: false // Set to true to test without the backend (Fixed CORS issue)
};

// API Client Class
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.useLocalStorage = API_CONFIG.USE_LOCAL_STORAGE || !this.baseURL || this.baseURL.includes('YOUR_');
    }

    // Generic request handler
    async request(endpoint, method = 'GET', data = null) {
        if (this.useLocalStorage) {
            return this.handleLocalStorageRequest(endpoint, method, data);
        }

        let url;
        let options;

        // Ensure endpoint doesn't start with /
        if (endpoint.startsWith('/')) {
            endpoint = endpoint.substring(1);
        }

        if (method === 'GET') {
            url = `${this.baseURL}?action=${endpoint}`;
            options = {
                method: 'GET',
                // Important: Google Apps Script requires no headers for GET to avoid CORS preflight, 
                // AND 'redirect: follow' is default but good to be explicit.
                redirect: 'follow',
                mode: 'cors', // Explicitly use cors mode
                credentials: 'omit' // Omit credentials
            };
        } else {
            url = this.baseURL;
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({
                    action: endpoint,
                    ...data
                }),
                mode: 'cors', // Explicitly use cors mode
                credentials: 'omit' // Omit credentials
            };
        }

        try {
            const response = await fetch(url, options);

            // Log raw response for debugging
            const text = await response.text();

            try {
                const json = JSON.parse(text);
                return json;
            } catch (e) {
                console.error("API Error: Response was not JSON", text.substring(0, 500));
                // Throwing specific error for HTML responses (usually Google Auth redirect)
                if (text.includes("<!DOCTYPE html>") || text.includes("Google Accounts")) {
                    throw new Error("CORS/Auth Error: Script is not accessible. Check deployment settings to be 'Anyone'.");
                }
                throw new Error("Invalid JSON response from server");
            }
        } catch (error) {
            console.error("API Error:", error);
            return { success: false, error: error.message };
        }
    }

    // LocalStorage fallback handler
    handleLocalStorageRequest(endpoint, method, data) {
        switch (endpoint) {
            case 'registerDonor':
                return this.registerDonorLocal(data);
            case 'searchDonors':
                return this.searchDonorsLocal(data);
            case 'getDonors':
                return this.getAllDonorsLocal();
            case 'addEmergencyRequest':
                return this.addEmergencyRequestLocal(data);
            case 'getRequests':
                return this.getAllRequestsLocal();
            case 'deleteRequest':
                return this.deleteRequestLocal(data);
            case 'getStats':
                return this.getStatisticsLocal();
            case 'initiateContactView':
                return this.initiateContactViewLocal(data);
            case 'verifyContactOTP':
                return this.verifyContactOTPLocal(data);
            default:
                return { success: false, error: 'Unknown endpoint' };
        }
    }

    // Register donor
    async registerDonor(donorData) {
        return await this.request('registerDonor', 'POST', {
            action: 'registerDonor',
            ...donorData
        });
    }

    registerDonorLocal(donorData) {
        let donors = JSON.parse(localStorage.getItem('donors')) || [];

        // Check for duplicate email
        if (donors.some(d => d.email === donorData.email)) {
            return { success: false, error: 'Email already registered' };
        }

        const donor = {
            ...donorData,
            registrationDate: new Date().toISOString(),
            status: 'Active'
        };

        donors.push(donor);
        localStorage.setItem('donors', JSON.stringify(donors));

        return { success: true, message: 'Donor registered successfully (Local)' };
    }

    // Search donors
    async searchDonors(searchCriteria) {
        return await this.request('searchDonors', 'POST', {
            action: 'searchDonors',
            ...searchCriteria
        });
    }

    searchDonorsLocal(searchCriteria) {
        let donors = JSON.parse(localStorage.getItem('donors')) || [];

        let filtered = donors.filter(donor => {
            if (searchCriteria.bloodType && donor.bloodType !== searchCriteria.bloodType) return false;
            if (searchCriteria.district && donor.district !== searchCriteria.district) return false;
            if (searchCriteria.union && donor.union !== searchCriteria.union) return false;
            if (searchCriteria.status && donor.status !== searchCriteria.status) return false;
            return true;
        });

        // Mask Data for Local Storage too
        const masked = filtered.map((d, index) => ({
            ...d,
            contact: d.contact.substring(0, 2) + '******' + d.contact.substring(d.contact.length - 2),
            email: d.email.substring(0, 2) + '****@' + d.email.split('@')[1],
            donorId: index // Simple index as ID
        }));

        return { success: true, donors: masked, count: masked.length };
    }

    // Get all donors
    async getAllDonors() {
        return await this.request('getDonors', 'GET');
    }

    getAllDonorsLocal() {
        const donors = JSON.parse(localStorage.getItem('donors')) || [];
        return { success: true, donors: donors, count: donors.length };
    }

    // Add emergency request
    async addEmergencyRequest(requestData) {
        return await this.request('addEmergencyRequest', 'POST', {
            action: 'addEmergencyRequest',
            ...requestData
        });
    }

    addEmergencyRequestLocal(requestData) {
        let requests = JSON.parse(localStorage.getItem('requests')) || [];

        const request = {
            ...requestData,
            requestId: 'REQ' + Date.now(),
            status: 'Active',
            createdDate: new Date().toISOString()
        };

        requests.push(request);
        localStorage.setItem('requests', JSON.stringify(requests));

        return { success: true, requestId: request.requestId, message: 'Emergency request added successfully' };
    }

    // Get all emergency requests
    async getAllRequests() {
        return await this.request('getRequests', 'GET');
    }

    getAllRequestsLocal() {
        const requests = JSON.parse(localStorage.getItem('requests')) || [];
        const activeRequests = requests.filter(r => r.status === 'Active');
        return { success: true, requests: activeRequests, count: activeRequests.length };
    }

    // Delete emergency request
    async deleteRequest(requestId) {
        return await this.request('deleteRequest', 'POST', {
            action: 'deleteRequest',
            requestId: requestId
        });
    }

    deleteRequestLocal(data) {
        let requests = JSON.parse(localStorage.getItem('requests')) || [];
        const index = requests.findIndex(r => r.requestId === data.requestId);

        if (index !== -1) {
            requests[index].status = 'Deleted'; // Soft delete for consistency
            localStorage.setItem('requests', JSON.stringify(requests));
            return { success: true, message: 'Request deleted successfully (Local)' };
        }

        return { success: false, error: 'Request not found (Local)' };
    }

    // Get statistics
    async getStatistics() {
        return await this.request('getStats', 'GET');
    }

    // Get chatbot knowledge base
    async getChatbotKnowledge() {
        return await this.request('getChatbotKB', 'GET');
    }

    // Add Blood Bank (Admin)
    async addBloodBank(data) {
        return await this.request('addBloodBank', 'POST', {
            action: 'addBloodBank',
            ...data
        });
    }

    // Get Blood Banks
    async getBloodBanks(district = null) {
        let endpoint = 'getBloodBanks';
        if (district) {
            endpoint += `&district=${encodeURIComponent(district)}`;
        }
        return await this.request(endpoint, 'GET');
    }

    getStatisticsLocal() {
        const donors = JSON.parse(localStorage.getItem('donors')) || [];
        const requests = JSON.parse(localStorage.getItem('requests')) || [];
        const activeDonors = donors.filter(d => d.status === 'Active');
        const activeRequests = requests.filter(r => r.status === 'Active');

        return {
            success: true,
            stats: {
                totalDonors: donors.length,
                activeDonors: activeDonors.length,
                totalRequests: requests.length,
                activeRequests: activeRequests.length,
                livesSaved: activeDonors.length * 3
            }
        };
    }

    // Initiate Contact View (Step 1)
    async initiateContactView(data) {
        return await this.request('initiateContactView', 'POST', {
            action: 'initiateContactView',
            ...data
        });
    }

    initiateContactViewLocal(data) {
        // Mock Implementation
        console.log("Mock Initiate Contact View", data);
        const requestId = 'MOCK_REQ_' + Date.now();
        localStorage.setItem('active_otp_' + requestId, '123456'); // Fixed OTP for testing
        alert(`[Local Testing] OTP is 123456. Request ID: ${requestId}`);
        return { success: true, requestId: requestId, message: 'OTP sent (Local Mock: 123456)' };
    }

    // Verify OTP (Step 2)
    async verifyContactOTP(data) {
        return await this.request('verifyContactOTP', 'POST', {
            action: 'verifyContactOTP',
            ...data
        });
    }

    verifyContactOTPLocal(data) {
        const storedOTP = localStorage.getItem('active_otp_' + data.requestId);
        if (storedOTP && storedOTP === data.otp) {
            const donors = JSON.parse(localStorage.getItem('donors')) || [];
            const donor = donors[data.donorId]; // Use index
            if (donor) {
                return { success: true, donor: donor };
            }
        }
        return { success: false, error: 'Invalid OTP (Local)' };
    }
}

// Initialize API client
const apiClient = new APIClient();
