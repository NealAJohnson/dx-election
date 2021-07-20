import { Injectable } from '@angular/core';
import { MapUtils } from './maputils';
import { VotesService } from './votes.service';

@Injectable()
export class CountiesService {
    private data: any;

    constructor(private votes: VotesService) {
        let featureCollection: Array<any> = [];

        MapUtils.parseMapData('data/county', (data) => {

                data.features.forEach(feature => {
                    let stateFp = feature.properties['STATEFP'],
                        fips = feature.properties['GEOID'];

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
            console.log(result);
            return result;
    }

    toggleCountySelection(stateCode: string, countyName: string) {
        let countyIndex = this.data[stateCode].findIndex(item => item.properties['NAME'] === countyName);
        this.data[stateCode][countyIndex].properties['selected'] = (this.data[stateCode][countyIndex].properties['selected'] === 0) ? 1 : 0;
    }
}
