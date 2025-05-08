import type { InventoryItem } from '../../domain/entities/InventoryItem';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';

export class AddInventoryUseCase {
    constructor(private repository: InventoryRepository) { }

    async execute(item: InventoryItem): Promise<void> {
        if (item.quantity <= 0 || item.price <= 0) throw new Error('Quantity and price must be positive');
        await this.repository.add(item);
    }
}