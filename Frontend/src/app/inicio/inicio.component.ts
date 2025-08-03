import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Importa FormsModule

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

  onSubmit() {
    if (this.nombre.trim()) {
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