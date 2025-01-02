import { Injectable } from '@angular/core';
import { Thermo } from '../interfaces/thermo';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }


  /**
   * Save the measures to the local storage
   * @param picturesList 
   */
  saveMeasuresToLocalStorage(picturesList: Thermo[]) {
    localStorage.setItem('picturesList', JSON.stringify(picturesList));
  }

  /**
   * Get the measures from the local storage
   * @returns 
   */
  getMeasuresFromLocalStorage(): Thermo[] {
    const picturesList = localStorage.getItem('picturesList');
    return picturesList ? JSON.parse(picturesList) : [];
  }


  /**
   * Save the parent child profile to the local storage
   * @param parentChildProfile 
   */
  saveParentChildProfileToLocalStorage(parentChildProfile: any) {
    localStorage.setItem('parentChildProfile', JSON.stringify(parentChildProfile));
  }

  /**
   * Get the parent child profile from the local storage
   * @returns 
   */
  getParentChildProfileFromLocalStorage(): any {
    const parentChildProfile = localStorage.getItem('parentChildProfile');
    return parentChildProfile ? JSON.parse(parentChildProfile) : {};
  }

}
