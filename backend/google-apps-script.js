// Google Apps Script Backend API
// This file contains the backend code to be deployed in Google Apps Script
// Deploy as a Web App with access: "Anyone" or "Anyone with Google account"

// Configuration
const SPREADSHEET_ID = '1ig3d1V97n_V00BvnMhC2pkkz44VI11BiVOlbCv_YJbM'; // Replace with your Google Sheet ID
const PROOF_FOLDER_NAME = 'LifeDrop_Identity_Proofs';
const SHEET_NAMES = {
  DONORS: 'Donors',
  REQUESTS: 'EmergencyRequests',
  CHATBOT_KB: 'ChatbotKnowledgeBase',
  ACCESS_LOGS: 'AccessLogs',
  BLOOD_BANKS: 'BloodBanks'
};

const ADMIN_CONFIG = {
  EMAIL: 'lifedrop.team@gmail.com',
  MOBILE: '6374000585'
};

// Initialize - Run once to set up sheets
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create Donors sheet if it doesn't exist
  let sheet = ss.getSheetByName(SHEET_NAMES.DONORS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.DONORS);
    sheet.appendRow(['Name', 'Contact', 'Email', 'BloodType', 'Gender', 'Age', 'Weight', 'District', 'Union', 'RegistrationDate', 'LastDonationDate', 'Status']);
  }

  // Create EmergencyRequests sheet
  sheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.REQUESTS);
    sheet.appendRow(['RequestID', 'BloodType', 'Hospital', 'Contact', 'District', 'Union', 'Urgent', 'Status', 'CreatedDate']);
  }

  // Create BloodBanks sheet
  sheet = ss.getSheetByName(SHEET_NAMES.BLOOD_BANKS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.BLOOD_BANKS);
    sheet.appendRow(['BankName', 'District', 'Union', 'Contact', 'Email', 'Address', 'Type', 'StockStatus', 'LastUpdated']);
  }

  // Create ChatbotKnowledgeBase sheet
  sheet = ss.getSheetByName(SHEET_NAMES.CHATBOT_KB);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.CHATBOT_KB);
    sheet.appendRow(['Category', 'Keywords', 'Response_EN', 'Response_TA']);
  }

  // Create AccessLogs sheet
  sheet = ss.getSheetByName(SHEET_NAMES.ACCESS_LOGS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAMES.ACCESS_LOGS);
    sheet.appendRow(['RequestID', 'DonorEmail', 'RequesterName', 'RequesterEmail', 'RequesterContact', 'ProofURL', 'OTP', 'OTPExpiry', 'Verified', 'Timestamp']);
  }

  // Create Drive Folder for Proofs if it doesn't exist
  const folders = DriveApp.getFoldersByName(PROOF_FOLDER_NAME);
  if (!folders.hasNext()) {
    DriveApp.createFolder(PROOF_FOLDER_NAME);
  }
}

// CORS Headers
function setCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

// Handle OPTIONS request for CORS
function doOptions() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setMimeType(ContentService.MimeType.TEXT);
}

