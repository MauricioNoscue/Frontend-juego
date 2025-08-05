import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../partida/partida.component';
import { Players } from '../Model/PlayerModel';

@Injectable({
  providedIn: 'root'
})
export class GameService {

   private api = 'https://localhost:7145/api'; // ajusta

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Players[]> {
    return this.http.get<Players[]>(`${this.api}/player`);
  }

 getDeckByPlayer(playerId: number): Observable<Card[]> {
  return this.http.get<Card[]>(`${this.api}/GamePlayer/cards-by-player/${playerId}`);
}


  postJugada(jugada: any): Observable<any> {
    return this.http.post(`${this.api}/jugada`, jugada);
  }
}
