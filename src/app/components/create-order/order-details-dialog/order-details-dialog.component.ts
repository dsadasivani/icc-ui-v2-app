import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.css'],
})
export class OrderDetailsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  getProductsAbsoluteValue(): number {
    let value = 0;
    if (this.data.product1.productSelected) {
      value += this.data.product1.quantity * this.data.product1.unitPrice;
    }
    if (this.data.product2.productSelected) {
      value += this.data.product2.quantity * this.data.product2.unitPrice;
    }
    if (this.data.product3.productSelected) {
      value += this.data.product3.quantity * this.data.product3.unitPrice;
    }
    return value;
  }
  getDiscount(discountType: string): number {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (discountType === 'TRADE') {
      value = value * (this.data.tradeDiscountValue / 100);
    }
    if (discountType === 'CASH') {
      if (this.data.tradeDiscount) {
        value -= this.getDiscount('TRADE');
      }
      value = value * (this.data.cashDiscountValue / 100);
    }
    return value;
  }
  getTaxValue(): number {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (this.data.tradeDiscount) {
      value -= this.getDiscount('TRADE');
    }
    if (this.data.cashDiscount) {
      value -= this.getDiscount('CASH');
    }
    return value * 0.18;
  }
  getTotalAmount() {
    let value = 0;
    value = this.getProductsAbsoluteValue();
    if (this.data.tradeDiscount) {
      value -= this.getDiscount('TRADE');
    }
    if (this.data.cashDiscount) {
      value -= this.getDiscount('CASH');
    }
    value += this.getTaxValue();
    return value;
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
