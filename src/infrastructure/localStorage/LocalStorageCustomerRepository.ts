import type { Customer } from '../../domain/entities/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class LocalStorageCustomerRepository implements CustomerRepository {
    private key = 'customers';

    async getAll(userId: string): Promise<Customer[]> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        return data.filter((c: Customer) => c.userId === userId);
    }

    async add(customer: Customer): Promise<void> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        data.push({ ...customer, id: Date.now().toString() });
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}