import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import { CountryService } from './country.service';
import { Country } from '../../models/country';
import 'rxjs/add/operator/map'

@Injectable()
export class CompleteTestService implements AutoCompleteService {
  labelAttribute = "name";

  countries: Country[];

  constructor(private http:Http, private _countryService: CountryService) {
      this._countryService.getCountries().subscribe(
            (res) => {
                this.countries = res.json().genericResponse.genericBody.data.countries;
                this.getResults('');
            },
            (err) => console.log(err)
        )
  }
  getResults(val:string) {
    if (val && val != '') {
            return this.countries.filter(c => c.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        }
        else
            return this.countries;
  }
}