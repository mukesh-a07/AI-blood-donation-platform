// Main Application Script
// Integrates all features: API, Language, District-Union, Chatbot

// Admin Credentials
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

// Check if admin is logged in
let isAdmin = localStorage.getItem("isAdmin") === "true";

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeLanguage();
    initializeAdmin();
    initializeRegistration();
    initializeSearch();
    initializeRequests();
    initializeStatistics();
    // Chatbot initialized in chatbot.js
    checkAdminStatus();
});

// Language Initialization
function initializeLanguage() {
    const langEnBtn = document.getElementById('lang-en');
    const langTaBtn = document.getElementById('lang-ta');

    // 1. Check LocalStorage for saved preference
    const currentLang = localStorage.getItem('language') || 'en';
    setLanguage(currentLang); // Apply immediately

    // 2. Set Active Button State
    if (currentLang === 'ta') {
        if (langTaBtn) langTaBtn.classList.add('active');
        if (langEnBtn) langEnBtn.classList.remove('active');
    } else {
        if (langEnBtn) langEnBtn.classList.add('active');
        if (langTaBtn) langTaBtn.classList.remove('active');
    }

    // 3. Add Event Listeners with Persistence
    if (langEnBtn) {
        langEnBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('language', 'en'); // Save preference
            setLanguage('en');
            langEnBtn.classList.add('active');
            if (langTaBtn) langTaBtn.classList.remove('active');
        });
    }

    if (langTaBtn) {
        langTaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('language', 'ta'); // Save preference
            setLanguage('ta');
            langTaBtn.classList.add('active');
            if (langEnBtn) langEnBtn.classList.remove('active');
        });
    }
}

// Admin Functions
function initializeAdmin() {
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    const loginBtn = document.getElementById("loginBtn");

    adminLoginBtn?.addEventListener("click", () => {
        const loginSection = document.getElementById("loginSection");
        if (loginSection) {
            loginSection.classList.toggle("hidden");
        }
    });

    loginBtn?.addEventListener("click", () => {
        const username = document.getElementById("username")?.value;
        const password = document.getElementById("password")?.value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            isAdmin = true;
            localStorage.setItem("isAdmin", "true");
            document.getElementById("loginSection")?.classList.add("hidden");
            document.getElementById("adminControls")?.classList.remove("hidden");
            adminLoginBtn?.classList.add("hidden");
            adminLogoutBtn?.classList.remove("hidden");
            alert(t('loginSuccess') || "Admin logged in successfully!");
            checkAdminStatus();
        } else {
            alert(t('invalidCredentials') || "Invalid credentials");
        }
    });

    adminLogoutBtn?.addEventListener("click", () => {
        isAdmin = false;
        localStorage.removeItem("isAdmin");
        document.getElementById("adminControls")?.classList.add("hidden");
        adminLoginBtn?.classList.remove("hidden");
        adminLogoutBtn?.classList.add("hidden");
        alert("Admin logged out.");
        checkAdminStatus();
    });
}

function checkAdminStatus() {
    if (isAdmin) {
        document.getElementById("adminControls")?.classList.remove("hidden");
        document.getElementById("adminLoginBtn")?.classList.add("hidden");
        document.getElementById("adminLogoutBtn")?.classList.remove("hidden");
    } else {
        document.getElementById("adminControls")?.classList.add("hidden");
        document.getElementById("adminLoginBtn")?.classList.remove("hidden");
        document.getElementById("adminLogoutBtn")?.classList.add("hidden");
    }
}

// Registration Functions
function initializeRegistration() {
    const registerForm = document.getElementById("registerForm");
    const registerBtn = document.getElementById("registerBtn");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await registerDonor();
        });
    } else if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            await registerDonor();
        });
    }
}

