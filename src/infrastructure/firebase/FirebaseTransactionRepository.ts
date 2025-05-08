import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class FirebaseTransactionRepository implements TransactionRepository {
    private db = getFirestore();

    async getAll(userId: string): Promise<Transaction[]> {
        const q = query(collection(this.db, 'transactions'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    }

    async add(transaction: Transaction): Promise<void> {
        await addDoc(collection(this.db, 'transactions'), transaction);
    }
}