import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Pega aquí la URL del despliegue de Google Apps Script (ver docs/google-apps-script.gs).
  readonly rsvpEndpoint = '';

  rsvp = {
    name: '',
    email: '',
    attendance: '',
    guests: '1',
    dietary: '',
    song: '',
    note: '',
    website: ''
  };

  status: 'idle' | 'sending' | 'sent' | 'setup' = 'idle';

  async submitRsvp(): Promise<void> {
    if (!this.rsvpEndpoint) {
      this.status = 'setup';
      return;
    }

    this.status = 'sending';
    try {
      await fetch(this.rsvpEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...this.rsvp, submittedAt: new Date().toISOString() })
      });
      this.status = 'sent';
    } catch {
      this.status = 'idle';
    }
  }
}
