import { DexEntry } from './types';

export const INITIAL_DEX_ENTRIES: DexEntry[] = [
  {
    id: 'hardware',
    name: 'Hardware',
    category: 'hardware',
    simpleDefinition: 'Lo que puedes tocar físicamente (pantalla, cable, teclas, circuitos).',
    phoneAnalogy: 'En tu celular: la pantalla de cristal templado, la batería que calienta tu mano, la cámara y el puerto de carga.',
    technicalNote: 'Componentes electromecánicos y electrónicos tangibles de un sistema computacional.',
    unlocked: false,
    zone: 'Plaza Inicial / Laboratorio'
  },
  {
    id: 'software',
    name: 'Software',
    category: 'software',
    simpleDefinition: 'Lo que tienes que instalar (apps, programas, sistema operativo).',
    phoneAnalogy: 'En tu celular: TikTok, WhatsApp, los videojuegos y los ajustes de configuración. No los puedes tocar en el aire, pero dirigen todo.',
    technicalNote: 'Conjunto de instrucciones, programas, reglas y datos informáticos codificados.',
    unlocked: false,
    zone: 'Plaza Inicial / Laboratorio'
  },
  {
    id: 'driver',
    name: 'Controlador (Driver)',
    category: 'software',
    simpleDefinition: 'Un software que le enseña a la computadora cómo hablar con algo que le conectaste (como un teclado o una impresora).',
    phoneAnalogy: 'Si compras unos audífonos Bluetooth raros y el celular te pide "instalar la app compañera" para poder ecualizar y que reconozca los botones.',
    technicalNote: 'Software de bajo nivel que actúa como puente entre el Sistema Operativo y el hardware periférico.',
    unlocked: false,
    zone: 'Hospital de Dispositivos'
  },
  {
    id: 'distribucion',
    name: 'Distribución de Teclado',
    category: 'software',
    simpleDefinition: 'El mapa de las teclas. Si la computadora cree que tienes un teclado en inglés o francés, al presionar una tecla escribirá otra diferente.',
    phoneAnalogy: 'Cuando en el teclado virtual de tu celular cambias de idioma a Francés o Inglés y la letra "A" cambia de posición o desaparece la "Ñ".',
    technicalNote: 'Asignación lógica de caracteres (ej. QWERTY Español vs. AZERTY Francés) controlada por el software del sistema.',
    unlocked: false,
    zone: 'Laboratorio de Diagnóstico'
  },
  {
    id: 'puerto',
    name: 'Puerto / Entrada',
    category: 'hardware',
    simpleDefinition: 'Los enchufes específicos donde conectas cables (USB, HDMI, corriente).',
    phoneAnalogy: 'La ranura USB-C donde metes el cargador o la ranura nano-SIM.',
    technicalNote: 'Interfaz física que permite la transmisión electroóptica de datos o suministro de energía entre dispositivos.',
    unlocked: false,
    zone: 'Hospital de Dispositivos'
  },
  {
    id: 'sistema_operativo',
    name: 'Sistema Operativo (SO)',
    category: 'sistema',
    simpleDefinition: '(Windows, Android, Linux). El programa principal que administra todo lo demás.',
    phoneAnalogy: 'Android o iOS en tu teléfono. Sin él, el teléfono sería solo un tabique de cristal negro que no sabe qué hacer.',
    technicalNote: 'Programa maestro que gestiona el procesador, memoria RAM, almacenamiento y permite ejecutar aplicaciones de usuario.',
    unlocked: false,
    zone: 'Laboratorio / Examen UNAM'
  },
  {
    id: 'obsolescencia_percibida',
    name: 'Obsolescencia Percibida',
    category: 'ambiente',
    simpleDefinition: 'Cuando un equipo sirve al 100%, pero se siente "viejo" porque salió uno nuevo.',
    phoneAnalogy: 'Tu celular toma fotos increíbles y corre tus juegos, pero tus amigos ya tienen el modelo del año y sientes que el tuyo "ya no rifa".',
    technicalNote: 'Estrategia de mercadotecnia sociocultural que induce al usuario a desechar productos perfectamente útiles.',
    unlocked: false,
    zone: 'Callejón del Tiempo'
  },
  {
    id: 'incompatibilidad',
    name: 'Incompatibilidad Técnica',
    category: 'sistema',
    simpleDefinition: 'Cuando una app moderna pide una pieza o sistema que la máquina antigua no tiene.',
    phoneAnalogy: 'Cuando la Play Store dice: "Tu dispositivo no es compatible con esta versión de la app" porque tu versión de Android es muy vieja.',
    technicalNote: 'Falta de interoperabilidad por requerimientos de arquitectura, memoria o API no soportadas por la versión del sistema.',
    unlocked: false,
    zone: 'Examen UNAM / Callejón'
  },
  {
    id: 'manejo_especializado',
    name: 'Manejo Especializado (PAEC)',
    category: 'ambiente',
    simpleDefinition: 'El destino final seguro de un aparato que ya no tiene arreglo; nunca debe ir al bote de basura común porque contamina con metales pesados.',
    phoneAnalogy: 'Las baterías infladas de celular o pantallas rotas con mercurio y plomo. Si las tiras al camión de basura, envenenan mantos acuíferos.',
    technicalNote: 'Recolección, desmantelamiento y reciclaje de Residuos de Aparatos Eléctricos y Electrónicos (RAEE) bajo norma oficial.',
    unlocked: false,
    zone: 'Estación Cero Basura'
  },
  {
    id: 'perifericos_io',
    name: 'Periféricos (Entrada y Salida)',
    category: 'hardware',
    simpleDefinition: 'Aparatos externos que conectas a la computadora: ENTRADA (le meten datos: teclado, mouse, micro) y SALIDA (te muestran resultados: pantalla, bocina, impresora).',
    phoneAnalogy: 'En tu celular: la pantalla táctil y el micrófono son de ENTRADA (reciben tus dedos y tu voz). La bocina y la pantalla que brilla son de SALIDA (te muestran videos y música).',
    technicalNote: 'Dispositivos auxiliares e independientes conectados a la CPU que gestionan la comunicación bidireccional entre el usuario y el sistema.',
    unlocked: false,
    zone: 'Taller de Ensamblaje'
  }
];

