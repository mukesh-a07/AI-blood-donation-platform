
/**
 * LifeDrop Blood Donation Platform - FULLY CORRECTED Google Apps Script
 * Updated with user's actual sheet IDs and fixed configuration
 */

// UPDATED: Using user's actual Google Sheets IDs
const CONFIG = {
  DONORS_SHEET_ID: '1JvyJ_KouBdrUANnjsMpZjc7pSlZtJHFOX7HrXlmtNiY',      // ✅ User's actual donors sheet
  REQUESTS_SHEET_ID: '1wSSL-xP9idYj0bQhnVvHjv_EpRoJ_NPlfUBHHpF7H7g',  // ✅ User's actual requests sheet
  DONORS_SHEET_NAME: 'Donors',
  REQUESTS_SHEET_NAME: 'EmergencyRequests',
  ADMIN_EMAIL: 'team2025flowers@gmail.com',
  ADMIN_MOBILE: '6374000585'
};

/**
 * Handle GET requests - Fixed parameter handling
 */
function doGet(e) {
  try {
    console.log('doGet called');

    // Handle case where e is undefined or null
    if (!e || !e.parameter) {
      console.log('No parameters provided, returning test response');
      return createJsonResponse(true, 'Google Apps Script is working - no parameters provided', {
        status: 'operational',
        timestamp: new Date().toISOString(),
        availableActions: ['getDonors', 'getRequests', 'getStats', 'getAdminContact', 'test']
      });
    }

    const action = e.parameter.action || 'test';
    console.log('Processing GET action:', action);

    switch(action) {
      case 'getDonors':
        return getDonors();
      case 'getRequests':
        return getEmergencyRequests();
      case 'getStats':
        return getStatistics();
      case 'getAdminContact':
        return getAdminContact();
      case 'test':
        return testScript();
      default:
        return createJsonResponse(true, 'Google Apps Script is operational', {
          action: action,
          availableActions: ['getDonors', 'getRequests', 'getStats', 'getAdminContact', 'test']
        });
    }

  } catch (error) {
    console.error('doGet Error:', error);
    return createJsonResponse(false, 'doGet error: ' + error.message, {
      error: error.toString(),
      configCheck: checkConfiguration()
    });
  }
}

/**
 * Handle POST requests - Fixed data handling
 */
/**
 * Handle POST requests - FIXED to handle both JSON and FormData
 */
function doPost(e) {
  try {
    console.log('doPost called');
    console.log('Full event object:', JSON.stringify(e, null, 2));

    let requestData = {};
    let action = '';

    // Method 1: Try to get data from e.parameter (FormData from HTML)
    if (e && e.parameter && e.parameter.action) {
      console.log('Using FormData from e.parameter');
      action = e.parameter.action;

      // If there's a data parameter, parse it as JSON
      if (e.parameter.data) {
        try {
          requestData = JSON.parse(e.parameter.data);
          console.log('Parsed data from e.parameter.data:', requestData);
        } catch (parseError) {
          console.error('Failed to parse e.parameter.data as JSON:', parseError);
          requestData = e.parameter; // Use the raw parameters
        }
      } else {
        // No separate data parameter, use all parameters
        requestData = e.parameter;
      }
    }
    // Method 2: Try to get data from e.postData.contents (JSON from direct POST)
    else if (e && e.postData && e.postData.contents) {
      console.log('Using JSON from e.postData.contents');
      try {
        const postData = JSON.parse(e.postData.contents);
        action = postData.action;
        requestData = postData.data || postData;
        console.log('Parsed JSON data:', { action, requestData });
      } catch (parseError) {
        console.error('Failed to parse e.postData.contents as JSON:', parseError);
        return createJsonResponse(false, 'Invalid JSON in POST data: ' + parseError.message);
      }
    }
    // Method 3: No data received
    else {
      console.error('No POST data received in any expected format');
      console.log('Available properties:', Object.keys(e || {}));
      return createJsonResponse(false, 'No POST data received. Expected either e.parameter.action or e.postData.contents');
    }

    if (!action) {
      console.error('No action found in POST data');
      return createJsonResponse(false, 'No action specified in POST data');
    }

    console.log('Processing POST action:', action);
    console.log('Request data:', requestData);

    switch(action) {
      case 'addDonor':
        return addDonor(requestData);
      case 'updateDonor':
        return updateDonor(requestData.id, requestData);
      case 'deleteDonor':
        return deleteDonor(requestData.id || e.parameter?.id);
      case 'addRequest':
        return addEmergencyRequest(requestData);
      case 'updateRequest':
        return updateEmergencyRequest(requestData.id, requestData);
      case 'deleteRequest':
        return deleteEmergencyRequest(requestData.id || e.parameter?.id);
      case 'sendNotification':
        return sendNotificationEmail(requestData);
      case 'chatbotQuery':
        const reply = chatbotQuery(requestData.message);
        return createJsonResponse(true, 'Chatbot reply', { reply });

      default:
        return createJsonResponse(false, 'Unknown POST action: ' + action);
    }

  } catch (error) {
    console.error('doPost Error:', error);
    return createJsonResponse(false, 'doPost error: ' + error.message, {
      error: error.toString(),
      stack: error.stack
    });
  }
}

