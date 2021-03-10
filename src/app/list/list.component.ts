import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  DeleteProduct,
  GetProducts,
  SetSelectedProduct,
} from '../actions/product.action';
import { Product } from '../models/product';
import { ProductState } from '../states/product.state';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Select(ProductState.getSelectedproduct) products:
    | Observable<Product[]>
    | undefined;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetProducts());
  }

  deleteProduct(id: number) {
    this.store.dispatch(new DeleteProduct(id));
  }

  editProduct(payload: Product) {
    this.store.dispatch(new SetSelectedProduct(payload));
  }
}
