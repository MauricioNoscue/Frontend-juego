import { Component, inject, Input, OnInit } from '@angular/core';
import { UserCardComponent } from '../Components/user-card/user-card.component';
import { Players } from '../Model/PlayerModel';
import { PlayerServiceService } from '../Services/player-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sala-espera',
  imports: [UserCardComponent,CommonModule],
  templateUrl: './sala-espera.component.html',
  styleUrl: './sala-espera.component.css'
})
export class SalaEsperaComponent implements OnInit {
  
  @Input() users:Players[] = []
  private service = inject(PlayerServiceService)

  ngOnInit(): void {
    this.service.GetAll().subscribe(data=>{
      this.users = data
      console.log(this.users)
    })
    console.log('hola')
  }
}
