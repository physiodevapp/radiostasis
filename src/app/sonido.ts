/**
 * Sonido del simulador, sintetizado con Web Audio (sin archivos).
 *
 * - Ruedas: «clic» suave de trinquete en cada paso del giro.
 * - Pulso: golpe grave doble («lub-dub») al ritmo del latido de la arteria
 *   grande; se oye la frecuencia cardíaca.
 * Las agujas y barras no suenan (lo pidió Edu: solo ruedas y latido).
 *
 * Se recuerda entre visitas (hito 3e), pero el navegador solo deja crear el
 * audio tras una pulsación: el contexto nace al activar el botón «Sonido» o,
 * si se dejó encendido, con la primera pulsación en la página (`restaurar`).
 */

export interface Sonido {
  readonly activo: boolean;
  alternar(): boolean;
  /**
   * Encendido de la visita anterior: suena desde la primera pulsación en la
   * página. `alArrancar` avisa cuando el audio ya puede sonar.
   */
  restaurar(alArrancar?: () => void): void;
  sintonia(intensidad: number): void;
  latido(): void;
}

export function crearSonido(): Sonido {
  // Empieza apagado; `restaurar` lo enciende si se dejó así en la visita anterior.
  let activo = false;
  let ctx: AudioContext | null = null;
  let maestro: GainNode | null = null;
  let ruido: AudioBuffer | null = null;
  let ultimaSintonia = 0;

  function preparar() {
    if (ctx) return;
    ctx = new AudioContext();
    maestro = ctx.createGain();
    maestro.gain.value = 0.9;
    maestro.connect(ctx.destination);
    // Un segundo de ruido blanco, reutilizable.
    ruido = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  /** Ráfaga de ruido filtrado con envolvente. */
  function rafaga(opciones: { tipo: BiquadFilterType; frecuencia: number; q: number; volumen: number; ataque: number; duracion: number; retraso?: number }) {
    if (!ctx || !maestro || !ruido) return;
    const t = ctx.currentTime + (opciones.retraso ?? 0);
    const fuente = ctx.createBufferSource();
    fuente.buffer = ruido;
    fuente.loop = true;
    const filtro = ctx.createBiquadFilter();
    filtro.type = opciones.tipo;
    filtro.frequency.value = opciones.frecuencia;
    filtro.Q.value = opciones.q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(opciones.volumen, t + opciones.ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + opciones.duracion);
    fuente.connect(filtro).connect(g).connect(maestro);
    fuente.start(t, Math.random() * 0.9);
    fuente.stop(t + opciones.duracion + 0.05);
  }

  /** Pitido corto (confirmación al activar el sonido). */
  function pitido(frecuencia: number, retraso: number) {
    if (!ctx || !maestro) return;
    const t = ctx.currentTime + retraso;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frecuencia;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(g).connect(maestro);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  /** Golpe con caída de tono (un tono del latido): senoidal y un armónico suave. */
  function golpe(retraso: number, volumen: number, frecuencia: number) {
    if (!ctx || !maestro) return;
    const t = ctx.currentTime + retraso;
    // El armónico (el doble de frecuencia, más flojo) hace que se oiga también
    // en altavoces pequeños, sin perder el carácter de tono puro.
    for (const [mult, vol] of [[1, volumen], [2, volumen * 0.3]]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frecuencia * mult, t);
      osc.frequency.exponentialRampToValueAtTime(frecuencia * mult * 0.6, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(g).connect(maestro);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  // Pestaña en segundo plano: el audio se suspende.
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (activo) void ctx.resume();
  });

  return {
    get activo() {
      return activo;
    },
    alternar() {
      activo = !activo;
      if (activo) {
        preparar();
        void ctx!.resume();
        console.info('Radiostasis · sonido activado, estado del audio:', ctx!.state);
        // Confirmación audible: dos pitidos ascendentes y un soplo de sintonía.
        pitido(660, 0.02);
        pitido(990, 0.14);
        rafaga({ tipo: 'lowpass', frecuencia: 1200, q: 0.4, volumen: 0.06, ataque: 0.02, duracion: 0.2 });
      } else if (ctx) {
        void ctx.suspend();
      }
      return activo;
    },
    restaurar(alArrancar) {
      activo = true;
      // En pantallas táctiles, apoyar el dedo (pointerdown) no cuenta como
      // pulsación para el audio: cuenta levantarlo (pointerup, touchend, click).
      // Se intenta en todos y se deja de escuchar cuando el audio ya suena.
      const eventos = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const;
      let hecho = false;
      const quitar = () => {
        eventos.forEach((t) => document.removeEventListener(t, arrancar, true));
        if (!hecho) {
          hecho = true;
          alArrancar?.();
        }
      };
      function arrancar() {
        if (!activo) return quitar();
        preparar();
        if (ctx!.state === 'running') return quitar();
        void ctx!.resume().then(() => {
          if (ctx!.state === 'running') quitar();
        });
      }
      eventos.forEach((t) => document.addEventListener(t, arrancar, true));
    },
    sintonia(intensidad) {
      if (!activo) return;
      const ahora = performance.now();
      if (ahora - ultimaSintonia < 40) return;
      ultimaSintonia = ahora;
      const k = Math.min(1, Math.max(0.2, intensidad));
      // «Clic» suave de trinquete en cada paso del giro: dos transitorios muy
      // cortos de ruido en tonos medios (sin agudos, para que no suene metálico).
      const tono = 1300 + Math.random() * 300;
      rafaga({ tipo: 'bandpass', frecuencia: tono, q: 1.4, volumen: 0.07 + 0.03 * k, ataque: 0.001, duracion: 0.012 });
      rafaga({ tipo: 'bandpass', frecuencia: tono * 0.75, q: 1.4, volumen: 0.04 + 0.02 * k, ataque: 0.001, duracion: 0.014, retraso: 0.007 });
    },
    latido() {
      if (!activo || document.hidden) return;
      // El de la primera versión (a048e15), elegido por Edu, algo menos grave
      // (antes 70 y 85 Hz) para que se oiga mejor.
      golpe(0, 0.22, 110); // «lub»
      golpe(0.13, 0.14, 135); // «dub», más corto y algo más agudo
    },
  };
}
