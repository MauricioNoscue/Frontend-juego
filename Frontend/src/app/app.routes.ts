import { Routes } from '@angular/router';

import { SalaEsperaComponent } from './sala-espera/sala-espera.component';
import { InicioComponent } from './inicio/inicio.component';
import { PartidaComponent } from './partida/partida.component';

export const routes: Routes = [


{ path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },

    {path: 'SalaEspera',component: SalaEsperaComponent},
    {path: 'juego',component: PartidaComponent}




]