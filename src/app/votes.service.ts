import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VotesService {

    private data: any;

    constructor(private http: HttpClient) {

        this.data = forkJoin(
            this.http.get('data/US2012Results.json').pipe(map((res: HttpResponse<any>) => res)),
            this.http.get('data/US2016Results.json').pipe(map((res: HttpResponse<any>) => res)),
            this.http.get('data/postals.json').pipe(map((res: HttpResponse<any>) => res))
        );
    }

    getFullData(): any {
      return {
        fullData: [this.data[0], this.data[1]],
        postal: this.data[2]
      }
    }
}
