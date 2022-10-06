import { Deserializable } from './deserializible.model';

export class Product implements Deserializable {
  productId: string | undefined;
  productDesc: string | undefined;
  hsnCode: string | undefined;
  quantity: number | undefined;
  unitPrice: number | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
