import sgMail from '@sendgrid/mail';

export async function sendEmail(msg: sgMail.MailDataRequired) {
  console.log('Attempting to send email with config:', {
    apiKeyExists: !!process.env.SENDGRID_API_KEY,
    to: msg.to,
    from: msg.from,
  });

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
    const response = await sgMail.send(msg);
    console.log('SendGrid response:', response);
    return response;
  } catch (error) {
    console.error('SendGrid error details:', error);
    throw error;
  }
}
