import type { Customer } from '../../domain/entities/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class GetCustomersUseCase {
    constructor(private repository: CustomerRepository) { }

    async execute(userId: string): Promise<Customer[]> {
        return await this.repository.getAll(userId);
    }
}