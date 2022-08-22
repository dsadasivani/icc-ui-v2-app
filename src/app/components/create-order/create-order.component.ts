import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Product } from 'src/app/model/products';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  firstFormGroup: FormGroup = new FormGroup({});
  secondFormGroup: FormGroup = new FormGroup({});
  thirdFormGroup: FormGroup = new FormGroup({});
  productsControl = new FormControl<any[]>([]);
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
    { name: 'product1', value: '1 Ltr', selected: false },
    { name: 'product2', value: '5 Ltrs', selected: false },
    { name: 'product3', value: '100 ml', selected: false },
  ];
  cashDiscountPercentage: any = 0;
  tradeDiscountPercentage: any = 0;

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
      invoiceDate: new FormControl('', Validators.required),
      terms: ['', Validators.required],
      dueDate: ['', Validators.required],
      product1: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl('', Validators.required),
        unitPrice: new FormControl('', Validators.required),
      }),
      product2: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl('', Validators.required),
        unitPrice: new FormControl('', Validators.required),
      }),
      product3: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl('', Validators.required),
        unitPrice: new FormControl('', Validators.required),
      }),
    });
    this.thirdFormGroup = this._formBuilder.group({
      tradeDiscount: [false],
      tradeDiscountValue: ['', Validators.required],
      cashDiscount: [false],
      cashDiscountValue: ['', Validators.required],
    });
  }

  get invoiceDate() {
    return this.secondFormGroup.get('invoiceDate');
  }

  get tradeDiscountChecked() {
    return this.thirdFormGroup.get('tradeDiscount')?.value;
  }
  get cashDiscountChecked() {
    return this.thirdFormGroup.get('cashDiscount')?.value;
  }
  fun1(_event: any) {
    console.log(_event);
    console.log(this.firstFormGroup.value);
  }
  changeValue(event: any) {
    console.log('sasaadsdsd', event);
    if (event.length == 0) {
      this.productOptions.map((x) => (x.selected = false));
    } else {
      this.productOptions.map((x) => (x.selected = false));
      event.forEach((selectedProduct: any) => {
        this.productOptions
          .filter((x) => x.name == selectedProduct.name)
          .map((y) => (y.selected = true));
        if (
          this.secondFormGroup.get(selectedProduct.name + '.productSelected')
            ?.value == false
        )
          this.setProductField(selectedProduct.name, true);
      });
    }
    console.log(this.productOptions);
  }
  onProductRemoved(product: string) {
    console.log(product);
    this.productOptions
      .filter((x) => x.name == product)
      .map((y) => (y.selected = false));
    const products = this.productsControl.value as any[];
    this.removeFirst(products, product);
    this.productsControl.setValue(products);
    this.setProductField(product, false);
  }
  private setProductField(product: string, productSelected: boolean) {
    this.secondFormGroup
      .get(product + '.productSelected')
      ?.setValue(productSelected);
    if (!productSelected) {
      this.secondFormGroup.get(product + '.quantity')?.setValue(0);
      this.secondFormGroup.get(product + '.unitPrice')?.setValue(0);
    }
  }

  private removeFirst(array: any, toRemove: any): void {
    const index = array.findIndex((x: { name: any }) => x.name == toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  showProductInputFields(productName: string) {
    return (
      this.productOptions.find((x) => x.name === productName)?.selected == true
    );
  }
  formatLabel(value: number) {
    return value + '%';
  }
}
