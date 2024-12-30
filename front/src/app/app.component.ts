
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent {
  title = 'vital-sense-front';
  private translate = inject(TranslateService);

  constructor() {
    this.initLanguage();
  }

  /**
   * Setup the language for the application
   */
  initLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      // If the language is saved in the local storage, use it
      this.translate.use(savedLang);
    } else {
      // Otherwise, use the browser language
      const browserLang = this.translate.getBrowserLang() ?? 'en';
      this.translate.use(browserLang);
    }
  }
}
