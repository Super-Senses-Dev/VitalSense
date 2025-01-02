import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  apiUrl = environment.apiUrl;


  constructor(private httpClient: HttpClient) { }


  /**
   * Sen image to the backend to extract the temperature
   * @param image 
   * @returns Promise
   */
  extractTemperature(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    return lastValueFrom(this.httpClient.post(`${environment.apiUrl}/extract/extractTemperature`, formData));
  }

}
