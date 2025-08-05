import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Importa FormsModule
import { PlayerServiceService } from '../Services/player-service.service';
import { Players } from '../Model/PlayerModel';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


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
    this.objeto.name = this.nombre;
    this.servicie.Save(this.objeto).subscribe(op => {
      this.router.navigate(['unirse']);
    });

    console.log(this.objeto);
    console.log('Nombre ingresado:', this.nombre);

    Swal.fire({
      title: `¡Hola ${this.nombre}!`,
      text: 'Bienvenido/a',
      icon: 'success',
      confirmButtonText: 'Continuar'
    });

  } else {
    Swal.fire({
      title: 'Nombre requerido',
      text: 'Por favor, ingresa tu nombre',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}


  limpiarCampo() {
    this.nombre = '';
  }
}