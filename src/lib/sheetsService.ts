import { LoanApplication, ConsultationApplication } from '../types';

/**
 * Extracts the Google Spreadsheet ID from a standard Google Sheets URL,
 * or returns the string directly if it is already an ID.
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.includes('docs.google.com/spreadsheets')) {
    const matches = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  return trimmed;
}

/**
 * Searches for an existing Google Spreadsheet named "KML Finance Loan Enquiries".
 * If not found, creates a new spreadsheet and adds a header row.
 * Finally, appends the loan application details as a new row.
 */
export async function saveLoanApplicationToSheets(
  application: LoanApplication,
  accessToken: string,
  spreadsheetIdOrUrl?: string
): Promise<{ spreadsheetId: string; webViewLink?: string }> {
  if (!accessToken) {
    throw new Error('Access token is required to save to Google Sheets');
  }

  let spreadsheetId = '';
  let webViewLink = '';

  const explicitId = extractSpreadsheetId(spreadsheetIdOrUrl || '');

  if (explicitId) {
    spreadsheetId = explicitId;
    webViewLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  } else {
    // 1. Search for the spreadsheet in Google Drive (fuzzy match to handle any minor name/spacing variations)
    const query = encodeURIComponent(
      "mimeType = 'application/vnd.google-apps.spreadsheet' and name contains 'KML' and (name contains 'Loan' or name contains 'loan') and trashed = false"
    );
    
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      const errorBody = await searchResponse.text();
      console.error('Drive search failed:', errorBody);
      throw new Error(`Failed to search for Google Sheet: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      spreadsheetId = searchData.files[0].id;
      webViewLink = searchData.files[0].webViewLink;
    } else {
      // 2. Spreadsheet not found. Create a new one.
      const createUrl = 'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink';
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'KML_Finance_Loan_Enquiries',
          mimeType: 'application/vnd.google-apps.spreadsheet',
        }),
      });

      if (!createResponse.ok) {
        const errorBody = await createResponse.text();
        console.error('Drive file creation failed:', errorBody);
        throw new Error(`Failed to create a new Google Sheet: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      spreadsheetId = createData.id;
      webViewLink = createData.webViewLink;

      // 3. Initialize new spreadsheet with header row
      const appendHeaderUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:G:append?valueInputOption=USER_ENTERED`;
      const headerResponse = await fetch(appendHeaderUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: 'A:G',
          majorDimension: 'ROWS',
          values: [
            ['Name', 'Age', 'Contact Number', 'Occupation', 'Loan Type', 'Monthly Income (₹)', 'Enquiry Date'],
          ],
        }),
      });

      if (!headerResponse.ok) {
        const errorBody = await headerResponse.text();
        console.error('Writing headers failed:', errorBody);
        // We don't throw here so we can still try to append the data row
      }
    }
  }

  // 4. Append the application details as a new row
  const appendDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:G:append?valueInputOption=USER_ENTERED`;
  const dataRow = [
    application.name,
    application.age,
    application.contactNo,
    application.occupation,
    application.loanType,
    application.income,
    application.enquiredDate,
  ];

  const appendResponse = await fetch(appendDataUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'A:G',
      majorDimension: 'ROWS',
      values: [dataRow],
    }),
  });

  if (!appendResponse.ok) {
    const errorBody = await appendResponse.text();
    console.error('Appending application failed:', errorBody);
    throw new Error(`Failed to save application data to Google Sheet: ${appendResponse.statusText}`);
  }

  return { spreadsheetId, webViewLink };
}

/**
 * Searches for an existing Google Spreadsheet named "KML Finance Consultations".
 * If not found, creates a new spreadsheet and adds a header row.
 * Finally, appends the consultation details as a new row.
 */
