import type { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
    getAll(userId: string): Promise<Transaction[]>;
    add(transaction: Transaction): Promise<void>;
}