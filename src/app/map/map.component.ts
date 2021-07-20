import {Component, ViewChild} from '@angular/core';
import {StatesService} from '../states.service';
import {CountiesService} from '../counties.service';
import {DxVectorMapComponent} from 'devextreme-angular';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [ StatesService, CountiesService ]
})

export class MapComponent {
    @ViewChild(DxVectorMapComponent, { static: false }) vectorMap: DxVectorMapComponent;

    private defaultBounds: Array<number> = [-130, 23, -59, 49];

    private layers: Array<any> = [];
    bounds: Array<number> = this.defaultBounds;
    private prevBounds: Array<number> = this.defaultBounds;
    tooltip: any = {
        customizeTooltip: this.customizeTooltip.bind(this),
        enabled: true,
        zIndex: 10
    };
    title = '&nbsp;';
    subtitle = '&nbsp;';
    usaLayerOpacity = 1;

    dataSource: any = null;
    countyDataSource: any = null;

    showBackButton = false;

    isMapCentered = true;
    private currentMapCenter: Array<any> = [];

    constructor(private statesService: StatesService, private countiesService: CountiesService) {
        this.loadStatesMap();
    }

    loadStatesMap() {
        this.statesService.getFullData().then(data => {
            this.dataSource = data;
            this.showBackButton = false;
        });
    }

    mapClick(e: any) {
        if (e.target === undefined) { return; }

        let code = e.target.attribute('STATEFP');
        let stateOrCountyName = e.target.attribute('NAME');
        if (e.target.layer.index !== 0) {
          this.countiesService.toggleCountySelection(code, stateOrCountyName);
          this.countyDataSource = this.countiesService.getLayerData(code);
          return;
        }
        if (code === '02' || code === '15') { return; } // no data for Alaska & Hawaii

        this.bounds = this.statesService.getBoundsByCode(code);
        this.isMapCentered = true;
        this.countyDataSource = this.countiesService.getLayerData(code);
        this.usaLayerOpacity = 0.3;
        this.showBackButton = true;
        this.title = stateOrCountyName;
    }

    backToStates() {
        this.loadStatesMap();
        this.bounds = this.defaultBounds;
        this.isMapCentered = true;
        this.countyDataSource = null;
        this.usaLayerOpacity = 1;
        this.title = '&nbsp;';
        this.subtitle = '&nbsp;';
    }

    centerMap() {
        this.vectorMap.instance.center(null)
        this.vectorMap.instance.zoomFactor(null);
    }

    centerChanged(e: any) {
        if (this.prevBounds !== this.bounds) {
            this.currentMapCenter = e.center;
        } else {
            this.isMapCentered = this.currentMapCenter[0] === e.center[0] && this.currentMapCenter[1] === e.center[1];
        }
        this.prevBounds = this.bounds;
    }

    initialized(e: any) {
        this.currentMapCenter = e.component.instance().center();
    }

    customizeTooltip(info: any) {
        let html = '<div class="tooltip-name">' + info.attribute('NAME') + '</div>';
        return {
            html: html
        }
    }



}