async function registerDonor() {
    const name = document.getElementById("name")?.value;
    const contact = document.getElementById("contact")?.value;
    const email = document.getElementById("email")?.value;
    const bloodType = document.getElementById("bloodType")?.value;
    const gender = document.getElementById("gender")?.value;
    const age = document.getElementById("age")?.value;
    const weight = document.getElementById("weight")?.value;
    const district = document.getElementById("district")?.value;
    const union = document.getElementById("union")?.value;

    if (!name || !contact || !email || !bloodType || !district || !union) {
        alert(t('registerError') || "Please fill in all required fields.");
        return;
    }

    const donorData = {
        name,
        contact,
        email,
        bloodType,
        gender,
        age,
        weight,
        district,
        union
    };

    try {
        const result = await apiClient.registerDonor(donorData);
        if (result.success) {
            // Confirmation email is sent automatically by the backend
            alert(t('registerSuccess') || "Donor registered successfully! Confirmation email sent.");
            // Clear form
            const registerForm = document.getElementById("registerForm");
            if (registerForm) {
                registerForm.reset();
            }
            // Update statistics
            await updateStatistics();
        } else {
            alert(result.error || "Registration failed.");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration.");
    }
}

// Search Functions
function initializeSearch() {
    const searchBtn = document.getElementById("searchBtn");

    searchBtn?.addEventListener("click", async () => {
        await searchDonors();
    });
}

async function searchDonors() {
    const bloodType = document.getElementById("searchBloodType")?.value;
    const district = document.getElementById("searchDistrict")?.value;
    const union = document.getElementById("searchUnion")?.value;

    const searchCriteria = {
        bloodType: bloodType || null,
        district: district || null,
        union: union || null,
        status: 'Active'
    };

    try {
        const result = await apiClient.searchDonors(searchCriteria);
        const donorList = document.getElementById("donorList");
        const resultsCount = document.getElementById("resultsCount");

        if (!donorList) return;

        donorList.innerHTML = "";

        if (result.success && result.donors && result.donors.length > 0) {
            if (resultsCount) {
                resultsCount.textContent = `${result.count} ${t('donorsFound') || 'donors found'}`;
            }

            result.donors.forEach((donor) => {
                const li = document.createElement("li");
                li.className = "donor-item";
                li.innerHTML = `
                    <div class="donor-info">
                        <h4>${donor.name || donor.Name}</h4>
                        <p><strong>${t('bloodType')}:</strong> ${donor.bloodType || donor.BloodType}</p>
                        <p><strong>${t('contact')}:</strong> <span class="masked-data" id="contact-${donor.donorId || donor.DonorID}">${donor.contact || donor.Contact}</span></p>
                        <p><strong>${t('email')}:</strong> <span class="masked-data" id="email-${donor.donorId || donor.DonorID}">${donor.email || donor.Email}</span></p>
                        <p><strong>${t('district')}:</strong> ${donor.district || donor.District}</p>
                        <p><strong>${t('union')}:</strong> ${donor.union || donor.Union}</p>
                        ${donor.gender || donor.Gender ? `<p><strong>${t('gender')}:</strong> ${donor.gender || donor.Gender}</p>` : ''}
                        <button class="view-contact-btn" onclick="openVerificationModal('${donor.donorId || donor.DonorID}')">View Full Contact</button>
                    </div>
                `;
                donorList.appendChild(li);
            });

        } else {
            if (resultsCount) {
                resultsCount.textContent = t('noDonorsFound') || "No donors found.";
            }
            donorList.innerHTML = `<p class="no-results">${t('noDonorsFound') || "No donors found matching your criteria."}</p>`;
        }
    } catch (error) {
        console.error("Search error:", error);
        alert("An error occurred during search.");
    }
}

// Emergency Requests Functions
function initializeRequests() {
    const addRequestBtn = document.getElementById("addRequestBtn");

    addRequestBtn?.addEventListener("click", async () => {
        await addEmergencyRequest();
    });

    // Load and render requests
    loadAndRenderRequests();
}

async function loadAndRenderRequests() {
    try {
        const result = await apiClient.getAllRequests();
        renderRequests(result.requests || []);
    } catch (error) {
        console.error("Error loading requests:", error);
        // Fallback to localStorage
        const requests = JSON.parse(localStorage.getItem("requests")) || [];
        renderRequests(requests);
    }
}

function renderRequests(requests) {
    const requestList = document.getElementById("requestList");
    if (!requestList) return;

    requestList.innerHTML = "";

    if (requests.length === 0) {
        requestList.innerHTML = `<p class="no-results">${t('noRequests') || "No emergency requests at the moment."}</p>`;
        return;
    }

    requests.forEach((request, index) => {
        const li = document.createElement("li");
        li.className = "request-item";
        const urgentClass = request.urgent || request.Urgent ? "urgent" : "";
        li.innerHTML = `
            <div class="request-info ${urgentClass}">
                <h4>${t('requestBlood') || 'Blood Request'}: ${request.bloodType || request.BloodType}</h4>
                <p><strong>${t('hospital')}:</strong> ${request.hospital || request.Hospital}</p>
                <p><strong>${t('hospitalContact')}:</strong> <a href="tel:${request.contact || request.Contact}">${request.contact || request.Contact}</a></p>
                ${request.district || request.District ? `<p><strong>${t('district')}:</strong> ${request.district || request.District}</p>` : ''}
                ${request.union || request.Union ? `<p><strong>${t('union')}:</strong> ${request.union || request.Union}</p>` : ''}
                ${request.urgent || request.Urgent ? `<span class="urgent-badge">${t('urgent') || 'URGENT'}</span>` : ''}
            </div>
        `;

        // Only show delete if admin
        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = t('delete') || "Delete";
            deleteBtn.classList.add("delete-btn");

            const reqId = request.requestId || request.RequestID;
            deleteBtn.onclick = async () => {
                if (confirm(t('confirmDelete') || "Are you sure you want to delete this request?")) {
                    await deleteEmergencyRequest(reqId);
                }
            };

            li.appendChild(deleteBtn);
        }

        requestList.appendChild(li);
    });
}

