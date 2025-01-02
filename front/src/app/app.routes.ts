import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { PicturesComponent } from './pages/pictures/pictures.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ParentChildProfileComponent } from './pages/parent-child-profile/parent-child-profile.component';
import { ChartComponent } from './pages/chart/chart.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'pictures',
        pathMatch: 'full'
    },

    // Todo: route for generating pdf

    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'pictures',
                component: PicturesComponent
            },
            {
                path: 'parent-child-profile',
                component: ParentChildProfileComponent
            },
            {
                path: 'chart',
                component: ChartComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            }
        ]
    },
    {
        path: '404',
        component: NotFoundComponent,
    },
    {
        path: '**',
        redirectTo: '404',
    }
];
