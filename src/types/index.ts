export interface Category {
    id: string;
    name: string;
    favorite: boolean;
}

export interface CreateCategoryInput {
    name: string;
    favorite: boolean;
}

export interface UpdateCategoryInput {
    id: string;
    name?: string;
    favorite?: string;
}