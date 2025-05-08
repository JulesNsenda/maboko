import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class AddTransactionUseCase {
    constructor(private repository: TransactionRepository) { }

    async execute(transaction: Transaction): Promise<void> {
        if (transaction.amount <= 0) throw new Error('Amount must be positive');
        await this.repository.add(transaction);
    }
}