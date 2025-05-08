import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import type { Customer } from '../../domain/entities/Customer';
import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class FirebaseCustomerRepository implements CustomerRepository {
    private db = getFirestore();

    async getAll(userId: string): Promise<Customer[]> {
        const q = query(collection(this.db, 'customers'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    }

    async add(customer: Customer): Promise<void> {
        await addDoc(collection(this.db, 'customers'), customer);
    }
}