// Main doPost handler
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let result;

    switch (action) {
      case 'registerDonor':
        result = registerDonor(data);
        break;
      case 'searchDonors':
        result = searchDonors(data);
        break;
      case 'addEmergencyRequest':
        result = addEmergencyRequest(data);
        break;
      case 'addBloodBank':
        result = addBloodBank(data);
        break;
      case 'initiateContactView':
        result = initiateContactView(data);
        break;
      case 'verifyContactOTP':
        result = verifyContactOTP(data);
        break;
      case 'getEmergencyRequests':
        result = getAllRequests();
        break;
      case 'deleteRequest':
        result = deleteRequest(data);
        break;
      case 'updateDonor':
        result = updateDonor(data);
        break;
      case 'deleteDonor':
        result = deleteDonor(data);
        break;
      default:
        result = { success: false, error: 'Invalid action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Main doGet handler
function doGet(e) {
  try {
    const action = e.parameter.action;

    let result;

    switch (action) {
      case 'getDonors':
        result = getAllDonors(); // Note: getAllDonors might need masking too if exposed publicly
        break;
      case 'getRequests':
        result = getAllRequests();
        break;
      case 'getBloodBanks':
        result = getBloodBanks(e.parameter); // Pass query params
        break;
      case 'getStats':
        result = getStatistics();
        break;
      case 'getChatbotKB':
        result = getChatbotKnowledgeBase();
        break;
      default:
        result = { success: false, error: 'Invalid action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helpers
function maskContact(contact) {
  if (!contact) return '';
  const str = String(contact);
  if (str.length < 4) return '***';
  return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
}

function maskEmail(email) {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  if (name.length < 3) return email;
  return name.substring(0, 2) + '***@' + parts[1];
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- Email Helpers & Templates ---
function sendEmail(email, subject, body) {
  if (!email || !subject || !body || email === 'undefined' || email === 'null') {
    console.warn("Invalid email parameters. Request ignored.", {
      to: email || 'MISSING',
      subject: subject || 'MISSING'
    });
    return;
  }

  // Basic email validation
  if (typeof email !== 'string' || !email.includes('@')) {
    console.warn(`Invalid email format: "${email}" for subject: "${subject}"`);
    return;
  }

  try {
    GmailApp.sendEmail(email, subject, body);
    console.log(`Email successfully sent to ${email}`);
    return { success: true };
  } catch (e) {
    console.error(`Failed to send email to ${email}: ${e.toString()}`);
    return { success: false, error: e.toString() };
  }
}

// Aliases for potential lowercase calls from logs or older versions
// Aliases for potential lowercase calls from logs or older versions
function sendwelcomeEmail(email, name, data) {
  if (!email) return;
  return sendWelcomeEmail(email, name, data);
}
function sendOTPmail(email, otp, name) {
  if (!email || !otp) return;
  return sendOTPEmail(email, otp, name);
}
function sendemergencynotification(req, donors) {
  if (!req) return;
  return sendEmergencyNotifications(req, donors);
}
function getdonorbyid(id) {
  if (!id) return null;
  return getDonorEmailById(id);
}

function getRegistrationEmailBody(donorData) {
  if (!donorData) return "Error: Missing donor data";
  // Bilingual Email (English + Tamil)
  return `Hello ${donorData.name || 'Donor'},

Your blood donation registration has been successfully completed!

Registration Details:
• Name: ${donorData.name}
• Blood Type: ${donorData.bloodType}
• District: ${donorData.district}
• Union: ${donorData.union}
• Contact: ${donorData.contact}

You are now part of our blood donor community. Your donation will help save lives.

Admin Contact:
Email: ${ADMIN_CONFIG.EMAIL}
Mobile: ${ADMIN_CONFIG.MOBILE}

---

வணக்கம் ${donorData.name},

உங்கள் இரத்த தானம் பதிவு வெற்றிகரமாக முடிக்கப்பட்டது!

பதிவு விவரங்கள்:
• பெயர்: ${donorData.name}
• இரத்த வகை: ${donorData.bloodType}
• மாவட்டம்: ${donorData.district}
• ஒன்றியம்: ${donorData.union}
• தொடர்பு: ${donorData.contact}

நீங்கள் இப்போது எங்கள் இரத்த தானம் செய்பவர்கள் சமூகத்தின் ஒரு பகுதியாகிவிட்டீர்கள். உங்கள் தானம் வாழ்க்கைகளை காப்பாற்ற உதவும்.

நிர்வாக தொடர்பு:
மின்னஞ்சல்: ${ADMIN_CONFIG.EMAIL}
கைபேசி: ${ADMIN_CONFIG.MOBILE}

Thank you / நன்றி,
The LifeDrop Team`;
}

function getDonorNotificationEmailBody(donorName, requestData) {
  if (!requestData) return "Error: Missing request data";
  return `Hello ${donorName || 'Donor'},

Urgent Blood Need!

Blood Type: ${requestData.bloodType}
Hospital: ${requestData.hospital}
District: ${requestData.district || 'N/A'}
Union: ${requestData.union || 'N/A'}
Contact: ${requestData.contact}

Your help is needed. Please contact the number above immediately if you are available to donate.

Admin Contact:
Email: ${ADMIN_CONFIG.EMAIL}
Mobile: ${ADMIN_CONFIG.MOBILE}

---

வணக்கம் ${donorName},

அவசர இரத்த தேவை!

இரத்த வகை: ${requestData.bloodType}
மருத்துவமனை: ${requestData.hospital}
மாவட்டம்: ${requestData.district || 'N/A'}
ஒன்றியம்: ${requestData.union || 'N/A'}
தொடர்பு: ${requestData.contact}

உங்கள் உதவி தேவைப்படுகிறது. நீங்கள் தானம் செய்ய தயாராக இருந்தால் உடனடியாக மேலே உள்ள எண்ணை தொடர்பு கொள்ளவும்.

நிர்வாக தொடர்பு:
மின்னஞ்சல்: ${ADMIN_CONFIG.EMAIL}
கைபேசி: ${ADMIN_CONFIG.MOBILE}

Thank you / நன்றி,
The LifeDrop Team`;
}

function getOTPEmailBody(requesterName, otp) {
  return `Hello ${requesterName},

Your One-Time Password (OTP) for verifying show donor contact details on LifeDrop is: ${otp}

This OTP is valid for 10 minutes. Do not share this with anyone.

---

வணக்கம் ${requesterName},

LifeDrop இல் உங்கள் அடையாளத்தைச் சரிபார்ப்பதற்கான ஒரு முறை கடவுச்சொல் (OTP): ${otp}

இந்த OTP 10 நிமிடங்களுக்கு செல்லுபடியாகும். இதை யாருடனும் பகிர வேண்டாம்.

Regards,
LifeDrop Security Team`;
}

function sendWelcomeEmail(email, name, donorData) {
  if (!email || email === 'undefined') return { success: false, error: 'Invalid email' };
  const subject = "Welcome to LifeDrop - Registration Confirmed / பதிவு உறுதி செய்யப்பட்டது";
  const body = getRegistrationEmailBody(donorData || { name: name });
  return sendEmail(email, subject, body);
}

function sendOTPEmail(email, otp, requesterName) {
  if (!email || email === 'undefined') return { success: false, error: 'Invalid email' };
  const subject = "Your Verification OTP - LifeDrop";
  const body = getOTPEmailBody(requesterName || 'User', otp);
  return sendEmail(email, subject, body);
}

function sendEmergencyNotifications(requestData, matchingDonors) {
  if (!requestData || !requestData.bloodType) {
    console.warn("Missing request data for notifications.");
    return 0;
  }

  // Handle case where donors might be missing or empty
  if (!matchingDonors || !Array.isArray(matchingDonors) || matchingDonors.length === 0) {
    console.log("No matching donors to notify.");
    return 0;
  }

  const subject = `Urgent: Blood Needed (${requestData.bloodType}) - LifeDrop`;
  const limit = 20;
  let count = 0;

  matchingDonors.forEach(donor => {
    // Check if donor has valid email
    if (count < limit && donor.Email && donor.Email !== 'undefined' && String(donor.Email).includes('@')) {
      const body = getDonorNotificationEmailBody(donor.Name, requestData);
      sendEmail(donor.Email, subject, body);
      count++;
    }
  });

  return count;
}

// Register a new donor
function registerDonor(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.DONORS);

    // Validate required fields
    if (!data.name || !data.contact || !data.email || !data.bloodType || !data.district || !data.union) {
      return { success: false, error: 'Missing required fields' };
    }

    // Check for duplicate email
    const existingData = sheet.getDataRange().getValues();
    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][2] === data.email) {
        return { success: false, error: 'Email already registered' };
      }
    }

    // Add new donor
    const row = [
      data.name,
      data.contact,
      data.email,
      data.bloodType,
      data.gender || '',
      data.age || '',
      data.weight || '',
      data.district,
      data.union,
      new Date(),
      data.lastDonationDate || '',
      'Active'
    ];

    sheet.appendRow(row);



    // Send Welcome Email
    const emailResult = sendWelcomeEmail(data.email, data.name, data);

    return {
      success: true,
      message: 'Donor registered successfully',
      emailStatus: emailResult
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Search donors (Masked)
function searchDonors(data) {
  try {
    const results = findMatchingDonors(data);

    // Mask sensitive data for public API return
    const maskedDonors = results.map((donor, index) => {
      // NOTE: We MUST preserve the RowIndex/DonorID from the donor object if present
      const stableId = donor.DonorID || donor.RowIndex || (index + 1);

      return {
        ...donor,
        Contact: maskContact(donor.Contact),
        Email: maskEmail(donor.Email),
        DonorID: stableId // Preserve the persistent ID
      };
    });

    return { success: true, donors: maskedDonors, count: maskedDonors.length };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Internal Helper: Find donors
function findMatchingDonors(criteria) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.DONORS);
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const donors = [];

  for (let i = 1; i < allData.length; i++) {
    const row = allData[i];
    const donor = {};
    headers.forEach((header, index) => {
      donor[header] = row[index];
    });
    // Store Row Index (1-based)
    donor['RowIndex'] = i + 1;
    // Also add DonorID as RowIndex for frontend compatibility
    donor['DonorID'] = i + 1;

    let matches = true;
    if (criteria) {
      if (criteria.bloodType && donor.BloodType !== criteria.bloodType) matches = false;
      if (criteria.district && donor.District !== criteria.district) matches = false;
      if (criteria.union && donor.Union !== criteria.union) matches = false;
      if (criteria.status && donor.Status !== criteria.status) matches = false;
    }

    if (matches) {
      donors.push(donor);
    }
  }
  return donors;
}

// Helper needed for View Contact to get REAL email from ID
function getDonorEmailById(rowId) {
  if (!rowId || rowId === 'undefined') return null;

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAMES.DONORS);

  // Convert string to number if needed and validate
  const id = parseInt(rowId);

  if (isNaN(id) || id < 2) {
    // Invalid ID, just return null without error log to reduce noise
    return null;
  }

  if (id > sheet.getLastRow()) {
    return null;
  }

  try {
    // RowId is 1-based. Email is col 3.
    const email = sheet.getRange(id, 3).getValue();
    if (!email) {
      return null;
    }
    return email;
  } catch (e) {
    console.error(`Error fetching email from row ${id}: ${e.toString()}`);
    return null;
  }
}

// Initiate Contact View (Step 1: Upload Proof -> Send OTP)
function initiateContactView(data) {
  try {
    // data: { donorId, requesterName, requesterEmail, requesterContact, proofFileBase64, proofFileName, proofMimeType }

    // Robust validation for required fields including "undefined" string check
    const required = ['donorId', 'requesterName', 'requesterEmail', 'proofFileBase64'];
    for (let field of required) {
      if (!data[field] || data[field] === 'undefined' || data[field] === 'null') {
        return { success: false, error: `Missing or invalid validation field: ${field}` };
      }
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const logSheet = ss.getSheetByName(SHEET_NAMES.ACCESS_LOGS);

    // 1. Save Proof to Drive
    let proofUrl = '';
    try {
      const folders = DriveApp.getFoldersByName(PROOF_FOLDER_NAME);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PROOF_FOLDER_NAME);
      const decoded = Utilities.base64Decode(data.proofFileBase64);
      const blob = Utilities.newBlob(decoded, data.proofMimeType || 'image/jpeg', data.proofFileName || 'proof.jpg');
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      proofUrl = file.getUrl();
    } catch (e) {
      return { success: false, error: 'Failed to upload proof: ' + e.toString() };
    }

    // 2. Generate OTP
    const otp = generateOTP();
    const expiry = new Date().getTime() + 10 * 60 * 1000; // 10 mins

    // 3. Get Donor Email (for logging purpose)
    const donorEmail = getDonorEmailById(data.donorId);

    // 4. Log Request
    const requestId = 'ACC' + Date.now();
    logSheet.appendRow([
      requestId,
      donorEmail,
      data.requesterName,
      data.requesterEmail,
      data.requesterContact,
      proofUrl,
      otp,
      expiry,
      'PENDING',
      new Date()
    ]);

    // 5. Send OTP Email to Requester
    const emailResult = sendOTPEmail(data.requesterEmail, otp, data.requesterName);

    // Return OTP for debugging since email service might fail
    return {
      success: true,
      requestId: requestId,
      message: emailResult && emailResult.success ? 'OTP sent to your email' : 'OTP generated (Email Failed)',
      emailStatus: emailResult,
      debugOtp: otp
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Verify OTP (Step 2: Check OTP -> Return Unmasked Data)
function verifyContactOTP(data) {
  try {
    // data: { requestId, otp, donorId }
    if (!data.requestId || !data.otp || !data.donorId) {
      return { success: false, error: 'Missing OTP or Request ID' };
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const logSheet = ss.getSheetByName(SHEET_NAMES.ACCESS_LOGS);
    const donorSheet = ss.getSheetByName(SHEET_NAMES.DONORS);

    const logs = logSheet.getDataRange().getValues();
    let logRowIndex = -1;
    let logData = null;

    // Find the request
    for (let i = 1; i < logs.length; i++) {
      if (logs[i][0] === data.requestId) {
        logRowIndex = i + 1;
        logData = logs[i];
        break;
      }
    }

    if (!logData) {
      return { success: false, error: 'Invalid Request ID' };
    }

    // Check if already verified
    if (logData[8] === 'VERIFIED') {
      // Allow re-fetching if within reasonable time? For now, just proceed to return data
    } else {
      // Validate OTP
      if (String(logData[6]) !== String(data.otp)) {
        return { success: false, error: 'Invalid OTP' };
      }

      // Validate Expiry
      if (new Date().getTime() > logData[7]) {
        return { success: false, error: 'OTP Expired' };
      }

      // Update Log Status
      logSheet.getRange(logRowIndex, 9).setValue('VERIFIED');
    }

    // Fetch Unmasked Donor Data
    // Note: donorId is the Row Index in Donors sheet
    const donorRowIndex = parseInt(data.donorId);
    if (isNaN(donorRowIndex)) return { success: false, error: 'Invalid Donor ID' };

    const donorData = donorSheet.getRange(donorRowIndex, 1, 1, 12).getValues()[0];

    const donor = {
      Name: donorData[0],
      Contact: donorData[1], // Unmasked
      Email: donorData[2],   // Unmasked
      BloodType: donorData[3],
      District: donorData[7],
      Union: donorData[8],
      Status: donorData[11]
    };

    return { success: true, donor: donor };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Get all donors (public view - should be masked)
function getAllDonors() {
  try {
    const results = findMatchingDonors({}); // Empty criteria = all
    const maskedDonors = results.map((donor, index) => {
      return {
        ...donor,
        Contact: maskContact(donor.Contact),
        Email: maskEmail(donor.Email)
      };
    });
    return { success: true, donors: maskedDonors, count: maskedDonors.length };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Add emergency request
function addEmergencyRequest(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);

    if (!data.bloodType || !data.hospital || !data.contact) {
      return { success: false, error: 'Missing required fields' };
    }

    const requestId = 'REQ' + Date.now();
    const row = [
      requestId,
      data.bloodType,
      data.hospital,
      data.contact,
      data.district || '',
      data.union || '',
      data.urgent || false,
      'Active',
      new Date()
    ];

    sheet.appendRow(row);

    // Trigger Email Notification to Matching Donors
    const matchingDonors = findMatchingDonors({
      bloodType: data.bloodType,
      district: data.district,
      union: data.union,
      status: 'Active'
    });

    const sentCount = sendEmergencyNotifications(data, matchingDonors);

    return { success: true, requestId: requestId, message: 'Emergency request added successfully', notifiedDonors: sentCount };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Delete emergency request
function deleteRequest(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);
    const allData = sheet.getDataRange().getValues();

    if (!data.requestId) {
      return { success: false, error: 'Request ID is required' };
    }

    // Find request by ID
    for (let i = 1; i < allData.length; i++) {
      // ID is in column 0 (A)
      if (allData[i][0] === data.requestId) {
        // Hard delete or Soft delete? Soft delete is better.
        // Update Status (Col 7 / Index 7 - 8th column [RequestID, BloodType, Hospital, Contact, District, Union, Urgent, Status])
        // Wait, check appendRow in addEmergencyRequest:
        // [requestId, bloodType, hospital, contact, district, union, urgent, 'Active', date]
        // So Status is Index 7 (8th column).

        sheet.getRange(i + 1, 8).setValue('Deleted');
        return { success: true, message: 'Request deleted successfully' };
      }
    }

    return { success: false, error: 'Request not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// --- Blood Bank Functions ---

function addBloodBank(data) {
  // data: { bankName, district, union, contact, email, address, type, stockStatus }
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.BLOOD_BANKS);

    if (!data.bankName || !data.district) {
      return { success: false, error: 'Name and District are required' };
    }

    sheet.appendRow([
      data.bankName,
      data.district,
      data.union || '',
      data.contact || '',
      data.email || '',
      data.address || '',
      data.type || 'Government',
      data.stockStatus || 'Unknown',
      new Date()
    ]);

    return { success: true, message: 'Blood Bank added successfully' };

  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function getBloodBanks(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.BLOOD_BANKS);
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const banks = [];

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const bank = {};
      headers.forEach((h, idx) => bank[h] = row[idx]);

      // Filter if needed
      if (data && data.district && bank.District !== data.district) continue;

      banks.push(bank);
    }

    return { success: true, banks: banks, count: banks.length };

  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// Get all emergency requests
function getAllRequests() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);
    if (!sheet) {
      return { success: true, requests: [], count: 0, warning: "Sheet 'EmergencyRequests' not found. Run initializeSheets() first." };
    }
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];

    const requests = [];

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const request = {};
      headers.forEach((header, index) => {
        request[header] = row[index];
      });

      // Only return active requests
      if (request.Status === 'Active') {
        requests.push(request);
      }
    }

    return { success: true, requests: requests, count: requests.length };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Get statistics
function getStatistics() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const donorsSheet = ss.getSheetByName(SHEET_NAMES.DONORS);
    const requestsSheet = ss.getSheetByName(SHEET_NAMES.REQUESTS);

    if (!donorsSheet || !requestsSheet) {
      return {
        success: true,
        stats: { totalDonors: 0, activeDonors: 0, totalRequests: 0, activeRequests: 0, livesSaved: 0 }
      };
    }

    const totalDonors = donorsSheet.getLastRow() > 1 ? donorsSheet.getLastRow() - 1 : 0;

    // Safety check for empty sheets
    let activeDonors = 0;
    if (totalDonors > 0) {
      const statusValues = donorsSheet.getRange(2, 12, totalDonors, 1).getValues();
      activeDonors = statusValues.filter(row => row[0] === 'Active').length;
    }

    const totalRequests = requestsSheet.getLastRow() > 1 ? requestsSheet.getLastRow() - 1 : 0;

    let activeRequests = 0;
    if (totalRequests > 0) {
      const statusValues = requestsSheet.getRange(2, 8, totalRequests, 1).getValues();
      activeRequests = statusValues.filter(row => row[0] === 'Active').length;
    }

    return {
      success: true,
      stats: {
        totalDonors: totalDonors,
        activeDonors: activeDonors,
        totalRequests: totalRequests,
        activeRequests: activeRequests,
        livesSaved: activeDonors * 3
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Update donor
function updateDonor(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.DONORS);
    const allData = sheet.getDataRange().getValues();

    // Find donor by email
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][2] === data.email) {
        // Update row
        sheet.getRange(i + 1, 1, 1, 12).setValues([[
          data.name || allData[i][0],
          data.contact || allData[i][1],
          data.email,
          data.bloodType || allData[i][3],
          data.gender || allData[i][4],
          data.age || allData[i][5],
          data.weight || allData[i][6],
          data.district || allData[i][7],
          data.union || allData[i][8],
          allData[i][9],
          data.lastDonationDate || allData[i][10],
          data.status || allData[i][11]
        ]]);

        return { success: true, message: 'Donor updated successfully' };
      }
    }

    return { success: false, error: 'Donor not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function deleteDonor(data) {
  // Implementation preserved from original (but added below to match block replacement)
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.DONORS);
    const allData = sheet.getDataRange().getValues();

    // Find donor by email
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][2] === data.email) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Donor deleted successfully' };
      }
    }

    return { success: false, error: 'Donor not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Get Chatbot Knowledge Base
function getChatbotKnowledgeBase() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAMES.CHATBOT_KB);
    if (!sheet) {
      return { success: true, knowledge: {}, warning: "KB Sheet not found" };
    }
    const allData = sheet.getDataRange().getValues();

    const knowledge = {};

    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const category = row[0]; // Category
      const keywords = row[1] ? row[1].split(',').map(k => k.trim()) : [];
      const responseEN = row[2] || '';
      const responseTA = row[3] || '';

      if (category) {
        knowledge[category] = {
          keywords: keywords,
          responses: {
            en: responseEN,
            ta: responseTA
          }
        };
      }
    }

    // Ensure we send back something if empty, to trigger the "Loaded" log on frontend
    if (Object.keys(knowledge).length === 0) {
      knowledge['greeting'] = {
        keywords: ['hello', 'hi'],
        responses: { en: "Hello from Sheets (Default)", ta: "வணக்கம்" }
      };
      // Add minimal eligibility to mimic real structure
      knowledge['eligibility'] = {
        keywords: ['eligible'],
        responses: { en: "Age 18-65, Weight > 45kg", ta: "வயது 18-65" }
      };
    }

    return { success: true, knowledge: knowledge };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
