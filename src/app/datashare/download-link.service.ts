import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
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
      }),
    );

  }
}
