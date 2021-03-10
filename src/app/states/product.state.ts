import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../models/product';
import {
  AddProduct,
  DeleteProduct,
  GetProducts,
  SetSelectedProduct,
  UpdateProduct,
} from '../actions/product.action';
import { ProductService } from '../service/product.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductStateModel {
  products: Product[] = [];
  selectedProduct!: boolean;
}

@State<ProductStateModel>({
  name: 'products',
  defaults: {
    products: [],
    selectedProduct: true,
  },
})
@Injectable()
export class ProductState {
  constructor(private productService: ProductService) {}

  @Selector()
  static getSelectedproduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Action(GetProducts)
  getproducts({ getState, setState }: StateContext<ProductStateModel>) {
    return this.productService.fetchProducts().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          products: result,
        });
      })
    );
  }

  @Action(AddProduct)
  addproduct(
    { getState, patchState }: StateContext<ProductStateModel>,
    { payload }: AddProduct
  ) {
    return this.productService.addProduct(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          products: [...state.products, result],
        });
      })
    );
  }

  @Action(UpdateProduct)
  updateproduct(
    { getState, setState }: StateContext<ProductStateModel>,
    { payload, id }: UpdateProduct
  ) {
    return this.productService.updateProduct(payload, id).pipe(
      tap((result) => {
        const state = getState();
        const productList = [...state.products];
        const productIndex = productList.findIndex((item) => item.id === id);
        productList[productIndex] = result;
        setState({
          ...state,
          products: productList,
        });
      })
    );
  }

  @Action(DeleteProduct)
  deleteproduct(
    { getState, setState }: StateContext<ProductStateModel>,
    { id }: DeleteProduct
  ) {
    return this.productService.deleteProduct(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.products.filter((item) => item.id !== id);
        setState({
          ...state,
          products: filteredArray,
        });
      })
    );
  }

  @Action(SetSelectedProduct)
  setSelectedproductId(
    { getState, setState }: StateContext<ProductStateModel>,
    { payload }: SetSelectedProduct
  ) {
    const state = getState();
    setState({
      ...state,
      selectedProduct: true,
    });
  }
}
