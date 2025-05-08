import type { Customer } from '../entities/Customer';

export interface CustomerRepository {
    getAll(userId: string): Promise<Customer[]>;
    add(customer: Customer): Promise<void>;
}