export async function saveConsultationToSheets(
  consultation: ConsultationApplication,
  accessToken: string,
  spreadsheetIdOrUrl?: string
): Promise<{ spreadsheetId: string; webViewLink?: string }> {
  if (!accessToken) {
    throw new Error('Access token is required to save to Google Sheets');
  }

  let spreadsheetId = '';
  let webViewLink = '';

  const explicitId = extractSpreadsheetId(spreadsheetIdOrUrl || '');

  if (explicitId) {
    spreadsheetId = explicitId;
    webViewLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  } else {
    // 1. Search for the spreadsheet in Google Drive (fuzzy match to handle any minor name/spacing variations)
    const query = encodeURIComponent(
      "mimeType = 'application/vnd.google-apps.spreadsheet' and name contains 'KML' and (name contains 'Consult' or name contains 'consult' or name contains 'consul') and trashed = false"
    );
    
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      const errorBody = await searchResponse.text();
      console.error('Drive search failed:', errorBody);
      throw new Error(`Failed to search for Google Sheet: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      spreadsheetId = searchData.files[0].id;
      webViewLink = searchData.files[0].webViewLink;
    } else {
      // 2. Spreadsheet not found. Create a new one.
      const createUrl = 'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink';
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'KML_Finance_Consultations',
          mimeType: 'application/vnd.google-apps.spreadsheet',
        }),
      });

      if (!createResponse.ok) {
        const errorBody = await createResponse.text();
        console.error('Drive file creation failed:', errorBody);
        throw new Error(`Failed to create a new Google Sheet: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      spreadsheetId = createData.id;
      webViewLink = createData.webViewLink;

      // 3. Initialize new spreadsheet with header row
      const appendHeaderUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:E:append?valueInputOption=USER_ENTERED`;
      const headerResponse = await fetch(appendHeaderUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: 'A:E',
          majorDimension: 'ROWS',
          values: [
            ['Name', 'Phone Number', 'Service Required', 'City', 'Enquiry Date'],
          ],
        }),
      });

      if (!headerResponse.ok) {
        const errorBody = await headerResponse.text();
        console.error('Writing headers failed:', errorBody);
      }
    }
  }

  // 4. Append the consultation details as a new row
  const appendDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:E:append?valueInputOption=USER_ENTERED`;
  const dataRow = [
    consultation.name,
    consultation.phone,
    consultation.service || 'General',
    consultation.city || 'N/A',
    consultation.enquiredDate,
  ];

  const appendResponse = await fetch(appendDataUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'A:E',
      majorDimension: 'ROWS',
      values: [dataRow],
    }),
  });

  if (!appendResponse.ok) {
    const errorBody = await appendResponse.text();
    console.error('Appending consultation failed:', errorBody);
    throw new Error(`Failed to save consultation details to Google Sheet: ${appendResponse.statusText}`);
  }

  return { spreadsheetId, webViewLink };
}

/**
 * Sends data to a custom Google Apps Script Web App URL.
 * This bypasses client-side OAuth requirements by delegating spreadsheet append operations
 * directly to a secure, developer-owned Apps Script macro.
 */
export async function saveToGoogleAppsScript(
  type: 'loan' | 'consultation',
  data: any,
  scriptUrl: string
): Promise<any> {
  if (!scriptUrl) {
    throw new Error('Google Apps Script Web App URL is required');
  }

  const targetUrl = scriptUrl.trim();
  
  // Strict URL checks to prevent silent failure from copying the wrong URL
  if (targetUrl.includes('/edit') || targetUrl.includes('/home')) {
    throw new Error("Invalid Google Script URL! You pasted the Google Script Editor link. Please copy the 'Web App URL' ending with '/exec' from the deploy window and paste it into Sheets Admin Settings.");
  }
  if (!targetUrl.startsWith('https://script.google.com/')) {
    throw new Error("Invalid Google Script URL! The URL must start with 'https://script.google.com/'. Please check and paste the correct Web App URL ending with '/exec'.");
  }

  // Build the payload
  const payload = JSON.stringify({
    type,
    data
  });

  try {
    // Attempt standard CORS fetch first to get direct status feedback
    const response = await fetch(targetUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    if (response.ok) {
      try {
        const resData = await response.json();
        if (resData && resData.status === 'error') {
          throw new Error(resData.message || 'Error occurred inside Google Apps Script');
        }
        return resData || { status: 'success' };
      } catch (jsonErr) {
        return { status: 'success', note: 'Data sent successfully.' };
      }
    } else {
      throw new Error(`Google Web App returned error status ${response.status}: ${response.statusText}`);
    }
  } catch (error: any) {
    console.warn("CORS fetch failed or returned error, attempting fallback via no-cors:", error);
    
    // Check if it's a browser TypeError (which covers CORS preflight errors or network blocks)
    const isTypeError = error instanceof TypeError || error.message?.includes('Failed to fetch');
    
    if (isTypeError) {
      try {
        // Fall back to no-cors mode to bypass CORS checks. Even if the browser cannot read the response,
        // Google Sheets can still process and save the data.
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: payload,
        });

        return { 
          status: 'success', 
          note: 'Sent via fallback channel. Please check your sheet to verify the update.' 
        };
      } catch (fallbackError: any) {
        throw new Error(
          "Failed to connect to your Google Web App (Failed to fetch).\n\n" +
          "1. Your Web App has not been deployed with 'Who has access: Anyone'. Please redeploy and select 'Anyone' so website visitors can submit data.\n" +
          "2. You pasted the wrong URL. Please make sure the URL ends with '/exec', not '/edit'."
        );
      }
    }
    
    throw error;
  }
}


