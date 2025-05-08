import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import type { InventoryItem } from '../../domain/entities/InventoryItem';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';

export class FirebaseInventoryRepository implements InventoryRepository {
    private db = getFirestore();

    async getAll(userId: string): Promise<InventoryItem[]> {
        const q = query(collection(this.db, 'inventory'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    }

    async add(item: InventoryItem): Promise<void> {
        await addDoc(collection(this.db, 'inventory'), item);
    }
}