async function addEmergencyRequest() {
    if (!isAdmin) return;

    const bloodType = document.getElementById("requestBloodType")?.value;
    const hospital = document.getElementById("requestHospital")?.value || document.getElementById("requestLocation")?.value;
    const contact = document.getElementById("requestContact")?.value;
    const district = document.getElementById("requestDistrict")?.value;
    const union = document.getElementById("requestUnion")?.value;

    if (!bloodType || !hospital || !contact) {
        alert(t('registerError') || "Please fill in all required fields.");
        return;
    }

    const requestData = {
        bloodType,
        hospital,
        contact,
        district: district || null,
        union: union || null,
        urgent: true
    };

    try {
        const result = await apiClient.addEmergencyRequest(requestData);
        if (result.success) {
            // Notifications are sent automatically by the backend
            alert("Emergency request added successfully! Matching donors have been notified via email.");

            // Clear form
            const requestBloodType = document.getElementById("requestBloodType");
            const requestHospital = document.getElementById("requestHospital");
            const requestLocation = document.getElementById("requestLocation");
            const requestContact = document.getElementById("requestContact");
            const requestDistrict = document.getElementById("requestDistrict");
            const requestUnion = document.getElementById("requestUnion");

            if (requestBloodType) requestBloodType.value = "";
            if (requestHospital) requestHospital.value = "";
            if (requestLocation) requestLocation.value = "";
            if (requestContact) requestContact.value = "";
            if (requestDistrict) requestDistrict.value = "";
            if (requestUnion) requestUnion.value = "";
            // Reload requests
            await loadAndRenderRequests();
        } else {
            alert(result.error || "Failed to add request.");
        }
    } catch (error) {
        console.error("Add request error:", error);
        alert("An error occurred while adding the request.");
    }
}

async function deleteEmergencyRequest(requestId) {
    if (!requestId) return;

    try {
        const result = await apiClient.deleteRequest(requestId);
        if (result.success) {
            alert(t('deleteSuccess') || "Request deleted successfully.");
            await loadAndRenderRequests();
            await updateStatistics();
        } else {
            alert(result.error || "Failed to delete request.");
        }
    } catch (error) {
        console.error("Delete request error:", error);
        alert("An error occurred while deleting the request.");
    }
}

// Statistics Functions
async function initializeStatistics() {
    await updateStatistics();
}

