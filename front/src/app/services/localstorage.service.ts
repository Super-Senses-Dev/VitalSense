import { Injectable } from '@angular/core';
import { Thermo } from '../interfaces/thermo';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }


  saveMeasuresToLocalStorage(picturesList: Thermo[]) {
    localStorage.setItem('picturesList', JSON.stringify(picturesList));
  }

  getMeasuresFromLocalStorage(): Thermo[] {
    const picturesList = localStorage.getItem('picturesList');
    return picturesList ? JSON.parse(picturesList) : [];
  }

}
