import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductState } from '../states/product.state';
import { Product } from '../models/product';
import { AddProduct, UpdateProduct } from '../actions/product.action';
import { Select, Store } from '@ngxs/store';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnDestroy {
  @Select(ProductState.getSelectedproduct)
  selectedProduct!: Observable<Product>;
  productForm!: FormGroup;
  editProduct = false;
  private formSubscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private store: Store) {
    this.createForm();
  }

  ngOnInit() {
    this.formSubscription.add(
      this.selectedProduct.subscribe((product) => {
        if (product) {
          this.productForm.patchValue({
            id: product.id,
            text: product.text,
            title: product.title,
          });
          this.editProduct = true;
        } else {
          this.editProduct = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  createForm() {
    this.productForm = this.fb.group({
      id: [''],
      text: [''],
      title: [''],
    });
  }

  onSubmit() {
    if (this.editProduct) {
      this.formSubscription.add(
        this.store
          .dispatch(
            new UpdateProduct(this.productForm.value, this.productForm.value.id)
          )
          .subscribe(() => {
            this.clearForm();
          })
      );
    } else {
      this.formSubscription.add(
        (this.formSubscription = this.store
          .dispatch(new AddProduct(this.productForm.value))
          .subscribe(() => {
            this.clearForm();
          }))
      );
    }
  }

  clearForm() {
    this.productForm.reset();
    // this.store.dispatch(new SetSelectedProduct(null));
  }
}
