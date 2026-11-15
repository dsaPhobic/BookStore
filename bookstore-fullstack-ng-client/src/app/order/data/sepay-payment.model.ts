export interface SePayOrderCreatedModel {
  orderId: number;
  amountVnd: number;
}

export interface SePayCheckoutFieldModel {
  name: string;
  value: string;
}

export interface SePayCheckoutSessionModel {
  orderId: number;
  checkoutUrl: string;
  amountVnd: number;
  fields: ReadonlyArray<SePayCheckoutFieldModel>;
}

export interface OrderPaymentStatusModel {
  orderId: number;
  status: string;
}
