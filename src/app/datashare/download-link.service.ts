import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../core/shared/item.model';
import { BaseDataService } from '../core/data/base/base-data.service';
import { RequestService } from '../core/data/request.service';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../core/cache/object-cache.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadLinkService {


  constructor(
    protected httpClient: HttpClient,
  ) {
  }

  getDownloadLink(itemId: string): Observable<string> {
    // console.log("itemId:", itemId);
    // console.log(`${environment.rest.baseUrl}/api/datashare/items/${itemId}/zip-file-link`);
    const options = {
      responseType: 'text' as const,
    };
    return this.httpClient.get(`${environment.rest.baseUrl}/api/datashare/items/${itemId}/zip-file-link`, options).pipe(
      map((response: string) => {
        // console.log('response:', response);
        return response;
      })
    );

  }
}
