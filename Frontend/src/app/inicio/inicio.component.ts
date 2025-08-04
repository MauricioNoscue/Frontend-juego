import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Importa FormsModule
import { PlayerServiceService } from '../Services/player-service.service';
import { Players } from '../Model/PlayerModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true, // ← Componente standalone
  imports: [FormsModule], // ← Agrega FormsModule aquí
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  nombre: string = '';

  constructor() { }

  private servicie = inject(PlayerServiceService)
private router = inject(Router)
  objeto :Players ={
    id: 0,
    name: this.nombre,
  }

  onSubmit() {
    if (this.nombre.trim()) {

this.servicie.Save(this.objeto).subscribe(op=>{
  this.router.navigate(['SalaEspera'])
})

      console.log('Nombre ingresado:', this.nombre);
      alert(`¡Hola ${this.nombre}! Bienvenido/a`);
    } else {
      alert('Por favor, ingresa tu nombre');
    }
  }

  limpiarCampo() {
    this.nombre = '';
  }
}