export interface ZoneMeta {
  id: number;
  name: string;
  subtitle: string;
  badge: string;
  color: string;
  mapBounds: { xMin: number; xMax: number; yMin: number; yMax: number };
  spawn: { x: number; y: number };
  goal: string;
}

export const ZONES: Record<number, ZoneMeta> = {
  1: {
    id: 1,
    name: 'Plaza Inicial CETis',
    subtitle: 'La Caja del Misterio',
    badge: 'Módulo 1: Hipótesis',
    color: 'emerald',
    mapBounds: { xMin: 0, xMax: 16, yMin: 0, yMax: 12 },
    spawn: { x: 4, y: 7 },
    goal: 'Inspecciona la caja de cartón "BASURA" y plantea tu hipótesis inicial con el Profesor.'
  },
  2: {
    id: 2,
    name: 'El Taller de Ensamblaje',
    subtitle: 'Puertos, Periféricos y Frontera HW/SW',
    badge: 'Módulo 2: Inducción Práctica',
    color: 'amber',
    mapBounds: { xMin: 0, xMax: 18, yMin: 0, yMax: 12 },
    spawn: { x: 3, y: 7 },
    goal: 'Supera las 3 mini-estaciones: conecta cables al panel de puertos, clasifica periféricos en la cinta, y activa el experimento del monitor mudo.'
  },
  3: {
    id: 3,
    name: 'Laboratorio de Diagnóstico',
    subtitle: 'Hardware vs. Software',
    badge: 'Módulo 3: Inspección Práctica',
    color: 'cyan',
    mapBounds: { xMin: 0, xMax: 16, yMin: 0, yMax: 12 },
    spawn: { x: 8, y: 10 },
    goal: 'Descubre por qué al oprimir "A" sale "Q". Revisa el cable físico y el mapa de teclado del sistema.'
  },
  4: {
    id: 4,
    name: 'Hospital de Dispositivos',
    subtitle: 'Casos Clínicos Periféricos',
    badge: 'Módulo 4: Casos Reales',
    color: 'indigo',
    mapBounds: { xMin: 0, xMax: 18, yMin: 0, yMax: 12 },
    spawn: { x: 9, y: 10 },
    goal: 'Diagnostica a los 3 pacientes: Mouse fantasma, Monitor sin señal e Impresora muda.'
  },
  5: {
    id: 5,
    name: 'Callejón del Tiempo',
    subtitle: 'El Engaño de la Moda',
    badge: 'Módulo 5: Obsolescencia',
    color: 'orange',
    mapBounds: { xMin: 0, xMax: 16, yMin: 0, yMax: 12 },
    spawn: { x: 3, y: 6 },
    goal: 'Convence al Consumidor impulsivo de no tirar a la basura una laptop que funciona al 100%.'
  },
  6: {
    id: 6,
    name: 'Estación Cero Basura (PAEC)',
    subtitle: 'Árbol de Decisión Ambiental',
    badge: 'Módulo 6: Ciclo de Vida',
    color: 'teal',
    mapBounds: { xMin: 0, xMax: 16, yMin: 0, yMax: 12 },
    spawn: { x: 8, y: 10 },
    goal: 'Clasifica 3 dispositivos siguiendo la ruta ecológica: ¿Funciona? -> ¿Reparable? -> ¿Reutilizable? -> Reciclaje especializado.'
  },
  7: {
    id: 7,
    name: 'Sala del Maestro de Sala',
    subtitle: 'Examen de Certificación UNAM',
    badge: 'Módulo 7: Reactivo Crítico',
    color: 'rose',
    mapBounds: { xMin: 0, xMax: 16, yMin: 0, yMax: 12 },
    spawn: { x: 8, y: 10 },
    goal: 'Supera el reactivo razonado tipo examen UNAM / Bachillerato Tecnológico ante el Guardián.'
  }
};