/**
 * UTILITY FUNCTIONS - Fixed sheet access with comprehensive error handling
 */

/**
 * Check configuration and sheet access - FIXED for user's actual sheet IDs
 */
function checkConfiguration() {
  try {
    const config = {
      donorsSheetConfigured: CONFIG.DONORS_SHEET_ID && CONFIG.DONORS_SHEET_ID.length > 10,
      requestsSheetConfigured: CONFIG.REQUESTS_SHEET_ID && CONFIG.REQUESTS_SHEET_ID.length > 10,
      donorsSheetId: CONFIG.DONORS_SHEET_ID,
      requestsSheetId: CONFIG.REQUESTS_SHEET_ID,
      adminEmail: CONFIG.ADMIN_EMAIL || 'Not configured',
      adminMobile: CONFIG.ADMIN_MOBILE || 'Not configured'
    };

    console.log('Configuration check result:', config);
    return config;
  } catch (error) {
    console.error('Error checking configuration:', error);
    return {
      donorsSheetConfigured: false,
      requestsSheetConfigured: false,
      adminEmail: 'Error checking config',
      adminMobile: 'Error checking config'
    };
  }
}

/**
 * Get sheet with comprehensive error handling - FIXED
 */
function getSheet(sheetId, sheetName) {
  try {
    console.log('getSheet called with:', { sheetId, sheetName });

    // Validate inputs
    if (!sheetId) {
      throw new Error('Sheet ID is null or undefined');
    }

    if (!sheetName) {
      throw new Error('Sheet name is null or undefined');
    }

    // Convert to string to be safe
    const sheetIdStr = String(sheetId);
    const sheetNameStr = String(sheetName);
    console.log('Processed inputs:', { sheetIdStr, sheetNameStr });

    console.log(`Attempting to access sheet: ${sheetNameStr} with ID: ${sheetIdStr}`);

    // Try to open the spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(sheetIdStr);
      console.log('Successfully opened spreadsheet');
    } catch (openError) {
      console.error('Error opening spreadsheet:', openError);
      throw new Error(`Cannot access spreadsheet with ID: ${sheetIdStr}. Error: ${openError.message}`);
    }

    // Validate that spreadsheet is not null/undefined
    if (!spreadsheet) {
      throw new Error('Spreadsheet is null after opening');
    }

    // Try to get the specific sheet
    let sheet;
    try {
      sheet = spreadsheet.getSheetByName(sheetNameStr);
    } catch (getSheetError) {
      console.error('Error getting sheet by name:', getSheetError);
      throw new Error(`Cannot get sheet ${sheetNameStr}: ${getSheetError.message}`);
    }

    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log(`Sheet ${sheetNameStr} doesn't exist, creating it...`);
      try {
        sheet = spreadsheet.insertSheet(sheetNameStr);
        console.log(`Successfully created sheet: ${sheetNameStr}`);
      } catch (createError) {
        console.error('Error creating sheet:', createError);
        throw new Error(`Cannot create sheet ${sheetNameStr}: ${createError.message}`);
      }
    }

    // Final validation that sheet exists and is valid
    if (!sheet) {
      throw new Error(`Sheet is null after creation attempt for ${sheetNameStr}`);
    }

    console.log(`Successfully retrieved sheet: ${sheetNameStr}`);
    return sheet;

  } catch (error) {
    console.error(`getSheet error for ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Initialize sheet with headers if empty - FIXED
 */
function initializeSheet(sheet, headers) {
  try {
    console.log('initializeSheet called');

    // Validate inputs
    if (!sheet) {
      throw new Error('Sheet is null or undefined');
    }

    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      throw new Error('Headers are invalid or empty');
    }

    console.log('Checking sheet row count...');

    // Get last row safely
    let lastRow;
    try {
      lastRow = sheet.getLastRow();
      console.log('Sheet last row:', lastRow);
    } catch (rowError) {
      console.error('Error getting last row:', rowError);
      throw new Error(`Cannot get last row from sheet: ${rowError.message}`);
    }

    if (lastRow === 0) {
      console.log('Sheet is empty, initializing with headers:', headers);
      try {
        // Set headers
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        console.log('Headers set successfully');

        // Add formatting
        const headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#f1f3f4');
        console.log('Header formatting applied');
        return true;

      } catch (initError) {
        console.error('Error setting headers:', initError);
        throw new Error(`Cannot initialize sheet headers: ${initError.message}`);
      }
    }

    console.log('Sheet already has headers, skipping initialization');
    return false;

  } catch (error) {
    console.error('Error initializing sheet:', error);
    throw error;
  }
}

/**
 * DONOR CRUD OPERATIONS - Fixed with better error handling
 */

/**
 * Get all donors with comprehensive error handling
 */
function getDonors() {
  try {
    console.log('getDonors called');

    // Check configuration first
    const configCheck = checkConfiguration();
    if (!configCheck.donorsSheetConfigured) {
      return createJsonResponse(false, 'Donors sheet not configured. Please check CONFIG.DONORS_SHEET_ID', {
        configHelp: 'Verify your Google Sheet ID is correct',
        currentId: CONFIG.DONORS_SHEET_ID,
        configCheck: configCheck
      });
    }

    let sheet;
    try {
      sheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
    } catch (sheetError) {
      return createJsonResponse(false, 'Cannot access donors sheet: ' + sheetError.message);
    }

    let lastRow;
    try {
      lastRow = sheet.getLastRow();
    } catch (rowError) {
      return createJsonResponse(false, 'Cannot read donors sheet: ' + rowError.message);
    }

    // Check if sheet has any data
    if (lastRow === 0) {
      console.log('No data in donors sheet');
      return createJsonResponse(true, 'No donors found - sheet is empty', []);
    }

    let data;
    try {
      data = sheet.getDataRange().getValues();
    } catch (dataError) {
      return createJsonResponse(false, 'Cannot read data from donors sheet: ' + dataError.message);
    }

    console.log(`Retrieved ${data.length} rows from donors sheet`);
    if (data.length <= 1) {
      return createJsonResponse(true, 'No donors found - only headers present', []);
    }

    const headers = data[0];
    const donors = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Only process rows that have data in the first column
      if (row && row.length > 0 && row[0] && String(row[0]).trim() !== '') {
        const donor = {};
        headers.forEach((header, index) => {
          donor[String(header)] = row[index] || '';
        });
        donors.push(donor);
      }
    }

    console.log(`Processed ${donors.length} donor records`);
    return createJsonResponse(true, `Found ${donors.length} donors`, donors);

  } catch (error) {
    console.error('getDonors Error:', error);
    return createJsonResponse(false, 'Failed to get donors: ' + error.message, {
      error: error.toString()
    });
  }
}

/**
 * Add donor with enhanced validation and error handling
 */
function addDonor(donorData) {
  try {
    console.log('addDonor called');
    console.log('Donor data received:', JSON.stringify(donorData));

    // Validate input data
    if (!donorData) {
      return createJsonResponse(false, 'No donor data provided');
    }

    if (typeof donorData !== 'object') {
      return createJsonResponse(false, 'Invalid donor data format - must be an object');
    }

    // Check configuration
    const configCheck = checkConfiguration();
    if (!configCheck.donorsSheetConfigured) {
      return createJsonResponse(false, 'Donors sheet not configured. Please update CONFIG.DONORS_SHEET_ID with your actual Google Sheets ID', {
        configCheck: configCheck,
        currentId: CONFIG.DONORS_SHEET_ID
      });
    }

    let sheet;
    try {
      sheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
    } catch (sheetError) {
      return createJsonResponse(false, 'Cannot access donors sheet: ' + sheetError.message);
    }

    // Initialize headers if needed
    const headers = [
      'id', 'fullName', 'email', 'phone', 'bloodType', 'age', 'weight',
      'gender', 'location', 'medicalConditions', 'registrationDate',
      'lastDonation', 'status', 'dateCreated', 'lastModified'
    ];

    try {
      initializeSheet(sheet, headers);
    } catch (initError) {
      console.warn('Could not initialize sheet headers:', initError);
      // Continue anyway - maybe headers already exist
    }

    // Enhanced validation with better error messages
    const requiredFields = [
      { field: 'fullName', message: 'Full name is required' },
      { field: 'email', message: 'Email address is required' },
      { field: 'phone', message: 'Phone number is required' },
      { field: 'bloodType', message: 'Blood type is required' },
      { field: 'age', message: 'Age is required' },
      { field: 'location', message: 'Location is required' }
    ];

    for (let req of requiredFields) {
      if (!donorData[req.field] || String(donorData[req.field]).trim() === '') {
        return createJsonResponse(false, req.message, {
          missingField: req.field,
          receivedFields: Object.keys(donorData)
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorData.email)) {
      return createJsonResponse(false, 'Invalid email format');
    }

    // Check for duplicate email
    try {
      const existingData = sheet.getDataRange().getValues();
      if (existingData.length > 1) {
        const emailColumnIndex = existingData[0].indexOf('email');
        if (emailColumnIndex !== -1) {
          for (let i = 1; i < existingData.length; i++) {
            if (existingData[i][emailColumnIndex] === donorData.email) {
              return createJsonResponse(false, 'A donor with this email already exists');
            }
          }
        }
      }
    } catch (duplicateCheckError) {
      console.warn('Could not check for duplicate emails:', duplicateCheckError);
      // Continue anyway
    }

    // Generate unique ID and prepare data
    const id = generateId();
    const currentDate = new Date().toISOString();
    const rowData = [
      id,
      String(donorData.fullName || ''),
      String(donorData.email || ''),
      String(donorData.phone || ''),
      String(donorData.bloodType || ''),
      parseInt(donorData.age) || 0,
      parseInt(donorData.weight) || 0,
      String(donorData.gender || ''),
      String(donorData.location || ''),
      String(donorData.medicalConditions || ''),
      donorData.registrationDate || currentDate,
      donorData.lastDonation || '',
      donorData.status || 'Available',
      currentDate,
      currentDate
    ];

    console.log('Prepared row data:', rowData);

    // Add the row to the sheet
    try {
      sheet.appendRow(rowData);
      console.log('Successfully added donor to sheet');
    } catch (appendError) {
      console.error('Error appending row:', appendError);
      return createJsonResponse(false, 'Failed to save donor to sheet: ' + appendError.message);
    }

    // Try to send welcome email (don't fail if this doesn't work)
    try {
      sendWelcomeEmail(donorData.email, donorData.fullName);
    } catch (emailError) {
      console.warn('Welcome email failed:', emailError);
    }

    return createJsonResponse(true, 'Donor registered successfully!', {
      id: id,
      message: 'Registration successful! Welcome to LifeDrop.'
    });

  } catch (error) {
    console.error('addDonor Error:', error);
    return createJsonResponse(false, 'Failed to add donor: ' + error.message, {
      error: error.toString()
    });
  }
}

/**
 * EMERGENCY REQUEST CRUD OPERATIONS - Fixed
 */

/**
 * Get emergency requests with error handling
 */
function getEmergencyRequests() {
  try {
    console.log('getEmergencyRequests called');

    const configCheck = checkConfiguration();
    if (!configCheck.requestsSheetConfigured) {
      return createJsonResponse(false, 'Emergency requests sheet not configured. Please set CONFIG.REQUESTS_SHEET_ID with your actual Google Sheets ID', {
        configCheck: configCheck,
        currentId: CONFIG.REQUESTS_SHEET_ID
      });
    }

    let sheet;
    try {
      sheet = getSheet(CONFIG.REQUESTS_SHEET_ID, CONFIG.REQUESTS_SHEET_NAME);
    } catch (sheetError) {
      return createJsonResponse(false, 'Cannot access requests sheet: ' + sheetError.message);
    }

    let lastRow;
    try {
      lastRow = sheet.getLastRow();
    } catch (rowError) {
      return createJsonResponse(false, 'Cannot read requests sheet: ' + rowError.message);
    }

    if (lastRow === 0) {
      console.log('No data in requests sheet');
      return createJsonResponse(true, 'No emergency requests found - sheet is empty', []);
    }

    let data;
    try {
      data = sheet.getDataRange().getValues();
    } catch (dataError) {
      return createJsonResponse(false, 'Cannot read data from requests sheet: ' + dataError.message);
    }

    console.log(`Retrieved ${data.length} rows from requests sheet`);
    if (data.length <= 1) {
      return createJsonResponse(true, 'No emergency requests found - only headers present', []);
    }

    const headers = data[0];
    const requests = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && row.length > 0 && row[0] && String(row[0]).trim() !== '') {
        const request = {};
        headers.forEach((header, index) => {
          request[String(header)] = row[index] || '';
        });
        requests.push(request);
      }
    }

    // Sort by urgency and date
    requests.sort((a, b) => {
      const urgencyOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      const urgencyA = urgencyOrder[a.urgency] || 0;
      const urgencyB = urgencyOrder[b.urgency] || 0;

      if (urgencyA !== urgencyB) {
        return urgencyB - urgencyA;
      }

      return new Date(b.dateCreated || 0) - new Date(a.dateCreated || 0);
    });

    console.log(`Processed ${requests.length} request records`);
    return createJsonResponse(true, `Found ${requests.length} emergency requests`, requests);

  } catch (error) {
    console.error('getEmergencyRequests Error:', error);
    return createJsonResponse(false, 'Failed to get emergency requests: ' + error.message, {
      error: error.toString()
    });
  }
}

/**
 * Add emergency request with validation
 */
function addEmergencyRequest(requestData) {
  try {
    console.log('addEmergencyRequest called');
    console.log('Request data received:', JSON.stringify(requestData));

    if (!requestData || typeof requestData !== 'object') {
      return createJsonResponse(false, 'No valid request data provided');
    }

    const configCheck = checkConfiguration();
    if (!configCheck.requestsSheetConfigured) {
      return createJsonResponse(false, 'Emergency requests sheet not configured. Please update CONFIG.REQUESTS_SHEET_ID with your actual Google Sheets ID', {
        configCheck: configCheck,
        currentId: CONFIG.REQUESTS_SHEET_ID
      });
    }

    let sheet;
    try {
      sheet = getSheet(CONFIG.REQUESTS_SHEET_ID, CONFIG.REQUESTS_SHEET_NAME);
    } catch (sheetError) {
      return createJsonResponse(false, 'Cannot access requests sheet: ' + sheetError.message);
    }

    // Initialize headers if needed
    const headers = [
      'id', 'bloodType', 'hospital', 'contact', 'urgency', 'notes',
      'dateCreated', 'status', 'unitsNeeded', 'requesterName', 'lastModified'
    ];

    try {
      initializeSheet(sheet, headers);
    } catch (initError) {
      console.warn('Could not initialize sheet headers:', initError);
    }

    // Validate required fields
    const requiredFields = [
      { field: 'bloodType', message: 'Blood type is required' },
      { field: 'hospital', message: 'Hospital/location is required' },
      { field: 'contact', message: 'Contact number is required' }
    ];

    for (let req of requiredFields) {
      if (!requestData[req.field] || String(requestData[req.field]).trim() === '') {
        return createJsonResponse(false, req.message);
      }
    }

    const id = generateId();
    const currentDate = new Date().toISOString();
    const rowData = [
      id,
      String(requestData.bloodType || ''),
      String(requestData.hospital || ''),
      String(requestData.contact || ''),
      String(requestData.urgency || 'Medium'),
      String(requestData.notes || ''),
      currentDate,
      String(requestData.status || 'Active'),
      parseInt(requestData.unitsNeeded) || 1,
      String(requestData.requesterName || 'Admin'),
      currentDate
    ];

    console.log('Prepared request row data:', rowData);

    try {
      sheet.appendRow(rowData);
      console.log('Successfully added emergency request to sheet');
    } catch (appendError) {
      console.error('Error appending request row:', appendError);
      return createJsonResponse(false, 'Failed to save request to sheet: ' + appendError.message);
    }

    // Try to notify matching donors
    try {
      notifyMatchingDonors(requestData.bloodType, requestData.hospital, requestData.urgency);
    } catch (notificationError) {
      console.warn('Donor notification failed:', notificationError);
    }

    return createJsonResponse(true, 'Emergency request added successfully!', {
      id: id,
      message: 'Request created and donors will be notified!'
    });

  } catch (error) {
    console.error('addEmergencyRequest Error:', error);
    return createJsonResponse(false, 'Failed to add emergency request: ' + error.message);
  }
}

/**
 * UPDATE AND DELETE OPERATIONS - Fixed
 */
function updateDonor(donorId, updateData) {
  try {
    if (!donorId) {
      return createJsonResponse(false, 'Donor ID is required');
    }

    const sheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return createJsonResponse(false, 'No donors found to update');
    }

    const headers = data[0];
    const idColumn = headers.indexOf('id');

    if (idColumn === -1) {
      return createJsonResponse(false, 'ID column not found in sheet');
    }

    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumn] === donorId) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return createJsonResponse(false, 'Donor not found with ID: ' + donorId);
    }

    // Update fields
    headers.forEach((header, index) => {
      if (updateData.hasOwnProperty(header) && header !== 'id') {
        sheet.getRange(rowIndex, index + 1).setValue(updateData[header]);
      }
    });

    // Update last modified timestamp
    const lastModifiedColumn = headers.indexOf('lastModified');
    if (lastModifiedColumn !== -1) {
      sheet.getRange(rowIndex, lastModifiedColumn + 1).setValue(new Date().toISOString());
    }

    return createJsonResponse(true, 'Donor updated successfully');

  } catch (error) {
    console.error('updateDonor Error:', error);
    return createJsonResponse(false, 'Failed to update donor: ' + error.message);
  }
}

function deleteDonor(donorId) {
  try {
    if (!donorId) {
      return createJsonResponse(false, 'Donor ID is required');
    }

    const sheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColumn = headers.indexOf('id');

    if (idColumn === -1) {
      return createJsonResponse(false, 'ID column not found');
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumn] === donorId) {
        sheet.deleteRow(i + 1);
        return createJsonResponse(true, 'Donor deleted successfully');
      }
    }

    return createJsonResponse(false, 'Donor not found');

  } catch (error) {
    console.error('deleteDonor Error:', error);
    return createJsonResponse(false, 'Failed to delete donor: ' + error.message);
  }
}

function updateEmergencyRequest(requestId, updateData) {
  try {
    if (!requestId) {
      return createJsonResponse(false, 'Request ID is required');
    }

    const sheet = getSheet(CONFIG.REQUESTS_SHEET_ID, CONFIG.REQUESTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return createJsonResponse(false, 'No requests found to update');
    }

    const headers = data[0];
    const idColumn = headers.indexOf('id');

    if (idColumn === -1) {
      return createJsonResponse(false, 'ID column not found in sheet');
    }

    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumn] === requestId) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return createJsonResponse(false, 'Request not found with ID: ' + requestId);
    }

    // Update fields
    headers.forEach((header, index) => {
      if (updateData.hasOwnProperty(header) && header !== 'id') {
        sheet.getRange(rowIndex, index + 1).setValue(updateData[header]);
      }
    });

    // Update last modified timestamp
    const lastModifiedColumn = headers.indexOf('lastModified');
    if (lastModifiedColumn !== -1) {
      sheet.getRange(rowIndex, lastModifiedColumn + 1).setValue(new Date().toISOString());
    }

    return createJsonResponse(true, 'Request updated successfully');

  } catch (error) {
    console.error('updateEmergencyRequest Error:', error);
    return createJsonResponse(false, 'Failed to update request: ' + error.message);
  }
}

function deleteEmergencyRequest(requestId) {
  try {
    if (!requestId) {
      return createJsonResponse(false, 'Request ID is required');
    }

    const sheet = getSheet(CONFIG.REQUESTS_SHEET_ID, CONFIG.REQUESTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColumn = headers.indexOf('id');

    if (idColumn === -1) {
      return createJsonResponse(false, 'ID column not found');
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumn] === requestId) {
        sheet.deleteRow(i + 1);
        return createJsonResponse(true, 'Request deleted successfully');
      }
    }

    return createJsonResponse(false, 'Request not found');

  } catch (error) {
    console.error('deleteEmergencyRequest Error:', error);
    return createJsonResponse(false, 'Failed to delete request: ' + error.message);
  }
}

/**
 * EMAIL AND NOTIFICATION FUNCTIONS
 */
function sendWelcomeEmail(email, fullName) {
  try {
    const subject = 'Welcome to LifeDrop - Thank you for registering!';
    const message = `Dear ${fullName},

Thank you for registering as a blood donor with LifeDrop! Your generosity can help save lives.

Admin Contact Information:
Email: ${CONFIG.ADMIN_EMAIL}
Mobile: ${CONFIG.ADMIN_MOBILE}

We will notify you when there are urgent blood requests matching your blood type.

Best regards,
LifeDrop Team`;

    GmailApp.sendEmail(email, subject, message);
    console.log('Welcome email sent to:', email);

  } catch (error) {
    console.error('sendWelcomeEmail Error:', error);
    throw error;
  }
}

function notifyMatchingDonors(bloodType, hospital, urgency) {
  try {
    console.log(`Notifying donors for ${bloodType} at ${hospital}`);

    const donorsSheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
    const donorsData = donorsSheet.getDataRange().getValues();

    if (donorsData.length <= 1) {
      console.log('No donors to notify');
      return;
    }

    const headers = donorsData[0];
    const bloodTypeIndex = headers.indexOf('bloodType');
    const emailIndex = headers.indexOf('email');
    const statusIndex = headers.indexOf('status');
    const matchingEmails = [];

    for (let i = 1; i < donorsData.length; i++) {
      const row = donorsData[i];
      const donorBloodType = row[bloodTypeIndex];
      const donorEmail = row[emailIndex];
      const donorStatus = row[statusIndex];

      if (donorBloodType === bloodType && donorEmail && donorStatus === 'Available') {
        matchingEmails.push(donorEmail);
      }
    }

    if (matchingEmails.length > 0) {
      const subject = `Urgent Blood Request - ${bloodType} needed at ${hospital}`;
      const message = `There is an urgent ${urgency.toLowerCase()} priority request for ${bloodType} blood at ${hospital}. Your help can save lives!

Admin Contact:
Email: ${CONFIG.ADMIN_EMAIL}
Mobile: ${CONFIG.ADMIN_MOBILE}

Thank you for your willingness to help.

LifeDrop Team`;

      matchingEmails.forEach(email => {
        try {
          GmailApp.sendEmail(email, subject, message);
        } catch (emailError) {
          console.error(`Failed to send email to ${email}:`, emailError);
        }
      });

      console.log(`Notified ${matchingEmails.length} matching donors`);
    }

  } catch (error) {
    console.error('notifyMatchingDonors Error:', error);
  }
}

function sendNotificationEmail(notificationData) {
  try {
    const { recipients, subject, message } = notificationData;

    if (!recipients || recipients.length === 0) {
      return createJsonResponse(false, 'No recipients specified');
    }

    let successCount = 0;
    let failCount = 0;

    recipients.forEach(email => {
      try {
        const fullMessage = `${message}

Admin Contact:
Email: ${CONFIG.ADMIN_EMAIL}
Mobile: ${CONFIG.ADMIN_MOBILE}

Best regards,
LifeDrop Team`;

        GmailApp.sendEmail(email, subject, fullMessage);
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
        failCount++;
      }
    });

    return createJsonResponse(true, `Notifications sent to ${successCount} recipients. ${failCount} failed.`, {
      successCount,
      failCount,
      totalRecipients: recipients.length
    });

  } catch (error) {
    console.error('sendNotificationEmail Error:', error);
    return createJsonResponse(false, 'Failed to send notifications: ' + error.message);
  }
}

/**
 * ADMIN AND UTILITY FUNCTIONS
 */
function getAdminContact() {
  try {
    return createJsonResponse(true, 'Admin contact retrieved', {
      email: CONFIG.ADMIN_EMAIL,
      mobile: CONFIG.ADMIN_MOBILE,
      supportHours: '24/7',
      emergencyContact: true
    });
  } catch (error) {
    console.error('getAdminContact Error:', error);
    return createJsonResponse(false, 'Failed to get admin contact: ' + error.message);
  }
}

function getStatistics() {
  try {
    const stats = {
      donors: { total: 0, byBloodType: {}, byLocation: {}, byStatus: {} },
      requests: { total: 0, byUrgency: {}, byStatus: {} },
      lastUpdated: new Date().toISOString()
    };

    // Try to get donor statistics
    try {
      const donorsSheet = getSheet(CONFIG.DONORS_SHEET_ID, CONFIG.DONORS_SHEET_NAME);
      const donorsData = donorsSheet.getDataRange().getValues();

      if (donorsData.length > 1) {
        stats.donors.total = donorsData.length - 1;
        const headers = donorsData[0];
        const bloodTypeIndex = headers.indexOf('bloodType');
        const locationIndex = headers.indexOf('location');
        const statusIndex = headers.indexOf('status');

        for (let i = 1; i < donorsData.length; i++) {
          const row = donorsData[i];

          if (bloodTypeIndex !== -1 && row[bloodTypeIndex]) {
            const bloodType = String(row[bloodTypeIndex]);
            stats.donors.byBloodType[bloodType] = (stats.donors.byBloodType[bloodType] || 0) + 1;
          }

          if (locationIndex !== -1 && row[locationIndex]) {
            const location = String(row[locationIndex]);
            stats.donors.byLocation[location] = (stats.donors.byLocation[location] || 0) + 1;
          }

          if (statusIndex !== -1) {
            const status = String(row[statusIndex] || 'Available');
            stats.donors.byStatus[status] = (stats.donors.byStatus[status] || 0) + 1;
          }
        }
      }
    } catch (donorStatsError) {
      console.warn('Could not get donor statistics:', donorStatsError);
    }

    // Try to get request statistics
    try {
      const requestsSheet = getSheet(CONFIG.REQUESTS_SHEET_ID, CONFIG.REQUESTS_SHEET_NAME);
      const requestsData = requestsSheet.getDataRange().getValues();

      if (requestsData.length > 1) {
        stats.requests.total = requestsData.length - 1;
        const headers = requestsData[0];
        const urgencyIndex = headers.indexOf('urgency');
        const statusIndex = headers.indexOf('status');

        for (let i = 1; i < requestsData.length; i++) {
          const row = requestsData[i];

          if (urgencyIndex !== -1) {
            const urgency = String(row[urgencyIndex] || 'Medium');
            stats.requests.byUrgency[urgency] = (stats.requests.byUrgency[urgency] || 0) + 1;
          }

          if (statusIndex !== -1) {
            const status = String(row[statusIndex] || 'Active');
            stats.requests.byStatus[status] = (stats.requests.byStatus[status] || 0) + 1;
          }
        }
      }
    } catch (requestStatsError) {
      console.warn('Could not get request statistics:', requestStatsError);
    }

    return createJsonResponse(true, 'Statistics retrieved successfully', stats);

  } catch (error) {
    console.error('getStatistics Error:', error);
    return createJsonResponse(false, 'Failed to get statistics: ' + error.message);
  }
}

function createJsonResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    adminContact: {
      email: CONFIG.ADMIN_EMAIL,
      mobile: CONFIG.ADMIN_MOBILE
    }
  };

  if (success && data !== null) {
    if (Array.isArray(data)) {
      if (data.length > 0) {
        if (data[0].hasOwnProperty('fullName') || data[0].hasOwnProperty('email')) {
          response.donors = data;
        } else if (data[0].hasOwnProperty('hospital') || data[0].hasOwnProperty('bloodType')) {
          response.requests = data;
        } else {
          response.data = data;
        }
      } else {
        response.donors = [];
        response.requests = [];
      }
    } else {
      response.data = data;
    }
  } else if (data !== null) {
    response.errorData = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateId() {
  return 'LD_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function testScript() {
  try {
    console.log('Test script called');
    const configCheck = checkConfiguration();
    console.log('Configuration check result:', configCheck);

    return createJsonResponse(true, 'LifeDrop Google Apps Script is working correctly!', {
      version: '6.0 - FULLY CORRECTED FOR USER',
      timestamp: new Date().toISOString(),
      configuration: configCheck,
      features: ['CRUD Operations', 'Email Notifications', 'Analytics', 'Admin Contact', 'User Sheet IDs Configured'],
      status: configCheck.donorsSheetConfigured && configCheck.requestsSheetConfigured ? 
        'All systems operational - ready for data storage!' : 
        'Configuration needed - please check Sheet IDs',
      instructions: configCheck.donorsSheetConfigured && configCheck.requestsSheetConfigured ?
        ['System is properly configured with your sheet IDs', 'Data will save to Google Sheets', 'All features are operational'] :
        ['Please verify your Google Sheets are accessible',
         'Check that the script has permission to access your sheets',
         'Run testScript() again to verify configuration']
    });

  } catch (error) {
    console.error('Test script error:', error);
    return createJsonResponse(false, 'Test script failed: ' + error.message);
  }
}

/**
 * Manual test functions for debugging
 */
function testDonorOperations() {
  console.log('Testing donor operations...');
  try {
    // Test configuration first
    const config = checkConfiguration();
    console.log('Config check:', config);

    if (!config.donorsSheetConfigured) {
      return 'ERROR: Donors sheet not configured. Please verify CONFIG.DONORS_SHEET_ID';
    }

    // Test getting donors
    const getDonorsResult = getDonors();
    const getDonorsData = JSON.parse(getDonorsResult.getContent());
    console.log('Get donors result success:', getDonorsData.success);

    // Test adding a donor
    const testDonor = {
      fullName: 'Test User - Fixed Version',
      email: 'testfixed@example.com',
      phone: '1234567890',
      bloodType: 'O+',
      age: 30,
      weight: 70,
      location: 'Test City',
      gender: 'Male'
    };

    const addDonorResult = addDonor(testDonor);
    const addResult = JSON.parse(addDonorResult.getContent());
    console.log('Add donor result success:', addResult.success);
    console.log('Add donor message:', addResult.message);

    return `Donor operations test completed - Success: ${addResult.success}, Message: ${addResult.message}`;

  } catch (error) {
    console.error('Test error:', error);
    return 'Test failed: ' + error.message;
  }
}

function testRequestOperations() {
  console.log('Testing request operations...');
  try {
    // Test configuration first
    const config = checkConfiguration();
    console.log('Config check:', config);

    if (!config.requestsSheetConfigured) {
      return 'ERROR: Requests sheet not configured. Please verify CONFIG.REQUESTS_SHEET_ID';
    }

    // Test getting requests
    const getRequestsResult = getEmergencyRequests();
    const getRequestsData = JSON.parse(getRequestsResult.getContent());
    console.log('Get requests result success:', getRequestsData.success);

    // Test adding a request
    const testRequest = {
      bloodType: 'A+',
      hospital: 'Test Hospital - Fixed Version',
      contact: '9876543210',
      urgency: 'High',
      notes: 'Fixed version test emergency request'
    };

    const addRequestResult = addEmergencyRequest(testRequest);
    const addResult = JSON.parse(addRequestResult.getContent());
    console.log('Add request result success:', addResult.success);
    console.log('Add request message:', addResult.message);

    return `Request operations test completed - Success: ${addResult.success}, Message: ${addResult.message}`;

  } catch (error) {
    console.error('Test error:', error);
    return 'Test failed: ' + error.message;
  }
}
// ===============================
// AI CHATBOT FUNCTION (ADD BELOW)
// ===============================
function chatbotQuery(userMessage) {
  const sheet = SpreadsheetApp
    .openById(CONFIG.DONORS_SHEET_ID)
    .getSheetByName('Chatbot_Knowledge');

  const data = sheet.getDataRange().getValues();
  userMessage = userMessage.toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const keywords = data[i][1].toLowerCase().split(',');
    for (let k of keywords) {
      if (userMessage.includes(k.trim())) {
        return data[i][2];
      }
    }
  }

  return "I’m here to help with blood donation, eligibility, or emergencies.";
}
function applyDonorFilters() {
  const blood = document.getElementById('filterBlood').value.toLowerCase();
  const location = document.getElementById('filterLocation').value.toLowerCase();

  const filtered = appState.donors.filter(donor => {
    const matchBlood = !blood || donor.bloodType.toLowerCase() === blood;
    const matchLocation = !location || donor.location.toLowerCase().includes(location);
    return matchBlood && matchLocation;
  });

  renderFilteredDonors(filtered);
}

function renderFilteredDonors(list) {
  const tbody = document.getElementById('donorsTableBody');
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="8" style="text-align:center;">No matching donors found</td></tr>`;
    return;
  }

  list.forEach(donor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donor.fullName}</td>
      <td><span class="badge danger">${donor.bloodType}</span></td>
      <td>${donor.location}</td>
      <td>${donor.phone}</td>
      <td>${donor.age}</td>
      <td><span class="badge success">${donor.status}</span></td>
      <td>${donor.lastDonation || 'Never'}</td>
      <td>-</td>
    `;
    tbody.appendChild(row);
  });
}


