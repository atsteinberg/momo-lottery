function isValidBase64(str: string) {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch {
    return false;
  }
}

export function getGoogleServiceAccountKey() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!base64Key) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not set');
  }

  if (!isValidBase64(base64Key)) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not a valid Base64 string',
    );
  }

  try {
    const decoded = Buffer.from(base64Key, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse Google service account key: ${error.message}`,
      );
    }
  }
}
