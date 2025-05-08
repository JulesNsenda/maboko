import React, { useState, useEffect } from 'react';
import { GetInventoryUseCase } from '../application/useCases/GetInventoryUseCase';
import { AddInventoryUseCase } from '../application/useCases/AddInventoryUseCase';
import { FirebaseInventoryRepository } from '../infrastructure/firebase/FirebaseInventoryRepository';
import { LocalStorageInventoryRepository } from '../infrastructure/localStorage/LocalStorageInventoryRepository';
import type { InventoryItem } from '../domain/entities/InventoryItem';
import { type Language } from '../shared/types';

// Dependency Injection
const firebaseRepo = new FirebaseInventoryRepository();
const localRepo = new LocalStorageInventoryRepository();
const getInventoryUseCase = new GetInventoryUseCase(navigator.onLine ? firebaseRepo : localRepo);
const addInventoryUseCase = new AddInventoryUseCase(navigator.onLine ? firebaseRepo : localRepo);

interface InventoryProps {
    userId: string;
    language: Language;
}

const Inventory: React.FC<InventoryProps> = ({ userId, language }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        getInventoryUseCase.execute(userId).then(setInventory);
    }, [userId]);

    const texts = {
        fr: {
            title: 'Inventaire',
            item: 'Article',
            quantity: 'Quantité',
            price: 'Prix unitaire',
            add: 'Ajouter',
            error: 'Erreur lors de l’ajout de l’article.',
        },
        en: {
            title: 'Inventory',
            item: 'Item',
            quantity: 'Quantity',
            price: 'Price',
            add: 'Add',
            error: 'Error adding article.',
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const inventoryItem: InventoryItem = {
                item,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                userId,
            };
            await addInventoryUseCase.execute(inventoryItem);
            setInventory([...inventory, { ...inventoryItem, id: Date.now().toString() }]);
            setItem('');
            setQuantity('');
            setPrice('');
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
                    value={item}
                    onChange={e => setItem(e.target.value)}
                    placeholder={texts[language].item}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder={texts[language].quantity}
                    className="border p-2 mr-2"
                    required
                />
                <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder={texts[language].price}
                    className="border p-2 mr-2"
                    step="0.01"
                    required
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {texts[language].add}
                </button>
            </form>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">{texts[language].item}</th>
                        <th className="p-2">{texts[language].quantity}</th>
                        <th className="p-2">{texts[language].price}</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(i => (
                        <tr key={i.id}>
                            <td className="p-2">{i.item}</td>
                            <td className="p-2">{i.quantity}</td>
                            <td className="p-2">{i.price} USD</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;