import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  firstFormGroup: FormGroup = new FormGroup({});
  secondFormGroup: FormGroup = new FormGroup({});
  productsControl = new FormControl<string[]>([]);
  transportOptions = [
    { name: 'ARC' },
    { name: 'Kranti' },
    { name: 'Navata' },
    { name: 'BMPS' },
    { name: 'Kesineni' },
    { name: 'OTHERS' },
  ];
  termsOptions = [{ name: 'Cash' }, { name: 'Credit' }];
  creditOptions = [
    { name: '7 Days', value: 7 },
    { name: '15 Days', value: 15 },
    { name: '30 Days', value: 30 },
  ];
  productOptions = [
    { name: 'product1', value: '1 Ltr' },
    { name: 'product2', value: '5 Ltrs' },
    { name: 'product3', value: '100 ml' },
  ];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      gstin: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      salesPersonName: ['', Validators.required],
      transport: ['', Validators.required],
      transportOther: ['', Validators.required],
      fobPoint: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      terms: ['', Validators.required],
      dueDate: ['', Validators.required],
      products: ['', Validators.required],
    });
  }

  fun1(_event: any) {
    console.log(_event);
    console.log(this.firstFormGroup.value);
  }
  onProductRemoved(product: string) {
    const products = this.productsControl.value as string[];
    this.removeFirst(products, product);
    this.productsControl.setValue(products);
  }
  private removeFirst(array: any, toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
