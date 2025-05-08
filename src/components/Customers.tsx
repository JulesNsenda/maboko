import React, { useState, useEffect } from 'react';
import { GetCustomersUseCase } from '../application/useCases/GetCustomersUseCase';
import { AddCustomerUseCase } from '../application/useCases/AddCustomerUseCase';
import { FirebaseCustomerRepository } from '../infrastructure/firebase/FirebaseCustomerRepository';
import { LocalStorageCustomerRepository } from '../infrastructure/localStorage/LocalStorageCustomerRepository';
import type { Customer } from '../domain/entities/Customer';
import type { Language } from '../shared/types';

// Dependency Injection
const firebaseRepo = new FirebaseCustomerRepository();
const localRepo = new LocalStorageCustomerRepository();
const getCustomersUseCase = new GetCustomersUseCase(navigator.onLine ? firebaseRepo : localRepo);
const addCustomerUseCase = new AddCustomerUseCase(navigator.onLine ? firebaseRepo : localRepo);

interface CustomersProps {
    userId: string;
    language: Language;
}

const Customers: React.FC<CustomersProps> = ({ userId, language }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        getCustomersUseCase.execute(userId).then(setCustomers);
    }, [userId]);

    const texts = {
        fr: {
            title: 'Clients',
            name: 'Nom',
            phone: 'Téléphone',
            email: 'Email',
            add: 'Ajouter',
            error: 'Erreur lors de l’ajout du client.',
        },
        en: {
            title: 'Customers',
            name: 'Name',
            phone: 'Cellphone',
            email: 'Email',
            add: 'Add',
            error: 'Error adding client.',
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const customer: Customer = { name, phone, email, userId };
            await addCustomerUseCase.execute(customer);
            setCustomers([...customers, { ...customer, id: Date.now().toString() }]);
            setName('');
            setPhone('');
            setEmail('');
        } catch (error) {
            alert(texts[language].error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">{texts[language].title}</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={texts[language].name}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={texts[language].phone}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={texts[language].email}
                    className="border p-2 mr-2"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {texts[language].add}
                </button>
            </form>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">{texts[language].name}</th>
                        <th className="p-2">{texts[language].phone}</th>
                        <th className="p-2">{texts[language].email}</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <tr key={c.id}>
                            <td className="p-2">{c.name}</td>
                            <td className="p-2">{c.phone}</td>
                            <td className="p-2">{c.email || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Customers;