import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Pega aquí el enlace público de Google Forms cuando esté creado.
  // Sus respuestas se guardarán automáticamente en la hoja de cálculo vinculada.
  readonly rsvpFormUrl = '';
}
