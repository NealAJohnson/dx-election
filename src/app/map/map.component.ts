import {Component, ViewChild} from '@angular/core';
import {StatesService} from '../states.service';
import {CountiesService} from '../counties.service';
import {DxVectorMapComponent} from 'devextreme-angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [StatesService, CountiesService]
})

export class MapComponent {
  @ViewChild(DxVectorMapComponent, {static: false}) vectorMap: DxVectorMapComponent;
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
  private defaultBounds: Array<number> = [-130, 23, -59, 49];
  bounds: Array<number> = this.defaultBounds;
  private prevBounds: Array<number> = this.defaultBounds;
  private currentMapCenter: Array<any> = [];


  constructor(private statesService: StatesService, private countiesService: CountiesService) {
    this.statesService.getData()
      .subscribe((data) => {
        this.dataSource = data;
      });
  }

  mapClick(e: any) {
    if (e.target === undefined) {
      return;
    }

    let stateFp = e.target.attribute('STATEFP');
    let stateOrCountyName = e.target.attribute('NAME');
    if (e.target.layer.index !== 0) {
      this.countiesService.toggleCountySelection(stateFp, stateOrCountyName);
      this.countyDataSource = this.countiesService.getLayerData(stateFp);
      return;
    }
    if (stateFp === '02' || stateFp === '15') {
      return;
    } // no data for Alaska & Hawaii

    this.bounds = this.statesService.getBoundsByStateFp(stateFp);
    this.isMapCentered = true;
    this.countyDataSource = this.countiesService.getLayerData(stateFp);
    this.usaLayerOpacity = 0.3;
    this.showBackButton = true;
    this.title = stateOrCountyName;
  }

  backToStates() {
    this.showBackButton = false;
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


