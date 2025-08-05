import { Component, inject } from '@angular/core';
import { SComponent } from '../Components/s/s.component';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-modulo-unirse',
  imports: [SComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './modulo-unirse.component.html',
  styleUrl: './modulo-unirse.component.css',
})
export class ModuloUnirseComponent {
  private route = inject(Router);
  selected = '';

  joinStadium(): void {
    this.route.navigate(['SalaEspera',this.selected]);


  }
}
