import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

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
export class LayoutComponent implements OnInit {

  modeMenu: MatDrawerMode = 'side';
  showMenu = true;
  pageTitle = 'Pictures';
  router = inject(Router);


  /**
   * Toggle the menu when the mode is 'over'
   */
  onMenuClick() {
    if (this.modeMenu === 'over') {
      this.showMenu = !this.showMenu;
    }
  }

  ngOnInit() {
    // Update page title
    this.updatePageTitle();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });

    // Handle responsive menu setup
    if (window.innerWidth <= 1024) {
      this.showMenu = false;
      this.modeMenu = 'over';
    } else {
      this.showMenu = true;
      this.modeMenu = 'side';
    }
  }

  // Also, handle the responsive menu setup dynamically
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1024) {
      this.showMenu = false;
      this.modeMenu = 'over';
    } else {
      this.showMenu = true;
      this.modeMenu = 'side';
    }
  }


  /**
   * Update the page title based on the current route
   */
  updatePageTitle() {
    const route = this.router.url;
    if (route.includes('pictures')) {
      this.pageTitle = 'Pictures';
    } else if (route.includes('profile')) {
      this.pageTitle = 'Parent and child profile';
    } else if (route.includes('chart')) {
      this.pageTitle = 'Chart and export';
    } else if (route.includes('settings')) {
      this.pageTitle = 'Settings';
    } else {
      this.pageTitle = '';
    }
  }

}
