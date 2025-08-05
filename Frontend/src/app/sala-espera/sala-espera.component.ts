import { Component, inject, Input, OnInit } from '@angular/core';
import { UserCardComponent } from '../Components/user-card/user-card.component';
import { Players } from '../Model/PlayerModel';
import { PlayerServiceService } from '../Services/player-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sala-espera',
  imports: [UserCardComponent, CommonModule],
  templateUrl: './sala-espera.component.html',
  styleUrl: './sala-espera.component.css',
})
export class SalaEsperaComponent implements OnInit {
  private routeUrl = inject(ActivatedRoute);

  string!: string;
  numerValue!: number;

  @Input() users: Players[] = [];
  private service = inject(PlayerServiceService);
  private router = inject(Router);
  ngOnInit(): void {
    this.service.GetAll().subscribe((data) => {
      let string = this.routeUrl.snapshot.paramMap.get('cantidad');
      console.log(string);
      console.log("datica")
      console.log(data.length);
      let num = data
      this.numerValue = Number(string);

      for (let i = 0; i < data.length; i++) {
        if (data[i].id <= this.numerValue) {
          this.users.push(data[i]);
        }
      }
 
      console.log(this.users);
    });
  }

  viajar(): void {
    this.router.navigate(['juego', this.numerValue]);
  }
}
