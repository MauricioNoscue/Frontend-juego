import { Component, inject, Input, OnInit } from '@angular/core';
import { Players } from '../Model/PlayerModel';
import { PlayerServiceService } from '../Services/player-service.service';

@Component({
  selector: 'app-modulo-unirse',
  standalone: true,
  // imports: [],
  templateUrl: './modulo-unirse.component.html',
  styleUrl: './modulo-unirse.component.css',
})
export class ModuloUnirseComponent  {
  joinStadium(): void {
    console.log('Unirse al estadio');
    // Aquí podrías navegar, enviar una solicitud, abrir un modal, etc.
  }
}
