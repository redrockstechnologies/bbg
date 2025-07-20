
import nodemailer from 'nodemailer';

interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
  arrivalDate?: string;
  departureDate?: string;
  enquiryItems?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  async sendContactNotification(contactMessage: ContactMessage) {
    const { name, email, phone, message, arrivalDate, departureDate, enquiryItems } = contactMessage;

    const htmlContent = `
      <h2>New Contact Message - Ballito Baby Gear</h2>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; font-family: Arial, sans-serif;">
        <h3>Contact Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        ${arrivalDate ? `<p><strong>Arrival Date:</strong> ${arrivalDate}</p>` : ''}
        ${departureDate ? `<p><strong>Departure Date:</strong> ${departureDate}</p>` : ''}
        
        <h3>Message:</h3>
        <div style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        ${enquiryItems ? `
          <h3>Enquiry Items:</h3>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #2196F3;">
            ${enquiryItems.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This message was sent through the Ballito Baby Gear contact form.
          You can reply directly to the customer at: ${email}
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Message from ${name} - Ballito Baby Gear`,
      html: htmlContent,
      replyTo: email
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Contact notification email sent successfully');
    } catch (error) {
      console.error('Error sending contact notification email:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
