export interface DataType {
    id: number;
    name: string;
    description?: string;
    status: boolean;
}
export interface EditingState {
    row: number | null;
    column: string; // TODO: Do with ENUM
    data: Partial<DataType>;
}