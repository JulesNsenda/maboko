import type { InventoryItem } from '../../domain/entities/InventoryItem';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';

export class LocalStorageInventoryRepository implements InventoryRepository {
    private key = 'inventory';

    async getAll(userId: string): Promise<InventoryItem[]> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        return data.filter((i: InventoryItem) => i.userId === userId);
    }

    async add(item: InventoryItem): Promise<void> {
        const data = JSON.parse(localStorage.getItem(this.key) || '[]');
        data.push({ ...item, id: Date.now().toString() });
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}