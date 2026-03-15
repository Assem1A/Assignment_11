import nodemailer from "nodemailer";
import { APP, EMAIL_APP, MY_FIRST_APP_PASSWORD } from "../../../config/config.service.js";

export const sendEmail = async (to, cc, bcc, subject, html, attachments = []) => {
    console.log(EMAIL_APP);
console.log(MY_FIRST_APP_PASSWORD);
    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_APP,
            pass: MY_FIRST_APP_PASSWORD
        },
    });

    // Send an email using async/await

    const info = await transporter.sendMail({
        to, subject, cc, bcc, attachments, html,
        from: `${APP} <${EMAIL_APP}>`,

    });

    console.log("Message sent:", info.messageId);

}