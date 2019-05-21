import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/models/category.model';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryService extends ConfigService {
    apiUrl: string;
    error;

    constructor(protected http: HttpClient) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.categoryUrl;
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl, this.httpOptions);
    }

    getCategoryById(id: string): Observable<Category> {
        return this.http.get<Category>(this.apiUrl + '/' + id, this.httpOptions);
    }

    getCategoryFile(category: Category): Observable<string> {
        return this.http.get<string>(this.apiUrl + '/file/' + category.id);
    }

    addCategory(category: Category): Observable<Category> {
        const formData = new FormData();
        formData.append('file', category.file);
        delete category.file;
        formData.append('category', JSON.stringify(category));
        return this.http.post<Category>(this.apiUrl, formData);
    }

    deleteCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiUrl + '/delete', category, this.httpOptions);
    }

    updateCategory(category: Category): Observable<Category> {
        const formData = new FormData();
        formData.append('file', category.file);
        delete category.file;
        formData.append('category', JSON.stringify(category));
        return this.http.put<Category>(this.apiUrl, formData);
    }
}
