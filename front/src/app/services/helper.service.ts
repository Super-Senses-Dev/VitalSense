import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  translate = inject(TranslateService);

  constructor() { }

  /**
   * Return formatted date string
   * @param date
   * @returns string like dd/mm/yyyy, hh:mm (Depending on the current language)
   */
  toDate(date: number | string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '---';
    }
    // Get current language
    const lang = this.translate.currentLang;
    return `${d.toLocaleDateString(lang)}, ${d.toLocaleTimeString(lang), { hour: '2-digit', minute: '2-digit' }}`;
  }


  /**
   * Check if a file is an image
   * @param file (File): file to check
   * @returns (boolean): true if the file is png, jpeg or jpg image
   */
  isFileImage(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return allowedTypes.includes(file.type.toLowerCase());
  }


  /**
   * Convert a file to base64
   * @param file (File): file to convert to base64
   * @returns (Promise<string>): base64 string
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get the size of a base64 string in KB
   * @param base64String 
   * @returns 
   */
  getSizeOfBase64String(base64String: string): number {
    const stringLength = base64String.length - 'data:image/png;base64,'.length;
    const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    const sizeInKb = sizeInBytes / 1000;
    return sizeInKb;
  }


  /**
   * Convert a base64 string to a file
   * @param base64 
   * @returns file
   */
  base64ToFile(base64: string): File {
    const filename = uuidv4();
    const arr = base64.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : '';
    const fileExt = mime.split('/')[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename + '.' + fileExt, {
      type: mime,
    });
  }

}
