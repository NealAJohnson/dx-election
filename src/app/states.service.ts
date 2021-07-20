import { Injectable } from '@angular/core';
import { MapUtils } from './maputils';
import { VotesService } from './votes.service';

@Injectable()
export class StatesService {
    private statesBounds: Object = {};

    constructor(private votes: VotesService) { }

    collectBounds(coordinates: Array<Array<Array<number>>>): Array<number> {
        let minLon, maxLat, maxLon, minLat;

        coordinates.forEach(area => {
            area.forEach(dot => {
                let lon = dot[0],
                    lat = dot[1];

                if (minLon === undefined || minLon > lon) { minLon = lon; }
                if (maxLon === undefined || maxLon < lon) { maxLon = lon; }
                if (minLat === undefined || minLat > lat) { minLat = lat; }
                if (maxLat === undefined || maxLat < lat) { maxLat = lat; }
            });
        });

        return [minLon - .25, maxLat + .25, maxLon + .25, minLat - .25];
    }

    getFullData(): Promise<any> {
        return new Promise((resolve, reject) => {
            MapUtils.parseMapData('data/usa', (data) => {

                data.features.sort((a, b) => {
                    if (a.properties['NAME'] > b.properties['NAME']) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

              data.features.forEach(feature => {

                let code = feature.properties['STATEFP'],
                  postal = feature.properties['STUSPS'],
                  bounds = this.collectBounds(feature.geometry.coordinates);

                feature.properties['selected'] = 1;

                this.statesBounds[code] = bounds;
              });

              resolve(data);

            });
        });
    }

    getBoundsByCode(code: string): Array<number> {
        return this.statesBounds[code];
    }
}
