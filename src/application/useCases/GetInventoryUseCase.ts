import type { InventoryItem } from '../../domain/entities/InventoryItem';
import type { InventoryRepository } from '../../domain/repositories/InventoryRepository';

export class GetInventoryUseCase {
    constructor(private repository: InventoryRepository) { }

    async execute(userId: string): Promise<InventoryItem[]> {
        return await this.repository.getAll(userId);
    }
}