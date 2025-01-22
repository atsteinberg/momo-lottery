import { GoogleSpreadsheet } from 'google-spreadsheet';
import { google } from 'googleapis';
import { getGoogleServiceAccountKey } from './google-sheets.utils';

type GlobalThis = {
  googleSpreadSheet: GoogleSpreadsheet | null;
  isLoading: boolean;
};

const globalThis: GlobalThis = { googleSpreadSheet: null, isLoading: false };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSpreadSheetDoc = async () => {
  if (globalThis.googleSpreadSheet) {
    while (globalThis.isLoading) {
      await sleep(100);
    }
    return globalThis.googleSpreadSheet;
  }
  try {
    globalThis.isLoading = true;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID is not set');
    }
    const auth = new google.auth.GoogleAuth({
      credentials: getGoogleServiceAccountKey(),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const spreadSheet = new GoogleSpreadsheet(spreadsheetId, auth);
    globalThis.googleSpreadSheet = spreadSheet;
    await spreadSheet.loadInfo();
    return spreadSheet;
  } finally {
    globalThis.isLoading = false;
  }
};

export default getSpreadSheetDoc;
