import { CategoryRequestState } from './category-request-state.enum';

export interface NewCategoryRequest {
    id?: number;
    newCategoryName: string;
    state: CategoryRequestState;
    parentCategoryId?: number | null;  
    createdById?: number; 

    [key: string]: any;
}

export function createEmptyNewCategoryRequest(createdById: number): NewCategoryRequest {
    return {
        newCategoryName: '',
        state: CategoryRequestState.PENDING,
        parentCategoryId: null,
        createdById
    };
}
