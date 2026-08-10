import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
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
  readonly rsvpEndpoint = 'https://script.google.com/macros/s/AKfycbw7t3eRsWisOVXiLQZPN0TkXQvvDRz44YBMPbJLY8XXRvy9I1g1S9nP8c11EkgD34XW/exec';

  @ViewChild('bgAudio') private bgAudioRef!: ElementRef<HTMLAudioElement>;
  musicPlaying = false;
  entered = false;

  constructor() {
    // Los navegadores solo permiten reproducir audio con sonido tras un gesto real del
    // usuario. Bloqueamos el scroll hasta que pulse la portada de entrada, que es el gesto
    // que desbloquea la música de forma garantizada.
    afterNextRender(() => document.body.style.overflow = 'hidden');
  }

  enterSite(): void {
    this.entered = true;
    document.body.style.overflow = '';
    this.playMusic();
  }

  playMusic(): void {
    this.bgAudioRef.nativeElement.play()
      .then(() => this.musicPlaying = true)
      .catch(() => this.musicPlaying = false);
  }

  toggleMusic(): void {
    if (this.musicPlaying) {
      this.bgAudioRef.nativeElement.pause();
      this.musicPlaying = false;
    } else {
      this.playMusic();
    }
  }

  rsvp = {
    name: '',
    attendance: '',
    guestNames: '',
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
