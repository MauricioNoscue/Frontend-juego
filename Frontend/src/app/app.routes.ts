import { Routes } from '@angular/router';

import { SalaEsperaComponent } from './sala-espera/sala-espera.component';
import { InicioComponent } from './inicio/inicio.component';
import { PartidaComponent } from './partida/partida.component';
import { ModuloUnirseComponent } from './modulo-unirse/modulo-unirse.component';

export const routes: Routes = [


{ path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },

    {path: 'SalaEspera/:cantidad',component: SalaEsperaComponent},
    {path: 'juego/:cantidadd',component: PartidaComponent},
    {path: 'unirse',component: ModuloUnirseComponent}





]
