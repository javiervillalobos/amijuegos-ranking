import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';
import { JuegosComponent } from './juegos/juegos.component';

export const routes: Routes = [
    { path: 'registro', component: RegistroComponent },
    { path: 'juegos', component: JuegosComponent },
    { path: '', redirectTo: '/juegos', pathMatch: 'full' }
];
