import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { OrdersService } from 'src/app/services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { Observable, debounceTime, distinctUntilChanged, map, of } from 'rxjs';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  orderObject: any = {};
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
  orderScopeOptions = [
    { name: 'state', value: 'Within State(CGST + SGST)' },
    { name: 'interState', value: 'Inter-State(IGST)' },
    { name: 'offline', value: 'Offline Transaction' },
  ];
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
  isLoading = false;
  orderPage: string = '';
  saveLabel: string = '';
  existingProducts: any[] = [];
  existingOrder: any = {};
  constructor(
    private _formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private orderService: OrdersService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderPage = this.route.snapshot.data['page'];
    if (this.orderPage == 'CREATE') {
      this.saveLabel = 'Create';
      this.initializeFormGroups();
    } else if (this.orderPage == 'UPDATE') {
      this.saveLabel = 'Update';
      if (Object.keys(<string[]>this.location.getState()).length > 1) {
        this.existingOrder = this.location.getState();
        this.updateFormGroupsWithData();
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    }
    this.firstFormGroup
      .get('gstin')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.firstFormGroup
          .get('gstin')
          ?.updateValueAndValidity({ onlySelf: true });
      });
  }
  openDialog() {
    this.orderObject = Object.assign(
      this.firstFormGroup.value,
      this.secondFormGroup.value,
      this.thirdFormGroup.value
    );
    this.orderObject.invoiceDate = this.datepipe.transform(
      this.orderObject.invoiceDate,
      'yyyy-MM-dd'
    );
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
      data: { order: this.orderObject, pageType: this.orderPage },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        console.log('order saved');
        this.orderPage == 'CREATE' ? this.save() : this.update();
      }
    });
  }

  private initializeFormGroups() {
    this.firstFormGroup = this._formBuilder.group({
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      gstin: ['37AWMPK9162H2ZZ', Validators.required, [gstinValidator()]],
      phoneNumber: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      salesPersonName: ['', Validators.required],
      transport: ['', Validators.required],
      otherTransport: [''],
      fobPoint: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: new FormControl(new Date(), Validators.required),
      terms: ['', Validators.required],
      dueDate: [''],
      product1: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
      product2: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
      product3: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
    });
    this.thirdFormGroup = this._formBuilder.group({
      tradeDiscount: [false],
      tradeDiscountValue: [0],
      cashDiscount: [false],
      cashDiscountValue: [0],
      orderScope: ['', Validators.required],
    });
  }
  private updateFormGroupsWithData() {
    const order = this.existingOrder;
    this.firstFormGroup = this._formBuilder.group({
      companyName: [order.companyName, Validators.required],
      address: [order.address, Validators.required],
      address2: [order.address2],
      gstin: [order.gstin, Validators.required, [gstinValidator()]],
      phoneNumber: [order.phoneNumber, Validators.required],
    });

    this.productOptions
      .filter((x) =>
        order.product.map((y: any) => (y = y.productId)).includes(x.name)
      )
      .map((y) => (y.selected = true));
    this.existingProducts.push(
      ...this.productOptions.filter((x) => x.selected)
    );

    this.secondFormGroup = this._formBuilder.group({
      salesPersonName: [order.salesPersonName, Validators.required],
      transport: [order.orderSentVia, Validators.required],
      otherTransport: [
        order.orderSentVia == 'OTHERS' ? order.orderSentVia : '',
      ],
      fobPoint: [order.fobPoint, Validators.required],
      invoiceNumber: [order.invoiceNumber, Validators.required],
      invoiceDate: new FormControl(
        new Date(order.invoiceDate),
        Validators.required
      ),
      terms: [order.terms, Validators.required],
      dueDate: [order.terms == 'Credit' ? order.terms : ''],
      product1: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
      product2: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
      product3: new FormGroup({
        productSelected: new FormControl(false),
        quantity: new FormControl(''),
        unitPrice: new FormControl(''),
        activeFlag: new FormControl('Y'),
      }),
    });
    const prodCodes = ['product1', 'product2', 'product3'];
    this.setExistingProductValues(prodCodes);
    let scope = '';
    if (order.csgstFlag == 'Y') scope = 'state';
    else if (order.igstFlag == 'Y') scope = 'interState';
    else if (order.offlineTransactionFlag == 'Y') scope = 'offline';
    this.tradeDiscountPercentage = order.tradeDiscountValue;
    this.cashDiscountPercentage = order.cashDiscountValue;
    this.thirdFormGroup = this._formBuilder.group({
      tradeDiscount: [order.tradeDiscount == 'Y' ? true : false],
      tradeDiscountValue: [order.tradeDiscountValue],
      cashDiscount: [order.cashDiscount == 'Y' ? true : false],
      cashDiscountValue: [order.cashDiscountValue],
      orderScope: [scope, Validators.required],
    });
  }

  private setExistingProductValues(prodCodes: string[]) {
    this.existingOrder.product.forEach((x: any) => {
      prodCodes.forEach((prodName: any) => {
        if (x.productId == prodName) {
          let prodControl = this.secondFormGroup.get(prodName);
          prodControl?.get('productSelected')?.setValue(true);
          prodControl?.get('quantity')?.setValue(x.quantity);
          prodControl?.get('unitPrice')?.setValue(x.unitPrice);
        }
      });
    });
  }

  get invoiceDate() {
    return this.secondFormGroup.get('invoiceDate');
  }
  get orderScope() {
    return this.thirdFormGroup.get('orderScope');
  }

  get tradeDiscountChecked() {
    return this.thirdFormGroup.get('tradeDiscount')?.value;
  }
  get cashDiscountChecked() {
    return this.thirdFormGroup.get('cashDiscount')?.value;
  }

  get gstin() {
    return this.firstFormGroup.get('gstin');
  }
  get phoneNumber() {
    return this.firstFormGroup.get('phoneNumber');
  }
  fun1(_event: any) {
    console.log(_event);
    console.log(this.firstFormGroup.status);
  }
  fun2(_event: any) {
    console.log('Product - ', this.productsControl.status);
    if (this.productsControl.status === 'INVALID') {
      this.secondFormGroup.setErrors({ customError: true });
    } else {
      this.secondFormGroup.setErrors(null);
    }
    console.log(_event);
    console.log(this.secondFormGroup.status);
  }
  save() {
    console.log(this.orderObject);
    this.isLoading = true;
    this.orderService.addOrderDetails(this.orderObject).subscribe({
      next: (result: any) => {
        this._snackBar.open(result.data, 'Dismiss', {
          duration: 3000,
          panelClass: 'good-snackbar',
        });
        // this.initializeFormGroups();
        this.isLoading = false;
        this.initializeFormGroups();
        this.resetPage();
        this.router.navigate(['dashboard']);
        console.log(result);
      },
      error: (result) => {
        console.log(result);
        this._snackBar.open(result.error.exceptionMessage, 'Dismiss', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        this.isLoading = false;
      },
    });
  }
  update() {
    console.log(JSON.stringify(this.orderObject));
  }
  changeValue(event: any) {
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
        if ((this.orderPage = 'UPDATE')) {
          this.setExistingProductValues([selectedProduct.name]);
        }
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
      this.removeValidation(this.secondFormGroup, product + '.quantity');
      this.removeValidation(this.secondFormGroup, product + '.unitPrice');
    } else {
      this.updateValidation(this.secondFormGroup, product + '.quantity');
      this.updateValidation(this.secondFormGroup, product + '.unitPrice');
    }
  }
  resetPage() {
    this.cashDiscountPercentage = 0;
    this.tradeDiscountPercentage = 0;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.productsControl.reset();
    this.productOptions.map((x) => (x.selected = false));
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
  validateOrderDetails(): boolean {
    // if (
    //   !(
    //     this.firstFormGroup.valid &&
    //     this.secondFormGroup.valid &&
    //     this.thirdFormGroup.valid
    //   )
    // )
    //   return true;
    return false;
  }
  onTransportSelected(event: any) {
    console.log(event.value);
    if (event.value === 'OTHERS') {
      this.updateValidation(this.secondFormGroup, 'otherTransport');
    } else {
      this.removeValidation(this.secondFormGroup, 'otherTransport');
    }
  }
  onTermsSelected(event: any) {
    if (event.value === 'Credit') {
      this.updateValidation(this.secondFormGroup, 'dueDate');
    } else {
      this.removeValidation(this.secondFormGroup, 'dueDate');
    }
  }
  updateValidation(formGroup: FormGroup<any>, formControlName: string) {
    formGroup.get(formControlName)?.setValidators([Validators.required]);
    formGroup.get(formControlName)?.updateValueAndValidity();
  }
  removeValidation(formGroup: FormGroup<any>, formControlName: string) {
    formGroup.get(formControlName)?.setValue('');
    formGroup.get(formControlName)?.clearValidators();
    formGroup.get(formControlName)?.updateValueAndValidity();
  }
}
export function gstinValidator(): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    const gstin =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(
        control.value
      );
    return of(gstin ? null : { invalidGstin: { value: control.value } });
  };
}
