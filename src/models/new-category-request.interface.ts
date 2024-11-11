import { CategoryRequestState } from './category-request-state.enum';

export interface NewCategoryRequest {
    id: number;
    newCategoryName: string;
    state: CategoryRequestState;
    parentCategoryId?: number;  
    createdById?: number; 
}
