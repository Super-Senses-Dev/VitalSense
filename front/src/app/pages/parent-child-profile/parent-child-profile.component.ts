import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-parent-child-profile',
  standalone: true,
  imports: [
    MatSnackBarModule,
    TranslateModule,
    ReactiveFormsModule],
  templateUrl: './parent-child-profile.component.html',
  styleUrl: './parent-child-profile.component.scss'
})
export class ParentChildProfileComponent implements OnInit {
 
  private formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslateService);
  localStorageService = inject(LocalstorageService);

  parentChildForm: FormGroup = this.formBuilder.group({
    parentName: [''],
    parentContact: [''],
    childName: [''],
    childAge: [''],
    childMedicalCondition: ['']
  });


  ngOnInit(): void {
    // Get the parent child profile from the local storage
    const parentChildProfile = this.localStorageService.getParentChildProfileFromLocalStorage();
    if (parentChildProfile && Object.keys(parentChildProfile).length > 0) {
      this.parentChildForm.setValue(parentChildProfile);
    }
  }


  /**
   * Submit the form
   */
  onSubmit() {
    if (this.parentChildForm.valid) {
      //localStorage.setItem('parentChildProfile', JSON.stringify(this.parentChildForm.value));
      this.localStorageService.saveParentChildProfileToLocalStorage(this.parentChildForm.value);
      this.snackBar.open('✔️ ' + this.translate.instant('profile-saved-successfully'), this.translate.instant('close'), {
        duration: 5000,
        horizontalPosition: 'end',
      });
    } else {
      this.snackBar.open('⚠️ ' + this.translate.instant('please-fill-in-all-required-fields'), this.translate.instant('close'), {
        duration: 5000
      });
    }
  }
}
