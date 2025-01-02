import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Thermo } from '../../interfaces/thermo';
import { PictureCardComponent } from "./picture-card/picture-card.component";
import { HelperService } from '../../services/helper.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { BackendService } from '../../services/backend.service';
import { v4 as uuidv4 } from 'uuid';
import { LocalstorageService } from '../../services/localstorage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pictures',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatProgressBarModule,
    PictureCardComponent,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './pictures.component.html',
  styleUrl: './pictures.component.scss'
})
export class PicturesComponent implements OnInit {


  translate = inject(TranslateService);
  helperService = inject(HelperService);
  imageCompress = inject(NgxImageCompressService);
  backendService = inject(BackendService);
  localStorageService = inject(LocalstorageService);
  snackBar = inject(MatSnackBar);

  imageIsDetectedFilter?: boolean;
  picturesList: Array<Thermo> = [];
  loadingPictures = false;
  isPreProcessing = false;

  isDetecting = false;
  picturesWaitingForDetection = 0;
  picturesDone = 0;

  addingMeasureManually = false;

  // Limit for the total numbers of pictures to display
  limit = 20;

  ngOnInit(): void {
    this.getPicturesList();
  }


  /**
   * Get pictures list from local storage
   * 
   * This function will run when the component is initialized
   */
  getPicturesList() {
    if (this.loadingPictures) {
      return;
    }
    this.loadingPictures = true;
    try {
      this.picturesList = this.localStorageService.getMeasuresFromLocalStorage();
    } catch (e) {
      console.error(e);
      this.translate.get(['error-while-loading-pictures', 'close']).subscribe((res: any) => {
        this.snackBar.open('❌ ' + res['error-while-loading-pictures'], res['close'], {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      });

    }
    this.loadingPictures = false;

  }


  /**
   * This function just used to prevent click event on the drop zone area
   * 
   * @param event (Event): event
   */
  onDropZoneFileClick(event: Event) {
    event.preventDefault();
  }


  /**
   * When the user add pictures through the input file
   * @param event 
   * @returns 
   */
  async onAddPictures(event: Event) {
    if (this.isDetecting || this.isPreProcessing) {
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      try {
        const files = input.files;
        const tempPicturesList: any[] = [];
        const fileArray = Array.from(files);

        // See if the user is trying to add more photos than the limit
        if (this.picturesList.length + fileArray.length > this.limit) {
          this.snackBar.open('❌ ' + this.translate.instant('you-can-only-add-a-maximum-of', { limit: this.limit }),
            this.translate.instant('close'), {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
          console.error('You can only add a maximum of ' + this.limit + ' pictures');
          return;
        }

        // Pre-process the images
        // Test if the files are images and compress them
        this.isPreProcessing = true;
        await Promise.all(fileArray.map(async file => {
          if (!this.helperService.isFileImage(file)) {
            return;
          }

          // Convert the file to base64
          let base64 = '';
          try {
            base64 = await this.helperService.fileToBase64(file);
          } catch (e) {
            console.error(e);
            return;
          }

          // Compress the image
          let compressedBase64 = '';
          try {
            compressedBase64 = await this.imageCompress.compressFile(base64, -1, 50, 75, 640, 640);
            const compressedImageSize = this.helperService.getSizeOfBase64String(compressedBase64);
            const originalImageSize = this.helperService.getSizeOfBase64String(base64);
            if (compressedImageSize >= originalImageSize) {
              // If the compressed image is bigger than the original, use the original
              compressedBase64 = base64;
            }
          } catch (e) {
            console.error('error compressing', e);
            return;
          }

          // Convert back the compressed base64 images to files (so we can send it to server)
          const compressedImage = this.helperService.base64ToFile(compressedBase64);

          tempPicturesList.push({
            imgBase64: compressedBase64,
            img: compressedImage,
            measureDate: file.lastModified, // Use the last modified date as the measure date
          })

        }));

        this.isPreProcessing = false;

        // Reset the input value
        (event.target as HTMLInputElement).value = '';

        if (tempPicturesList.length == 0) {
          console.error('No valid images found');
          // Show error message
          this.snackBar.open('❌ ' + this.translate.instant('no-valid-images-found'), this.translate.instant('close'), {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
          return;
        }

        // Extract the measures from pictures
        this.sendPicturesToServer(tempPicturesList);


      } catch (e) {
        this.isPreProcessing = false;
        console.error(e);
        // Show error message
        this.snackBar.open('❌ ' + this.translate.instant('error-while-processing-images'), this.translate.instant('close'), {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    }

  }


  /**
   * Send pictures to server to extract the measures
   * @param pictures (FileList): list of pictures to send to server for processing
   */
  async sendPicturesToServer(pictures: any[]) {
    this.isDetecting = true;
    this.picturesWaitingForDetection = pictures.length;
    this.picturesDone = 0;

    for (let thermoPicture of pictures) {
      let temperature;
      let isDetected = true;
      try {
        // Send the picture to the server to extract the temperature
        const resDetect: any = await this.backendService.extractTemperature(thermoPicture.img);
        // Si if the unit is in Fahrenheit to convert it to Celsius
        temperature = resDetect.temp;
        if (resDetect.unit.toLowerCase().includes('f')) {
          temperature = (temperature - 32) * 5 / 9;
        }
      } catch (e) {
        console.error('Error on extracting/uploading measures', e);
        isDetected = false;
      }

      // Add the picture to the list
      this.picturesList.push({
        id: uuidv4(),
        imgBase64: thermoPicture.imgBase64,
        measureDate: thermoPicture.measureDate,
        temperature: temperature,
        isDetected: isDetected,
        createdAt: new Date(),
        updatedAt: new Date(),
        isManual: false,
      });

      this.picturesDone++;
    }

    // Save the pictures to local storage
    this.localStorageService.saveMeasuresToLocalStorage(this.picturesList);

    this.isDetecting = false;
    // Show success message
    this.snackBar.open('✔️ ' + this.translate.instant('measures-extraction-completed'), this.translate.instant('close'), {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }


  /**
   * Determine whether to display the photo or not based on the filters
   * @param picture 
   * @returns 
   */
  shouldDisplayPicture(picture: Thermo) {
    if (this.imageIsDetectedFilter == null) {
      return true;
    }
    return picture.isDetected === this.imageIsDetectedFilter;
  }

  /**
   * Determine whether the list empty or not after applying the filters
   * @returns 
   */
  isEmptyFilter() {
    const filteredPhotos = this.picturesList.filter(p => this.shouldDisplayPicture(p));
    return filteredPhotos.length == 0;
  }


  /**
   * On edit picture
   * @param editedPicture 
   */
  onEditPicture(editedPicture: Thermo) {
    this.picturesList = this.picturesList.map(p => {
      if (p.id == editedPicture.id) {
        return editedPicture;
      }
      return p;
    });
    this.localStorageService.saveMeasuresToLocalStorage(this.picturesList);
  }


  /**
   * On delete picture
   * @param deletedPicture 
   */
  onDeletePicture(deletedPicture: Thermo) {
    this.picturesList = this.picturesList.filter(p => p.id !== deletedPicture.id);
    this.localStorageService.saveMeasuresToLocalStorage(this.picturesList);
  }





}
