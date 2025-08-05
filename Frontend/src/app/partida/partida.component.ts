


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
  cartasPorJugador: { [key: number]: Card[] } = {};
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
    this.jugadorActualIndex =
      (this.jugadorActualIndex + 1) % this.players.length;
    this.showTurno = true;
    setTimeout(() => {
      this.showTurno = false;
    }, 2000);
  }

  cargarJugadores() {
    this.gameService.getPlayers().subscribe((players) => {
      let string = this.routeUrl.snapshot.paramMap.get('cantidadd');
      let numerValue: number = Number(string);

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

    // Si ya tenemos las cartas en memoria, las usamos
    if (this.cartasPorJugador[player.id]) {
      this.cartasJugadorActual = this.marcarCartasUsadas(
        player.id,
        this.cartasPorJugador[player.id]
      );
      return;
    }

    // Si no están, las pedimos al backend
    this.gameService.getDeckByPlayer(player.id).subscribe((cartas) => {
      const cartasMarcadas = this.marcarCartasUsadas(player.id, cartas);
      this.cartasPorJugador[player.id] = cartasMarcadas;
      this.cartasJugadorActual = cartasMarcadas;
    });
  }

  marcarCartasUsadas(playerId: number, cartas: Card[]): Card[] {
    const usadas = JSON.parse(
      localStorage.getItem(`cartasUsadas_${playerId}`) || '[]'
    ) as number[];
    return cartas.map((carta) => ({
      ...carta,
      usada: usadas.includes(carta.id),
    }));
  }

  seleccionarCarta(carta: Card) {
    if (carta.usada) return;

    carta.usada = true;

    // Guardar en localStorage
    const player = this.players[this.jugadorActualIndex];
    const playerId = player.id;
    let usadas = JSON.parse(
      localStorage.getItem(`cartasUsadas_${playerId}`) || '[]'
    );
    usadas.push(carta.id);
    localStorage.setItem(`cartasUsadas_${playerId}`, JSON.stringify(usadas));

    this.cartasJugadas[this.jugadorActualIndex] = carta;

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
      mensaje = `Empate entre ${indicesGanadores
        .map((i) => this.players[i].name)
        .join(' y ')} en la ronda ${this.rondaActual}`;
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

  habilitarCartaAleatoriaPorJugador() {
    this.players.forEach((player) => {
      const cartas = this.cartasPorJugador[player.id];
      if (!cartas) return;

      // Verificar si todas las cartas están usadas
      const todasUsadas = cartas.every((c) => c.usada);
      if (todasUsadas) {
        // Seleccionar una carta aleatoria
        const indiceAleatorio = Math.floor(Math.random() * cartas.length);
        const carta = cartas[indiceAleatorio];

        // Marcar como disponible
        carta.usada = false;

        // Eliminarla del localStorage
        let usadas = JSON.parse(
          localStorage.getItem(`cartasUsadas_${player.id}`) || '[]'
        );
        usadas = usadas.filter((id: number) => id !== carta.id);
        localStorage.setItem(
          `cartasUsadas_${player.id}`,
          JSON.stringify(usadas)
        );
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

      // Limpiar cartas usadas
      this.players.forEach((p) =>
        localStorage.removeItem(`cartasUsadas_${p.id}`)
      );

      Swal.fire('¡Partida finalizada!', this.ganadorFinal, 'success').then(
        () => {
          this.route.navigate(['inicio']);
        }
      );
    } else {
      // Empate, se juega ronda adicional
      this.habilitarCartaAleatoriaPorJugador(); 

      Swal.fire(
        '¡Empate!',
        'Se jugará una ronda adicional de desempate',
        'info'
      ).then(() => {
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
