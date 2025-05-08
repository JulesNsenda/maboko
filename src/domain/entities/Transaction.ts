export interface Transaction {
    id?: string;
    date: string;
    type: 'revenue' | 'expense';
    amount: number;
    desc: string;
    userId: string;
}