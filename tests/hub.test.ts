import { describe, expect, it } from 'vitest';
import { direccionEnlace, leerAvisoHub } from '../src/app/hub';

const pagina = 'https://physiodevapp.github.io/physiq/radiostasis/';

describe('enlace desde el hub PhysiQ', () => {
  it('lee el aviso del hub (PHYSIQ_HUB o el campo hub de PHYSIQ_SAT_VISIBLE)', () => {
    expect(leerAvisoHub({ type: 'PHYSIQ_HUB', hub: 'https://physiodevapp.github.io/physiq/', sat: 'radiostasis' }, pagina))
      .toEqual({ hub: 'https://physiodevapp.github.io/physiq/', sat: 'radiostasis' });
    expect(leerAvisoHub({ type: 'PHYSIQ_SAT_VISIBLE', hub: '/physiq/?sat=motion#peer=x', sat: 'radiostasis' }, pagina))
      .toEqual({ hub: 'https://physiodevapp.github.io/physiq/', sat: 'radiostasis' });
    // Sin nombre (o con uno raro), «radiostasis».
    expect(leerAvisoHub({ type: 'PHYSIQ_HUB', hub: 'https://h.example/physiq/', sat: '../x' }, pagina)?.sat).toBe('radiostasis');
  });

  it('descarta lo que no es un aviso o no es seguro', () => {
    expect(leerAvisoHub({ type: 'PHYSIQ_SAT_VISIBLE' }, pagina)).toBeNull();
    expect(leerAvisoHub({ type: 'PHYSIQ_GO_HOME', hub: 'https://h.example/' }, pagina)).toBeNull();
    expect(leerAvisoHub({ type: 'PHYSIQ_HUB', hub: 'javascript:alert(1)' }, pagina)).toBeNull();
    expect(leerAvisoHub({ type: 'PHYSIQ_HUB', hub: 'http://h.example/physiq/' }, pagina)).toBeNull();
    expect(leerAvisoHub({ type: 'PHYSIQ_HUB', hub: 'http://localhost:4180/physiq/' }, pagina)?.hub).toBe('http://localhost:4180/physiq/');
    expect(leerAvisoHub('PHYSIQ_HUB', pagina)).toBeNull();
    expect(leerAvisoHub(null, pagina)).toBeNull();
  });

  it('el enlace abre el hub con el satélite y el fragmento; sin aviso, Radiostasis sola', () => {
    const aviso = { hub: 'https://physiodevapp.github.io/physiq/', sat: 'radiostasis' };
    expect(direccionEnlace('c=hiperaldo:1', aviso, pagina)).toBe('https://physiodevapp.github.io/physiq/?sat=radiostasis#c=hiperaldo:1');
    expect(direccionEnlace('c=hiperaldo:1', null, 'https://radiostasis.example.dev/')).toBe('https://radiostasis.example.dev/#c=hiperaldo:1');
  });
});
