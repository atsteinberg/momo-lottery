import sgMail from '@sendgrid/mail';

const sender = process.env.SENDGRID_VERIFIED_EMAIL;
const apiKey = process.env.SENDGRID_API_KEY;

export async function sendEmail(
  msg: Omit<sgMail.MailDataRequired, 'from'> &
    ({ text: string } | { html: string }),
) {
  if (!sender || !apiKey) {
    throw new Error(
      'SENDGRID_VERIFIED_EMAIL or SENDGRID_API_KEY is not defined',
    );
  }

  try {
    sgMail.setApiKey(apiKey);
    const response = await sgMail.send({ from: sender, ...msg });
    console.log('SendGrid response:', response);
    return response;
  } catch (error) {
    console.error('SendGrid error details:', error);
    throw error;
  }
}
