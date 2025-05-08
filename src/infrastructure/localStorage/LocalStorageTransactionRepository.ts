import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class LocalStorageTransactionRepository implements TransactionRepository {
    private key = 'transactions';

    async getAll(userId: string): Promise<Transaction[]> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        return data.filter((t: Transaction) => t.userId === userId);
    }

    async add(transaction: Transaction): Promise<void> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        data.push({ ...transaction, id: Date.now().toString() });
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}