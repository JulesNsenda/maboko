import type { InventoryItem } from '../entities/InventoryItem.ts';

export interface InventoryRepository {
    getAll(userId: string): Promise<InventoryItem[]>;
    add(item: InventoryItem): Promise<void>;
}