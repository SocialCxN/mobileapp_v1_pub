
import { BaseModel } from "../base.model";
import { PaymentGatewayDetails } from "./payment.gateway.details";

export class PaymentGatewayInfo extends BaseModel {

    easypay = new PaymentGatewayDetails();
    paypal = new PaymentGatewayDetails();
    stripe = new PaymentGatewayDetails();
}