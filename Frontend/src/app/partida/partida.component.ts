

import { Component, inject, OnInit } from '@angular/core';
import { Players } from '../Model/PlayerModel';
import { GameService } from '../Services/game.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

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
  usada?: boolean;
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
  cartasJugadas: Card[] = [];
  jugadorActualIndex = 0;
  rondasGanadas: number[] = [];
  rondaActual = 1;
  maxRondas = 8;
  ganadorFinal: string = '';
  showTurno = true;
  Cantidad: number = 2;


   string!: string;

  constructor(private gameService: GameService, private route: Router) {}

  private routeUrl = inject(ActivatedRoute);

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cambiarTurno() {
    this.jugadorActualIndex = (this.jugadorActualIndex + 1) % this.players.length;
    this.showTurno = true;
    setTimeout(() => {
      this.showTurno = false;
    }, 2000);
  }

  cargarJugadores() {
    this.gameService.getPlayers().subscribe((players) => {


       let string = this.routeUrl.snapshot.paramMap.get('cantidadd');
        let numerValue:number = Number(string);
        
      for (let i = 0; i < players.length; i++) {
        if (players[i].id <= numerValue) {
          this.players.push(players[i]);
        }
      }


      if (players.length < 2) {
        Swal.fire('Error', 'Se necesitan al menos 2 jugadores', 'error');
        return;
      }
      this.rondasGanadas = new Array(this.players.length).fill(0);
      this.cartasJugadas = new Array(this.players.length).fill(null);
      this.cargarCartasDelJugador();
    });
  }

  cargarCartasDelJugador() {
    const player = this.players[this.jugadorActualIndex];
    if (!player) return;
    this.gameService.getDeckByPlayer(player.id).subscribe((cartas) => {
      this.cartasJugadorActual = cartas;
    });
  }

  seleccionarCarta(carta: Card) {
    if (carta.usada) return;

    carta.usada = true;
    this.cartasJugadas[this.jugadorActualIndex] = carta;

    const player = this.players[this.jugadorActualIndex];

    this.gameService
      .postJugada({
        playerId: player.id,
        cardId: carta.id,
        rondaId: this.rondaActual,
        atributoSeleccionado: 'speed',
      })
      .subscribe();

    this.jugadorActualIndex++;

    if (this.jugadorActualIndex < this.players.length) {
      this.cargarCartasDelJugador();
    } else {
      this.resolverRonda();
    }
  }

  resolverRonda() {
    const cartasValidas = this.cartasJugadas.filter((c) => c != null);
    if (cartasValidas.length !== this.players.length) return;

    const maxSpeed = Math.max(...cartasValidas.map((c) => c.speed));
    const indicesGanadores = this.cartasJugadas
      .map((carta, index) => (carta?.speed === maxSpeed ? index : -1))
      .filter((index) => index !== -1);

    let mensaje = '';
    if (indicesGanadores.length === 1) {
      const ganadorIndex = indicesGanadores[0];
      this.rondasGanadas[ganadorIndex]++;
      mensaje = `${this.players[ganadorIndex].name} gana la ronda ${this.rondaActual}`;
    } else {
      mensaje = `Empate entre ${indicesGanadores.map((i) => this.players[i].name).join(' y ')} en la ronda ${this.rondaActual}`;
    }

    Swal.fire({
      title: 'Resultado de la ronda',
      text: mensaje,
      icon: 'info',
      confirmButtonText: 'Continuar',
    }).then(() => {
      if (this.rondaActual >= this.maxRondas) {
        this.verificarGanadorFinal();
      } else {
        this.pasarASiguienteRonda();
      }
    });
  }

  verificarGanadorFinal() {
    const maxGanadas = Math.max(...this.rondasGanadas);
    const ganadores = this.rondasGanadas
      .map((rondas, i) => (rondas === maxGanadas ? i : -1))
      .filter((i) => i !== -1);

    if (ganadores.length === 1) {
      const ganadorIndex = ganadores[0];
      this.ganadorFinal = `${this.players[ganadorIndex].name} ganó la partida 🎉`;
      Swal.fire('¡Partida finalizada!', this.ganadorFinal, 'success').then(() => {
        this.route.navigate(['inicio']);
      });
    } else {
      Swal.fire('¡Empate!', 'Se jugará una ronda adicional de desempate', 'info').then(() => {
        this.maxRondas++; 
        this.pasarASiguienteRonda();
      });
    }
  }

  pasarASiguienteRonda() {
    this.rondaActual++;
    this.jugadorActualIndex = 0;
    this.cartasJugadas = new Array(this.players.length).fill(null);
    this.cargarCartasDelJugador();
  }
}
