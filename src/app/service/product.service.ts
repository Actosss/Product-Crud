import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  fetchProducts() {
    return this.http.get<Product[]>('http://localhost:8080/api/allproduct');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:8080/api/${id}`);
  }

  addProduct(payload: Product) {
    return this.http.post<Product>('http://localhost:8080/api/', payload);
  }

  updateProduct(payload: Product, id: number) {
    return this.http.put<Product>(
      `http://localhost:8080/api/product/${id}`,
      payload
    );
  }
}
