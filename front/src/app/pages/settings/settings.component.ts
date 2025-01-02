import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  translate = inject(TranslateService);
  selectedLanguage = 'en';

  ngOnInit(): void {
    // Get current language
    this.selectedLanguage = this.translate.currentLang;
  }


  /**
   * Change the language
   */
  onLanguageChange() {
    localStorage.setItem('language', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }


}