async function updateStatistics() {
    try {
        const result = await apiClient.getStatistics();
        if (result.success && result.stats) {
            const stats = result.stats;
            const donorCountEl = document.getElementById("donorCount");
            const livesSavedEl = document.getElementById("livesSaved");
            const activeRequestsEl = document.getElementById("activeRequests");

            if (donorCountEl) {
                donorCountEl.textContent = stats.activeDonors || stats.totalDonors || 0;
            }
            if (livesSavedEl) {
                livesSavedEl.textContent = stats.livesSaved || 0;
            }
            if (activeRequestsEl) {
                activeRequestsEl.textContent = stats.activeRequests || 0;
            }
        }
    } catch (error) {
        console.error("Error loading statistics:", error);
        // Fallback to localStorage
        const donors = JSON.parse(localStorage.getItem("donors")) || [];
        const requests = JSON.parse(localStorage.getItem("requests")) || [];
        const donorCountEl = document.getElementById("donorCount");
        const livesSavedEl = document.getElementById("livesSaved");
        const activeRequestsEl = document.getElementById("activeRequests");

        if (donorCountEl) donorCountEl.textContent = donors.length;
        if (livesSavedEl) livesSavedEl.textContent = donors.length * 3;
        if (activeRequestsEl) activeRequestsEl.textContent = requests.length;
    }
}

// Blood Bank Admin Functions
function initializeBloodBanks() {
    const addBankBtn = document.getElementById("addBankBtn");

    if (addBankBtn) {
        addBankBtn.addEventListener("click", async () => {
            await addBloodBank();
        });
    }
}

async function addBloodBank() {
    const name = document.getElementById("bankName").value;
    const district = document.getElementById("bankDistrict").value;
    const union = document.getElementById("bankUnion").value;
    const contact = document.getElementById("bankContact").value;
    const email = document.getElementById("bankEmail").value;
    const address = document.getElementById("bankAddress").value;
    const type = document.getElementById("bankType").value;

    if (!name || !district) {
        alert("Blood Bank Name and District are required.");
        return;
    }

    const data = {
        bankName: name,
        district,
        union,
        contact,
        email,
        address,
        type
    };

    try {
        const result = await apiClient.addBloodBank(data);
        if (result.success) {
            alert("Blood Bank added successfully!");
            // Clear form
            document.getElementById("bankName").value = "";
            document.getElementById("bankDistrict").value = "";
            document.getElementById("bankUnion").value = "";
            document.getElementById("bankContact").value = "";
            document.getElementById("bankEmail").value = "";
            document.getElementById("bankAddress").value = "";
        } else {
            alert(result.error || "Failed to add Blood Bank");
        }
    } catch (e) {
        console.error("Add Bank Error", e);
        alert("An error occurred.");
    }
}

// Initialize Blood Banks on load
document.addEventListener('DOMContentLoaded', function () {
    initializeBloodBanks();
});

// Chatbot is handled by chatbot.js


// Initialize district-union dropdowns for request form
document.addEventListener('DOMContentLoaded', function () {
    const requestDistrict = document.getElementById('requestDistrict');
    const requestUnion = document.getElementById('requestUnion');

    if (requestDistrict && requestUnion) {
        // Populate districts
        populateDistricts(requestDistrict);

        // Handle district change
        requestDistrict.addEventListener('change', function () {
            populateUnions(requestUnion, this.value);
        });
    }
});


// --- Verification & Privacy Logic ---

let currentVerificationDonorId = null;
let currentRequestId = null;
let proofFileBase64 = null;
let proofFileName = null;
let proofMimeType = null;

