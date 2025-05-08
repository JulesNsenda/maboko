import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { GetTransactionsUseCase } from '../application/useCases/GetTransactionsUseCase';
import { GetCustomersUseCase } from '../application/useCases/GetCustomersUseCase';
import { GetInventoryUseCase } from '../application/useCases/GetInventoryUseCase';
import { FirebaseTransactionRepository } from '../infrastructure/firebase/FirebaseTransactionRepository';
import { FirebaseCustomerRepository } from '../infrastructure/firebase/FirebaseCustomerRepository';
import { FirebaseInventoryRepository } from '../infrastructure/firebase/FirebaseInventoryRepository';
import { LocalStorageTransactionRepository } from '../infrastructure/localStorage/LocalStorageTransactionRepository';
import { LocalStorageCustomerRepository } from '../infrastructure/localStorage/LocalStorageCustomerRepository';
import { LocalStorageInventoryRepository } from '../infrastructure/localStorage/LocalStorageInventoryRepository';
import type { Transaction } from '../domain/entities/Transaction';
import type { Customer } from '../domain/entities/Customer';
import type { InventoryItem } from '../domain/entities/InventoryItem';
import type { Language } from '../shared/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dependency Injection
const firebaseTransactionRepo = new FirebaseTransactionRepository();
const firebaseCustomerRepo = new FirebaseCustomerRepository();
const firebaseInventoryRepo = new FirebaseInventoryRepository();
const localTransactionRepo = new LocalStorageTransactionRepository();
const localCustomerRepo = new LocalStorageCustomerRepository();
const localInventoryRepo = new LocalStorageInventoryRepository();

const getTransactionsUseCase = new GetTransactionsUseCase(navigator.onLine ? firebaseTransactionRepo : localTransactionRepo);
const getCustomersUseCase = new GetCustomersUseCase(navigator.onLine ? firebaseCustomerRepo : localCustomerRepo);
const getInventoryUseCase = new GetInventoryUseCase(navigator.onLine ? firebaseInventoryRepo : localInventoryRepo);

interface DashboardProps {
    userId: string;
    language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, language }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        getTransactionsUseCase.execute(userId).then(setTransactions);
        getCustomersUseCase.execute(userId).then(setCustomers);
        getInventoryUseCase.execute(userId).then(setInventory);
    }, [userId]);

    const texts = {
        fr: {
            title: 'Tableau de bord',
            transactions: 'Résumé des Transactions',
            customers: 'Nombre de Clients',
            inventory: 'Valeur de l’Inventaire',
        },
        en: {
            title: 'Dashboard',
            transactions: 'Transactions Summary',
            customers: 'Number of Clients',
            inventory: 'Inventory Value',
        },
    };

    const transactionData = {
        labels: ['Revenus', 'Dépenses'],
        datasets: [
            {
                label: texts[language].transactions,
                data: [
                    transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0),
                    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
                ],
                backgroundColor: ['#00b4d8', '#ff6b6b'],
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{texts[language].title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{texts[language].transactions}</h3>
                    <Bar data={transactionData} options={{ responsive: true }} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{texts[language].customers}</h3>
                    <p className="text-3xl font-bold">{customers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{texts[language].inventory}</h3>
                    <p className="text-3xl font-bold">
                        {inventory.reduce((sum, item) => sum + item.quantity * item.price, 0)} USD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;