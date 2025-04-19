import { Category, CreateCategoryInput } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http:localhost:9000'

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const defaultHeader: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    const config: RequestInit = {
        method: 'GET',
        ...options,
        headers: {
            ...defaultHeader,
            ...options.headers
        }
    }

    try {
        const response = await fetch(url, config);

        if(!response.ok) {
            const errorBody = await response.text()
            throw new Error(`API CALL FAILED: ${response.status}, Response: ${errorBody}`)
        }

        if(response.status === 204 || response.headers.get('content-length') === '0') {
            console.debug(`[API] Success: ${config.method} ${url} - Status 204 No Content`);
            return undefined as T
        }

        try {
            const data = await response.json()
            console.debug(`[API] Success: ${config.method} ${url} - Received data.`);
            return data as T
        } catch (error) {
            console.error(`[API] Error parsing JSON response from ${config.method} ${url}:`, error);
            throw new Error(`Failed to parse JSON response from API endpoint: ${endpoint}`);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw error
    }
}

export async function getCategories(): Promise<Category[]> {
    return apiFetch<Category[]>('/categories')
}

export async function getCategoriesById(id: string): Promise<Category> {
    return apiFetch<Category>(`/categories/${encodeURIComponent(id)}`)
}

export async function createNewCategory(data: CreateCategoryInput): Promise<Category> {
    const body = JSON.stringify(data)
    return apiFetch<Category>('/categories', {
        method: 'POST',
        body: body
    })
}

export async function updateNewCategory(id: string, data: CreateCategoryInput): Promise<Category> {
    const body = JSON.stringify(data)
    return apiFetch<Category>(`/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: body
    })
}

export async function deleteNewCategory(id: string): Promise<Category> {
    return apiFetch<Category>(`/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE'
    })
}