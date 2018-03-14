import { CountryInfo } from "./country.info";
import { StateInfo } from "./state.info";
import { CityInfo } from "./city.info";

export class AudienceLocation {
    country = new CountryInfo();
    state = new StateInfo();
    city = new CityInfo();

    percentageCount : number ;
}   