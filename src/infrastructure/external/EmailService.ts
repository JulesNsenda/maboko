import emailjs from '@emailjs/browser';
import type { Language } from '../../shared/types';

export class EmailService {
    constructor() {
        emailjs.init('Jules'); // Replace with your EmailJS User ID
    }

    async sendPaymentConfirmation(ref: string, email: string): Promise<void> {
        try {
            await emailjs.send(
                'service_qpap809', // Replace with your EmailJS Service ID
                'template_so6nwv8', // Replace with your EmailJS Payment Template ID
                { ref, email }
            );
        } catch (error: any) {
            throw new Error(`Failed to send payment email: ${error.message || String(error)}`);
        }
    }

    async sendWelcomeEmail(name: string, email: string, language: Language): Promise<void> {
        try {
            const templateId = language === 'fr' ? 'template_g824viq' : 'template_67890'; // Replace with your English Welcome Template ID
            await emailjs.send(
                'service_qpap809', // Replace with your EmailJS Service ID
                templateId,
                { name, email }
            );
        } catch (error: any) {
            throw new Error(`Failed to send welcome email: ${error.message || String(error)}`);
        }
    }
}