import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.css'],
})
export class OrderDetailsDialogComponent implements OnInit {
  submitLabel: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  getProductsAbsoluteValue(): number {
    let value = 0;
    if (this.data.order.product1.productSelected) {
      value +=
        this.data.order.product1.quantity * this.data.order.product1.unitPrice;
    }
    if (this.data.order.product2.productSelected) {
      value +=
        this.data.order.product2.quantity * this.data.order.product2.unitPrice;
    }
    if (this.data.order.product3.productSelected) {
      value +=
        this.data.order.product3.quantity * this.data.order.product3.unitPrice;
    }
    return value;
  }
  getDiscount(discountType: string): number {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (discountType === 'TRADE') {
      value = value * (this.data.order.tradeDiscountValue / 100);
    }
    if (discountType === 'CASH') {
      if (this.data.order.tradeDiscount) {
        value -= this.getDiscount('TRADE');
      }
      value = value * (this.data.order.cashDiscountValue / 100);
    }
    return value;
  }
  getTaxValue(): number {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (this.data.order.tradeDiscount) {
      value -= this.getDiscount('TRADE');
    }
    if (this.data.order.cashDiscount) {
      value -= this.getDiscount('CASH');
    }
    return value * 0.18;
  }
  getTotalAmount() {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (this.data.order.tradeDiscount) {
      value -= this.getDiscount('TRADE');
    }
    if (this.data.order.cashDiscount) {
      value -= this.getDiscount('CASH');
    }
    if (this.data.order.orderScope != 'offline') {
      value += this.getTaxValue();
    }

    return value;
  }

  ngOnInit(): void {
    console.log(this.data.order);
    console.log(this.data.pageType);
    if (this.data.pageType == 'CREATE') {
      this.submitLabel = 'Save';
    } else if (this.data.pageType == 'UPDATE') {
      this.submitLabel = 'Update';
    }
  }
}
