import React, { useState } from 'react';
import { EmailService } from '../infrastructure/external/EmailService';
import type { Language } from '../shared/types';

const emailService = new EmailService();

type PaymentProvider = 'airtel' | 'orange' | 'mpesa';

interface PaymentProps {
    userId: string;
    language: Language;
}

const Payment: React.FC<PaymentProps> = ({ language }) => {
    const [provider, setProvider] = useState<PaymentProvider>('airtel');
    const [ref, setRef] = useState('');
    const [email, setEmail] = useState('');

    const instructions = {
        airtel: language === 'fr' ? 'Envoyez 39$ via Airtel Money au +243 99 123 4567. Notez la référence de transaction.' : 'Send $39 through Airtel Money to +243 99 123 4567. Jot down the transaction reference.',
        orange: language === 'fr' ? 'Envoyez 39$ via Orange Money au +243 84 123 4567. Notez la référence de transaction.' : 'Send $39 through Orange Money to +243 84 123 4567. Jot down the transaction reference.',
        mpesa: language === 'fr' ? 'Envoyez 39$ via M-Pesa au +243 81 123 4567. Notez la référence de transaction.' : 'Send $39 through M-Pesa to +243 81 123 4567. Jot down the transaction reference.',
    };

    const texts = {
        fr: {
            title: 'Paiement - 39$ (Onboarding)',
            refPlaceholder: 'Référence de Transaction',
            emailPlaceholder: 'Email pour livraison',
            confirm: 'Confirmer Paiement',
            success: 'Paiement confirmé ! Vous recevrez l’accès par email.',
            error: 'Erreur : ',
            support: 'Support',
        },
        en: {
            title: 'Payment - $39 (Onboarding)',
            refPlaceholder: 'Transaction Reference',
            emailPlaceholder: 'Delivery Email',
            confirm: 'Confirm Payment',
            success: 'Payment confirmed! You will receive access via email.',
            error: 'Error: ',
            support: 'Support',
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await emailService.sendPaymentConfirmation(ref, email);
            alert(texts[language].success);
        } catch (error: any) {
            alert(texts[language].error + error.message);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{texts[language].title}</h2>
            <select
                value={provider}
                onChange={e => setProvider(e.target.value as PaymentProvider)}
                className="border p-2 mb-4"
            >
                <option value="airtel">Airtel Money</option>
                <option value="orange">Orange Money</option>
                <option value="mpesa">Vodacom M-Pesa</option>
            </select>
            <p className="mb-4">{instructions[provider]}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={ref}
                    onChange={e => setRef(e.target.value)}
                    placeholder={texts[language].refPlaceholder}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={texts[language].emailPlaceholder}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {texts[language].confirm}
                </button>
            </form>
            <p className="mt-4">
                {texts[language].support}: <a href="https://wa.me/27734412228" className="text-blue-500">+27 73 441 2228</a>
            </p>
        </div>
    );
};

export default Payment;