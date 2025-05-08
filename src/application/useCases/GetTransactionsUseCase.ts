import type { Transaction } from '../../domain/entities/Transaction';
import type { TransactionRepository } from '../../domain/repositories/TransactionRepository';

export class GetTransactionsUseCase {
    constructor(private repository: TransactionRepository) { }

    async execute(userId: string): Promise<Transaction[]> {
        return await this.repository.getAll(userId);
    }
}