// Initialize Modal Events
document.addEventListener('DOMContentLoaded', function () {
    const closeModalBtn = document.getElementById('closeModal');
    const requestOtpBtn = document.getElementById('requestOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const backToStep1Btn = document.getElementById('backToStep1');
    const proofFileInput = document.getElementById('proofFile');
    const dropZone = document.getElementById('dropZone');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeVerificationModal);
    if (backToStep1Btn) backToStep1Btn.addEventListener('click', () => showStep(1));

    if (requestOtpBtn) requestOtpBtn.addEventListener('click', handleRequestOtp);
    if (verifyOtpBtn) verifyOtpBtn.addEventListener('click', handleVerifyOtp);

    // File Upload Handling
    if (dropZone && proofFileInput) {
        dropZone.addEventListener('click', () => proofFileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#e63946';
            dropZone.style.background = '#fff5f5';
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#ddd';
            dropZone.style.background = '#fafafa';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#ddd';
            dropZone.style.background = '#fafafa';
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        proofFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
});

function handleFileSelect(file) {
    if (!file.type.match('image.*')) {
        alert('Please upload an image file (JPG, PNG).');
        return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById('proofPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
        proofFileBase64 = e.target.result.split(',')[1]; // Remove data:image/jpeg;base64,
        proofFileName = file.name;
        proofMimeType = file.type;
    };
    reader.readAsDataURL(file);
}

// Global function for onclick
window.openVerificationModal = function (donorId) {
    currentVerificationDonorId = donorId;
    const modal = document.getElementById('verificationModal');
    if (modal) {
        modal.classList.add('active');
        showStep(1);
    }
};

function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    if (modal) {
        modal.classList.remove('active');
    }
    // Reset form
    document.getElementById('reqName').value = '';
    document.getElementById('reqEmail').value = '';
    document.getElementById('reqContact').value = '';
    document.getElementById('otpInput').value = '';
    document.getElementById('proofPreview').style.display = 'none';
    proofFileBase64 = null;
}

function showStep(step) {
    document.querySelectorAll('.verification-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step-dot').forEach(el => el.classList.remove('active'));

    document.getElementById('step' + step).classList.add('active');
    document.getElementById('dot' + step).classList.add('active');
}

async function handleRequestOtp() {
    const name = document.getElementById('reqName').value;
    const email = document.getElementById('reqEmail').value;
    const contact = document.getElementById('reqContact').value;

    if (!name || !email || !contact) {
        alert('Please fill in all details.');
        return;
    }

    if (!proofFileBase64) {
        alert('Please upload an ID proof.');
        return;
    }

    // Show loading state
    const btn = document.getElementById('requestOtpBtn');
    const originalText = btn.innerText;
    btn.innerText = 'Sending OTP...';
    btn.disabled = true;

    try {
        const result = await apiClient.initiateContactView({
            donorId: currentVerificationDonorId,
            requesterName: name,
            requesterEmail: email,
            requesterContact: contact,
            proofFileBase64: proofFileBase64,
            proofFileName: proofFileName,
            proofMimeType: proofMimeType
        });

        if (result.success) {
            currentRequestId = result.requestId;

            // Check if email was actually sent
            if (result.emailStatus && result.emailStatus.success) {
                alert('Authentication OTP sent to your email!');
            } else {
                // Email failed, show debug OTP with explanation
                const errorMsg = result.emailStatus ? result.emailStatus.error : "Unknown Error";
                alert(`Email Service Failed (${errorMsg}).\n\nHere is your OTP for testing: ${result.debugOtp}`);
                console.log('DEBUG OTP:', result.debugOtp);
            }
            showStep(2);
        } else {
            alert(result.error || 'Failed to send OTP.');
        }
    } catch (error) {
        console.error('OTP Request Error', error);
        alert('An error occurred.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

async function handleVerifyOtp() {
    const otp = document.getElementById('otpInput').value;

    if (!otp || otp.length < 6) {
        alert('Please enter a valid 6-digit OTP.');
        return;
    }

    // Show loading state
    const btn = document.getElementById('verifyOtpBtn');
    const originalText = btn.innerText;
    btn.innerText = 'Verifying...';
    btn.disabled = true;

    try {
        const result = await apiClient.verifyContactOTP({
            requestId: currentRequestId,
            otp: otp,
            donorId: currentVerificationDonorId
        });

        if (result.success && result.donor) {
            // Update UI with unmasked data
            const contactEl = document.getElementById('contact-' + currentVerificationDonorId);
            const emailEl = document.getElementById('email-' + currentVerificationDonorId);

            if (contactEl) {
                contactEl.innerHTML = `<a href='tel:${result.donor.Contact}'>${result.donor.Contact}</a>`;
                contactEl.classList.remove('masked-data');
                contactEl.style.background = 'none';
                contactEl.style.color = 'inherit';
                contactEl.style.fontFamily = 'inherit';
                contactEl.style.letterSpacing = 'normal';
            }
            if (emailEl) {
                emailEl.innerHTML = `<a href='mailto:${result.donor.Email}'>${result.donor.Email}</a>`;
                emailEl.classList.remove('masked-data');
                emailEl.style.background = 'none';
                emailEl.style.color = 'inherit';
                emailEl.style.fontFamily = 'inherit';
                emailEl.style.letterSpacing = 'normal';
            }

            alert('Verification Successful! Contact details revealed.');
            closeVerificationModal();
        } else {
            alert(result.error || 'Invalid OTP.');
        }
    } catch (error) {
        console.error('OTP Verify Error', error);
        alert('An error occurred during verification.');
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
