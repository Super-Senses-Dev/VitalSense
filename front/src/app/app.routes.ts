import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { PicturesComponent } from './pages/pictures/pictures.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

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
