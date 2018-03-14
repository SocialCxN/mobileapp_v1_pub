import { BaseModel } from "../base.model";
import { BankInfo } from "./bank.info";
import { CreditCardInfo } from "./credit.card.info";
import { PaymentGatewayInfo } from "./payment.gateway.info";

export class PaymentDetail extends BaseModel {

    /**
     * --paymentDetails
            --bankInfo
            --creditCardInfo
            --paymentGateWayInfo
     */

     bankInfo = new BankInfo();
     creditCardInfo = new CreditCardInfo();
     paymentGatewayInfo = new PaymentGatewayInfo();

}