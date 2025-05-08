import React, { useState, useEffect } from 'react';
import type { Transaction } from '../domain/entities/Transaction';
import { AddTransactionUseCase } from '../application/useCases/AddTransactionUseCase';
import { GetTransactionsUseCase } from '../application/useCases/GetTransactionsUseCase';
import { FirebaseTransactionRepository } from '../infrastructure/firebase/FirebaseTransactionRepository';
import { LocalStorageTransactionRepository } from '../infrastructure/localStorage/LocalStorageTransactionRepository';
import type { Language } from '../shared/types';

// Dependency Injection
const firebaseRepo = new FirebaseTransactionRepository();
const localRepo = new LocalStorageTransactionRepository();
const addTransactionUseCase = new AddTransactionUseCase(navigator.onLine ? firebaseRepo : localRepo);
const getTransactionsUseCase = new GetTransactionsUseCase(navigator.onLine ? firebaseRepo : localRepo);

interface TransactionsProps {
    userId: string;
    language: Language;
}

const Transactions: React.FC<TransactionsProps> = ({ userId, language }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [date, setDate] = useState('');
    const [type, setType] = useState<'revenue' | 'expense'>('revenue');
    const [amount, setAmount] = useState('');
    const [desc, setDescription] = useState('');

    useEffect(() => {
        getTransactionsUseCase.execute(userId).then(setTransactions);
    }, [userId]);

    const texts = {
        fr: {
            title: 'Transactions',
            date: 'Date',
            type: 'Type',
            revenue: 'Revenu',
            expense: 'Dépense',
            amount: 'Montant',
            description: 'Description',
            add: 'Ajouter',
            error: 'Erreur lors de l’ajout de la transaction.',
        },
        en: {
            title: 'Transactions',
            date: 'Date',
            type: 'Type',
            revenue: 'Revenue',
            expense: 'Expense',
            amount: 'Amount',
            description: 'Description',
            add: 'Add',
            error: 'Error adding transaction.',
        },
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const transaction: Transaction = { date, type, amount: parseFloat(amount), desc, userId };
            await addTransactionUseCase.execute(transaction);
            setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
            (e.target as HTMLFormElement).reset();
            setDate('');
            setType('revenue');
            setAmount('');
            setDescription('');
        } catch (error: any) {
            alert(texts[language].error + (error.message || ''));
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{texts[language].title}</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="border p-2 mr-2"
                    required
                />
                <select
                    value={type}
                    onChange={e => setType(e.target.value as 'revenue' | 'expense')}
                    className="border p-2 mr-2"
                    required
                >
                    <option value="revenue">{texts[language].revenue}</option>
                    <option value="expense">{texts[language].expense}</option>
                </select>
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder={texts[language].amount}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="text"
                    value={desc}
                    onChange={e => setDescription(e.target.value)}
                    placeholder={texts[language].description}
                    className="border p-2 mr-2"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {texts[language].add}
                </button>
            </form>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">{texts[language].date}</th>
                        <th className="p-2">{texts[language].type}</th>
                        <th className="p-2">{texts[language].amount}</th>
                        <th className="p-2">{texts[language].description}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.id}>
                            <td className="p-2">{t.date}</td>
                            <td className="p-2">{texts[language][t.type]}</td>
                            <td className="p-2">{t.amount}</td>
                            <td className="p-2">{t.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;