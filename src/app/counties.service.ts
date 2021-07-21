import {Injectable} from '@angular/core';
import {MapUtils} from './maputils';
import {Subject} from 'rxjs';

@Injectable()
export class CountiesService {
  data: any;
  selectedCounties: Map<string, string[]> = new Map<string, string[]>();
  toggleState: Subject<string> = new Subject<string>();

  constructor() {
    let featureCollection: Array<any> = [];

    MapUtils.parseMapData('data/county', (data) => {

      data.features.forEach(feature => {
        let stateFp = feature.properties['STATEFP'];

        if (featureCollection[stateFp] === undefined) {
          featureCollection[stateFp] = [];
        }

        feature.properties['selected'] = 0;

        featureCollection[stateFp].push(feature);
      });
      this.data = featureCollection;
    });

  }

  getLayerData(stateFp: string): any {
    let result = {
      type: 'FeatureCollection',
      features: {}
    };
    result.features = this.data[stateFp].sort((a, b) => {
      if (a.properties['NAME'] > b.properties['NAME']) {
        return 1;
      } else {
        return -1;
      }
    });
    return result;
  }

  toggleCountySelection(stateFp: string, countyName: string) {
    let countyIndex = this.data[stateFp].findIndex(item => item.properties['NAME'] === countyName);
    if (this.data[stateFp][countyIndex].properties['selected'] === 0) {
      // Item was not previously selected. Insert into the dictionary, creating a new array if necessary.
      if (this.selectedCounties.has(stateFp)) {
        this.selectedCounties.get(stateFp).push(countyName);
      } else {
        this.selectedCounties.set(stateFp, [countyName]);
        this.toggleState.next(stateFp);
      }
      // Toggle the map
      this.data[stateFp][countyIndex].properties['selected'] = 1;
    } else {
      // Item was previously selected. Remove it from the dictionary, and delete the entry if there are no values left
      let selectedCountyIndex = this.selectedCounties.get(stateFp).findIndex(county => county === countyName);
      this.selectedCounties.get(stateFp).splice(selectedCountyIndex, 1);
      if (this.selectedCounties.get(stateFp).length === 0) {
        this.selectedCounties.delete(stateFp);
        this.toggleState.next(stateFp);
      }
      // Toggle the map
      this.data[stateFp][countyIndex].properties['selected'] = 0;
    }
    console.log(this.selectedCounties);
  }
}
