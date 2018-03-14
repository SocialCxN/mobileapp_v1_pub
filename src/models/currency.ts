import { BaseModel } from "./base.model";
import { Country } from "./country";
export class Currency extends BaseModel {
    codeName: string;
    displayName: string;
    symbolName: string;
    symbol: string;
    country :Country = new Country() ;
    

}
