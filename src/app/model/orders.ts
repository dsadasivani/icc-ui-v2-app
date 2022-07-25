import { Timestamp } from 'rxjs';
import { Deserializable } from './deserializible.model';
import { Product } from './products';

export class Orders implements Deserializable {
  orderId: number | undefined;
  salesPersonName: string | undefined;
  orderSentDate: string | undefined;
  orderSentVia: string | undefined;
  fobPoint: string | undefined;
  terms: string | undefined;
  dueDate: string | undefined;
  companyName: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  address2: string | undefined;
  gstin: string | undefined;
  tradeDiscount: string | undefined;
  tradeDiscountValue: number | undefined;
  cashDiscount: string | undefined;
  cashDiscountValue: number | undefined;
  csgstFlag: string | undefined;
  igstFlag: string | undefined;
  product: Product[] | undefined;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.product = input.product.map((prod: any) =>
      new Product().deserialize(prod)
    );
    return this;
  }
}
