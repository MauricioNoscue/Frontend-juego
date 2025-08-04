import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Players } from '../Model/PlayerModel';

@Injectable({
  providedIn: 'root'
})
export class PlayerServiceService {

 
 protected urlbase = environment.apiUrl
  protected http = inject(HttpClient);
   constructor() {
    
    }

    public Save(player:Players){
      return this.http.post(`${this.urlbase}player`, player);
    }
    public GetAll():Observable<Players[]>{
      return this.http.get<Players[]>(`${this.urlbase + 'player'}`);
    }


}
