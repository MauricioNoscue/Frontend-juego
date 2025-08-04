import { Component, OnInit } from '@angular/core';
import { Players } from '../Model/PlayerModel';
import { GameService } from '../Services/game.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface Card {
  id: number;
  code: string;
  attack: number;
  speed: number;
  power: number;
  stamina: number;
  jumping: number;
  dribbling: number;
  url: string;
  usada?: boolean; // <- NUEVA
}


@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css',
})
export class PartidaComponent implements OnInit {

  players: Players[] = [];
  cartasJugadorActual: Card[] = [];
  cartasJugadas: Card[] = new Array(2).fill(null); // solo 2 jugadores
  jugadorActualIndex = 0;
  rondasGanadas: number[] = [0, 0]; // índice 0 -> jugador 1, índice 1 -> jugador 2
  rondaActual = 1;
  ganadorRonda: string = '';
  ganadorFinal: string = '';
  reloj = '10:00';

  constructor(private gameService: GameService,private route:Router) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

showTurno = true;

cambiarTurno() {
  this.jugadorActualIndex = (this.jugadorActualIndex + 1) % this.players.length;

  this.showTurno = true;
  setTimeout(() => {
    this.showTurno = false;
  }, 2000); // El tiempo debe coincidir con tu animación CSS
}


  cargarJugadores() {
    this.gameService.getPlayers().subscribe(players => {
      this.players = players;
      this.cargarCartasDelJugador();
    });
  }

  cargarCartasDelJugador() {
    const player = this.players[this.jugadorActualIndex];
    if (!player) return;
    this.gameService.getDeckByPlayer(player.id).subscribe(cartas => {
      this.cartasJugadorActual = cartas;
    });
  }

seleccionarCarta(carta: Card) {
  if (carta.usada) return; // No permitir reutilizar

  carta.usada = true; // <- MARCAR COMO USADA
  this.cartasJugadas[this.jugadorActualIndex] = carta;

  const player = this.players[this.jugadorActualIndex];

  this.gameService.postJugada({
    playerId: player.id,
    cardId: carta.id,
    rondaId: this.rondaActual,
    atributoSeleccionado: 'speed'
  }).subscribe();

  this.jugadorActualIndex++;

  if (this.jugadorActualIndex < this.players.length) {
    this.cargarCartasDelJugador();
  } else {
    this.resolverRonda();
  }
}


 resolverRonda() {
  const carta1 = this.cartasJugadas[0];
  const carta2 = this.cartasJugadas[1];

  if (!carta1 || !carta2) return;

  let mensaje = '';
  if (carta1.speed > carta2.speed) {
    this.rondasGanadas[0]++;
    mensaje = `${this.players[0].name} gana la ronda ${this.rondaActual}`;
  } else if (carta2.speed > carta1.speed) {
    this.rondasGanadas[1]++;
    mensaje = `${this.players[1].name} gana la ronda ${this.rondaActual}`;
  } else {
    mensaje = `Empate en la ronda ${this.rondaActual}`;
  }

  Swal.fire({
    title: 'Resultado de la ronda',
    text: mensaje,
    icon: 'info',
    confirmButtonText: 'Continuar'
  }).then(() => {
    // Verificar si alguien ganó la partida
    if (this.rondasGanadas[0] === 2) {
      this.ganadorFinal = `${this.players[0].name} ganó la partida 🎉`;
      Swal.fire('¡Partida finalizada!', this.ganadorFinal, 'success');
      this.route.navigate(["inicio"])
    } else if (this.rondasGanadas[1] === 2) {
      this.ganadorFinal = `${this.players[1].name} ganó la partida 🎉`;
      Swal.fire('¡Partida finalizada!', this.ganadorFinal, 'success');
      this.route.navigate(["inicio"])

    } else {
      // Siguiente ronda
      this.rondaActual++;
      this.jugadorActualIndex = 0;
      this.cartasJugadas = new Array(2).fill(null);
      this.cargarCartasDelJugador();
    }
  });
}


}
