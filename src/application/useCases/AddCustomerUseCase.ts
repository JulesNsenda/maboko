import type { Customer } from '../../domain/entities/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class AddCustomerUseCase {
    constructor(private repository: CustomerRepository) { }

    async execute(customer: Customer): Promise<void> {
        if (!customer.name || !customer.phone) throw new Error('Name and phone are required');
        await this.repository.add(customer);
    }
}