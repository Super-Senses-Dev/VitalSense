import { Component } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    TranslateModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  modeMenu: MatDrawerMode = 'side';
  showMenu = true;


  /**
   * Toggle the menu when the mode is 'over'
   */
  onMenuClick() {
    if (this.modeMenu === 'over') {
    this.showMenu = !this.showMenu;
    }
  }

}
