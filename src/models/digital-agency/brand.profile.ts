import { City } from "../city";
import { Country } from "../country";
import { State } from "../state";
import { Industry } from "../industry";

export class DigitalBrandProfile {
    id: number;
    city: City;
    contactNumber: any;
    country: Country;
    entityDescription: string;
    industry: Industry;
    name: string;
    state: State;
    streetOne: string;
    streetTwo: string;
    type: string;
    websiteUrl: string;
    welcomeMessageAllow: true;
    zipCode: string;
    firstName : string;
    lastName : string;
}