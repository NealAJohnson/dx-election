import {Injectable} from '@angular/core';
import {MapUtils} from './maputils';
import {Observable, Subject} from 'rxjs';
import {CountiesService} from './counties.service';

@Injectable()
export class StatesService {
  private statesBounds: Object = {};
  data: any;
  data$: Subject<any> = new Subject<any>();

  constructor(countiesService: CountiesService) {
    MapUtils.parseMapData('data/usa', (data) => {

      data.features.sort((a, b) => {
        if (a.properties['NAME'] > b.properties['NAME']) {
          return 1;
        } else {
          return -1;
        }
      });

      data.features.forEach(feature => {
        let stateFp = feature.properties['STATEFP'],
          bounds = this.collectBounds(feature.geometry.coordinates);

        feature.properties['selected'] = 0;

        this.statesBounds[stateFp] = bounds;
      });
      this.data = data;
      this.data$.next(this.data);
    });
    countiesService.toggleState.subscribe((toggledState) => {
      let stateIndex = this.data.features.findIndex(item => item.properties['STATEFP'] === toggledState);
      this.data.features[stateIndex].properties['selected'] = (this.data.features[stateIndex].properties['selected'] === 0) ? 1 : 0;
      this.data$.next(Object.assign({}, this.data));
    });
  }

  collectBounds(coordinates: Array<Array<Array<number>>>): Array<number> {
    let minLon, maxLat, maxLon, minLat;

    coordinates.forEach(area => {
      area.forEach(dot => {
        let lon = dot[0],
          lat = dot[1];

        if (minLon === undefined || minLon > lon) {
          minLon = lon;
        }
        if (maxLon === undefined || maxLon < lon) {
          maxLon = lon;
        }
        if (minLat === undefined || minLat > lat) {
          minLat = lat;
        }
        if (maxLat === undefined || maxLat < lat) {
          maxLat = lat;
        }
      });
    });

    return [minLon - .25, maxLat + .25, maxLon + .25, minLat - .25];
  }

  getBoundsByStateFp(stateFp: string): Array<number> {
    return this.statesBounds[stateFp];
  }

  getData(): Observable<any> {
    return this.data$;
  }
}
