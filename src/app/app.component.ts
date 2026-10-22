import { Component, ElementRef, ViewChild, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Language = 'es' | 'ro';

const translations = {
  es: {
    nav: { ceremony: 'La ceremonia', celebration: 'La celebración', rsvp: 'Asistencia' },
    hero: { eyebrow: 'Nos casamos', title: 'Marta & Claudiu', date: '2 de julio de 2027', subtitle: 'Cuando caiga el sol, brindaremos bajo las estrellas con los nuestros.', cta: 'Confirma tu asistencia', location: 'Navalcarnero · Madrid', scroll: 'Desliza para descubrir' },
    intro: { eyebrow: 'Un día para recordar', title: 'Celebraremos el comienzo de nuestra historia rodeados de las personas que más queremos.' },
    ceremony: { eyebrow: 'La ceremonia', title: 'Iglesia de Nuestra Señora de la Asunción', text: 'Diremos el «sí, quiero» en esta iglesia parroquial del centro de Navalcarnero. Nos encantaría teneros cerca en este momento tan especial.', address: 'Plaza de Segovia, 1 · Navalcarnero, Madrid', directions: 'Cómo llegar' },
    celebration: { eyebrow: 'La celebración', title: 'Finca Las Bocas', lead: 'Tras la ceremonia, seguimos la fiesta en la finca: cóctel, cena y baile con los nuestros hasta bien entrada la noche.', ceremony: 'Ceremonia', ceremonyPlace: 'Iglesia de Nuestra Señora de la Asunción, Navalcarnero', dinner: 'Cóctel & cena', dinnerPlace: 'Finca Las Bocas, Cubas de la Sagra', party: 'Fiesta', partyPlace: 'Hasta las 04:00', directions: 'Cómo llegar a la finca' },
    rsvp: { eyebrow: '¿Nos acompañas?', title: 'Tu presencia será nuestro mejor regalo.', text: 'Confirma tu asistencia y cuéntanos todo lo que necesitemos saber para celebrarlo contigo.', name: 'Nombre y apellidos', namePlaceholder: '¿Cómo te llamas?', attendance: '¿Nos acompañas?', select: 'Selecciona una opción', yes: 'Sí, allí estaré', no: 'No podré asistir', guests: '¿Vienes acompañado? Indícanos el nombre', guestsPlaceholder: 'Nombre y apellidos de tus acompañantes', song: 'Una canción para bailar', songPlaceholder: 'Título y artista', dietary: '¿Alguna alergia o intolerancia alimentaria?', dietaryPlaceholder: 'Cuéntanos si alguien del grupo la tiene', note: '¿Quieres decirnos algo?', notePlaceholder: 'Nos encantará leerte', send: 'Enviar confirmación', sending: 'Enviando…', setup: 'El formulario estará disponible muy pronto.', thanks: '¡Gracias!', received: 'Hemos recibido tu respuesta.', required: 'Los campos con * son obligatorios.', error: 'No hemos podido guardar tu respuesta. Inténtalo de nuevo en unos minutos o escríbenos directamente.' },
    footer: 'Con mucho cariño'
  },
  ro: {
    nav: { ceremony: 'Ceremonia', celebration: 'Petrecerea', rsvp: 'Confirmare' },
    hero: { eyebrow: 'Ne căsătorim', title: 'Marta & Claudiu', date: '2 iulie 2027', subtitle: 'Când apune soarele, vom ciocni un pahar sub stele, alături de cei dragi.', cta: 'Confirmă prezența', location: 'Navalcarnero · Madrid', scroll: 'Descoperă invitația' },
    intro: { eyebrow: 'O zi de neuitat', title: 'Vom sărbători începutul poveștii noastre alături de oamenii pe care îi iubim cel mai mult.' },
    ceremony: { eyebrow: 'Ceremonia', title: 'Biserica Nuestra Señora de la Asunción', text: 'Ne vom spune „da” în această biserică parohială din centrul orașului Navalcarnero. Ne-ar face mare plăcere să vă avem alături în acest moment special.', address: 'Plaza de Segovia, 1 · Navalcarnero, Madrid', directions: 'Cum ajungi' },
    celebration: { eyebrow: 'Petrecerea', title: 'Finca Las Bocas', lead: 'După ceremonie, continuăm petrecerea la finca: cocktail, cină și dans alături de cei dragi, până târziu în noapte.', ceremony: 'Ceremonia', ceremonyPlace: 'Biserica Nuestra Señora de la Asunción, Navalcarnero', dinner: 'Cocktail & cină', dinnerPlace: 'Finca Las Bocas, Cubas de la Sagra', party: 'Petrecerea', partyPlace: 'Până la 04:00', directions: 'Cum ajungi la finca' },
    rsvp: { eyebrow: 'Ne însoțești?', title: 'Prezența ta va fi cel mai frumos dar.', text: 'Confirmă prezența și spune-ne tot ce trebuie să știm pentru a sărbători împreună.', name: 'Nume și prenume', namePlaceholder: 'Cum te numești?', attendance: 'Ne însoțești?', select: 'Alege o opțiune', yes: 'Da, voi fi acolo', no: 'Nu voi putea participa', guests: 'Vii însoțit? Spune-ne numele', guestsPlaceholder: 'Numele complet al însoțitorilor', song: 'O melodie pentru dans', songPlaceholder: 'Titlu și artist', dietary: 'Ai alergii sau intoleranțe alimentare?', dietaryPlaceholder: 'Spune-ne dacă cineva din grup le are', note: 'Vrei să ne spui ceva?', notePlaceholder: 'Ne va face plăcere să citim', send: 'Trimite confirmarea', sending: 'Se trimite…', setup: 'Formularul va fi disponibil în curând.', thanks: 'Mulțumim!', received: 'Am primit răspunsul tău.', required: 'Câmpurile cu * sunt obligatorii.', error: 'Nu am putut salva răspunsul tău. Încearcă din nou în câteva minute sau scrie-ne direct.' },
    footer: 'Cu mult drag'
  }
} as const;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly rsvpEndpoint = 'https://script.google.com/macros/s/AKfycbz7AoOUlfypDvMUD34QknDnxvZPpK0YXhGpIMQdB41GXFDfCnvGLzffID-X_JWUi0W2/exec';

  @ViewChild('bgAudio') private bgAudioRef!: ElementRef<HTMLAudioElement>;
  musicPlaying = false;
  entered = false;
  language: Language = 'es';
  copy: (typeof translations)[Language] = translations.es;

  constructor() {
    afterNextRender(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    });
  }

  selectLanguage(language: Language): void {
    this.language = language;
    this.copy = translations[language];
    this.enterSite();
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

  rsvp = { name: '', attendance: '', guestNames: '', dietary: '', song: '', note: '', website: '' };
  status: 'idle' | 'sending' | 'sent' | 'setup' | 'error' = 'idle';

  async submitRsvp(): Promise<void> {
    if (!this.rsvpEndpoint) { this.status = 'setup'; return; }
    this.status = 'sending';
    try {
      // Content-Type text/plain evita el preflight CORS; Apps Script responde con Access-Control-Allow-Origin: *.
      const response = await fetch(this.rsvpEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...this.rsvp, language: this.language, submittedAt: new Date().toISOString() }) });
      const result = await response.json();
      this.status = result.ok ? 'sent' : 'error';
    } catch {
      this.status = 'error';
    }
  }
}
