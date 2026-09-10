import { Direction, Position, NPC, InteractiveObject } from '../types';

export const TILE_SIZE = 40; // 40px grid cell
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

export interface RenderState {
  zoneId: number;
  playerPos: Position;
  playerDirection: Direction;
  isMoving: boolean;
  walkFrame: number;
  npcs: NPC[];
  objects: InteractiveObject[];
  nearbyInteractable: { type: 'npc' | 'object'; name: string; label: string } | null;
}

export function drawGameCanvas(ctx: CanvasRenderingContext2D, state: RenderState) {
  ctx.imageSmoothingEnabled = false;

  // Clear background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Camera offset centered on player with clamping
  const mapCols = 16;
  const mapRows = 12;
  const mapPixelWidth = mapCols * TILE_SIZE;
  const mapPixelHeight = mapRows * TILE_SIZE;

  let cameraX = state.playerPos.x * TILE_SIZE - CANVAS_WIDTH / 2 + TILE_SIZE / 2;
  let cameraY = state.playerPos.y * TILE_SIZE - CANVAS_HEIGHT / 2 + TILE_SIZE / 2;

  cameraX = Math.max(0, Math.min(cameraX, mapPixelWidth - CANVAS_WIDTH));
  cameraY = Math.max(0, Math.min(cameraY, mapPixelHeight - CANVAS_HEIGHT));

  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  // 1. Draw Map Tiles for Current Zone
  drawZoneBackground(ctx, state.zoneId, mapCols, mapRows);

  // 2. Draw Interactive Objects
  for (const obj of state.objects) {
    if (obj.zoneId === state.zoneId) {
      drawInteractiveObject(ctx, obj);
    }
  }

  // 3. Draw NPCs
  for (const npc of state.npcs) {
    if (npc.zoneId === state.zoneId) {
      drawNPC(ctx, npc);
    }
  }

  // 4. Draw Player
  drawPlayer(ctx, state.playerPos, state.playerDirection, state.isMoving, state.walkFrame);

  // 5. Draw prompt if near interactable
  if (state.nearbyInteractable) {
    drawInteractPrompt(ctx, state.playerPos, state.nearbyInteractable.label);
  }

  ctx.restore();

  // Draw HUD overlay (Zone Name Banner in top-left)
  drawHUD(ctx, state.zoneId);
}

function drawZoneBackground(ctx: CanvasRenderingContext2D, zoneId: number, cols: number, rows: number) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      switch (zoneId) {
        case 1: // Plaza Inicial (GBA Pokémon Town style)
          drawPlazaTile(ctx, x, y, px, py, cols, rows);
          break;
        case 2: // El Taller de Ensamblaje (Workshop / Tools / Assembly)
          drawWorkshopTile(ctx, x, y, px, py, cols, rows);
          break;
        case 3: // Laboratorio de Diagnóstico (Tech Lab)
          drawLabTile(ctx, x, y, px, py, cols, rows);
          break;
        case 4: // Hospital de Dispositivos (Clinic Tech)
          drawHospitalTile(ctx, x, y, px, py, cols, rows);
          break;
        case 5: // Callejón del Tiempo (Alley / Modern)
          drawAlleyTile(ctx, x, y, px, py, cols, rows);
          break;
        case 6: // Estación Cero Basura (PAEC Eco)
          drawEcoTile(ctx, x, y, px, py, cols, rows);
          break;
        case 7: // Examen UNAM (Ceremonial Academy Hall)
          drawExamHallTile(ctx, x, y, px, py, cols, rows);
          break;
        default:
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

// -------------------------------------------------------------
// TILE RENDERING PER ZONE
// -------------------------------------------------------------
function drawPlazaTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  // Border walls / trees
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#1e3a1e';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // Tree top
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath();
    ctx.arc(px + 20, py + 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3d7a35';
    ctx.beginPath();
    ctx.arc(px + 18, py + 16, 10, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Central pathway
  const isPath = (x >= 4 && x <= 6) || (y >= 5 && y <= 7);
  if (isPath) {
    ctx.fillStyle = '#d6b884'; // warm brick
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#c4a470';
    ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    // Brick grid line
    ctx.strokeStyle = '#b09060';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  } else {
    // Grass
    ctx.fillStyle = (x + y) % 2 === 0 ? '#488c3a' : '#438435';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // Tiny grass tufts
    if ((x * 3 + y * 7) % 5 === 0) {
      ctx.fillStyle = '#6ab859';
      ctx.fillRect(px + 10, py + 14, 2, 6);
      ctx.fillRect(px + 14, py + 12, 2, 8);
      ctx.fillRect(px + 18, py + 15, 2, 5);
    }
  }

  // School flagpole / fountain base
  if (x === 5 && y === 6) {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(px + 6, py + 6, 28, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(px + 10, py + 10, 20, 20);
  }
}

function drawWorkshopTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  // Border: Industrial workbench & tool wall
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#451a03'; // Heavy timber workbenches
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);

    // Pegboard holes and hanging tools
    ctx.fillStyle = '#92400e';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(px + 8 + i * 10, py + 8 + j * 10, 2, 2);
      }
    }
    // Screwdriver / Wrench sprite accent
    if ((x + y) % 3 === 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 16, py + 8, 3, 14);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px + 15, py + 22, 5, 8);
    }
    return;
  }

  // Workshop rubberized ESD industrial floor
  ctx.fillStyle = (x + y) % 2 === 0 ? '#1e293b' : '#334155';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Safety yellow/black hazard line near middle
  if (y === 6) {
    ctx.fillStyle = (x % 2 === 0) ? '#eab308' : '#0f172a';
    ctx.fillRect(px, py + 18, TILE_SIZE, 4);
  }

  // ESD Grounding grid dots
  if ((x + y) % 2 === 0) {
    ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
    ctx.fillRect(px + 18, py + 18, 4, 4);
  }
}

function drawLabTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#1e293b'; // Server rack / metallic walls
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    // Server LED blinks
    ctx.fillStyle = (x + y) % 2 === 0 ? '#22c55e' : '#38bdf8';
    ctx.fillRect(px + 8, py + 10, 4, 4);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(px + 16, py + 10, 4, 4);
    return;
  }

  // Tech grid linoleum floor
  ctx.fillStyle = (x + y) % 2 === 0 ? '#0f2942' : '#133555';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Circuit trace lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px, py + 20);
  ctx.lineTo(px + TILE_SIZE, py + 20);
  ctx.moveTo(px + 20, py);
  ctx.lineTo(px + 20, py + TILE_SIZE);
  ctx.stroke();

  // Solder point dots
  if ((x + y) % 3 === 0) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(px + 18, py + 18, 4, 4);
  }
}

function drawHospitalTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#0f3d3e';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#145354';
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    return;
  }

  // Clinic mint-white tiles
  ctx.fillStyle = (x + y) % 2 === 0 ? '#e6f7f8' : '#d2f0f2';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Medical tech cross emblem in center
  if (x === 8 && y === 6) {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(px + 14, py + 6, 12, 28);
    ctx.fillRect(px + 6, py + 14, 28, 12);
  }
}

function drawAlleyTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#292524'; // dark brick
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#44403c';
    ctx.fillRect(px + 2, py + 4, 16, 10);
    ctx.fillRect(px + 20, py + 4, 16, 10);
    ctx.fillRect(px + 10, py + 18, 20, 10);
    return;
  }

  // Cobblestone pavement
  ctx.fillStyle = (x + y) % 2 === 0 ? '#3f3f46' : '#27272a';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
}

function drawEcoTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // Solar panel / leaf motif
    ctx.fillStyle = '#059669';
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    return;
  }

  // Recycled eco-paving
  ctx.fillStyle = (x + y) % 2 === 0 ? '#e2e8f0' : '#cbd5e1';
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  // Green recycle road markings
  if (y === 6) {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(px + 10, py + 16, 20, 8);
  }
}

function drawExamHallTile(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, cols: number, rows: number) {
  if (x === 0 || x === cols - 1 || y === 0 || y === rows - 1) {
    ctx.fillStyle = '#450a0a'; // Mahogany wood
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    return;
  }

  // Red velvet carpet down middle, dark polished floor on sides
  if (x >= 7 && x <= 9) {
    ctx.fillStyle = '#991b1b'; // Red carpet
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    ctx.strokeStyle = '#f59e0b'; // Gold trim
    ctx.lineWidth = 2;
    if (x === 7) {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py + TILE_SIZE);
      ctx.stroke();
    }
    if (x === 9) {
      ctx.beginPath();
      ctx.moveTo(px + TILE_SIZE, py);
      ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = (x + y) % 2 === 0 ? '#1e1b4b' : '#312e81'; // Royal navy marble
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  }
}

// -------------------------------------------------------------
// INTERACTIVE OBJECTS
// -------------------------------------------------------------
function drawInteractiveObject(ctx: CanvasRenderingContext2D, obj: InteractiveObject) {
  const px = obj.x * TILE_SIZE;
  const py = obj.y * TILE_SIZE;

  switch (obj.type) {
    case 'mystery_box': {
      // Cardboard box labeled "BASURA"
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(px + 4, py + 8, 32, 28);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(px + 6, py + 10, 28, 24);
      // Tape line
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(px + 6, py + 20, 28, 4);
      // Keyboard sticking out
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 10, py + 4, 20, 8);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px + 12, py + 5, 4, 3);
      ctx.fillRect(px + 18, py + 5, 4, 3);
      ctx.fillRect(px + 24, py + 5, 4, 3);
      // Sign: BASURA
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(px + 4, py + 34, 32, 6);
      ctx.fillStyle = '#ffffff';
      ctx.font = '7px sans-serif';
      ctx.fillText('BASURA?', px + 6, py + 39);
      break;
    }
    case 'assembly_ports': {
      // Mini-station A: Back I/O Shield / Motherboard ports panel
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 4, py + 4, 32, 32);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 6, py + 6, 28, 28);
      // Ports accents: HDMI (gold), USB (blue), Jack (green), Power (black/yellow)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 10, py + 10, 8, 4);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px + 22, py + 10, 8, 4);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px + 14, py + 24, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.fillRect(px + 22, py + 22, 8, 6);
      // Sign
      ctx.fillStyle = '#f59e0b';
      ctx.font = '7px sans-serif';
      ctx.fillText('PUERTOS', px + 6, py + 38);
      break;
    }
    case 'assembly_sorter': {
      // Mini-station B: Conveyor belt with sorting boxes
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 2, py + 8, 36, 26);
      // Conveyor rollers
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 4, py + 14, 32, 4);
      // Box Entrada (blue) and Salida (purple)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 6, py + 20, 12, 12);
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(px + 22, py + 20, 12, 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = '6px sans-serif';
      ctx.fillText('IN', px + 9, py + 29);
      ctx.fillText('OUT', px + 23, py + 29);
      break;
    }
    case 'assembly_screen': {
      // Mini-station C: The silent monitor experiment bench
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 4, py + 8, 32, 28);
      // Screen frame
      ctx.fillStyle = '#020617';
      ctx.fillRect(px + 8, py + 10, 24, 16);
      // Standby yellow LED
      ctx.fillStyle = '#eab308';
      ctx.fillRect(px + 18, py + 28, 4, 3);
      // Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = '7px sans-serif';
      ctx.fillText('EXP SO', px + 8, py + 38);
      break;
    }
    case 'keyboard_lab': {
      // Diagnostic workbench with monitors and keyboard tester
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 2, py + 8, 36, 28);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 6, py + 12, 14, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 8, py + 14, 10, 8);
      // Keyboard on table
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 22, py + 16, 14, 10);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(px + 24, py + 18, 10, 6);
      break;
    }
    case 'patient_mouse': {
      // Hospital pod 1: Mouse
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px + 4, py + 6, 32, 30);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(px + 6, py + 8, 28, 26);
      // Mouse icon
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(px + 14, py + 14, 12, 16, 6);
      ctx.fill();
      ctx.fillStyle = '#ef4444'; // Red click indicator
      ctx.fillRect(px + 16, py + 16, 4, 4);
      break;
    }
    case 'patient_monitor': {
      // Hospital pod 2: Monitor
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(px + 4, py + 6, 32, 30);
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(px + 6, py + 8, 28, 26);
      // Screen with "NO SIGNAL"
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 10, py + 12, 20, 14);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '6px sans-serif';
      ctx.fillText('NO SIG', px + 11, py + 22);
      break;
    }
    case 'patient_printer': {
      // Hospital pod 3: Printer
      ctx.fillStyle = '#0d9488';
      ctx.fillRect(px + 4, py + 6, 32, 30);
      ctx.fillStyle = '#f0fdfa';
      ctx.fillRect(px + 6, py + 8, 28, 26);
      // Printer body
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 10, py + 16, 20, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 14, py + 10, 12, 8); // Paper
      break;
    }
    case 'consumer_laptop': {
      // Laptop on café/park bench
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px + 2, py + 14, 36, 16);
      // Laptop
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 12, py + 8, 16, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 14, py + 10, 12, 8);
      break;
    }
    case 'paec_station': {
      // Sorting bins / recycling terminal
      ctx.fillStyle = '#059669';
      ctx.fillRect(px + 2, py + 6, 36, 30);
      // 3 bins: Blue, Green, Red/E-waste
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(px + 6, py + 14, 8, 16);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(px + 16, py + 14, 8, 16);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 26, py + 14, 8, 16);
      // Recycle symbol sign
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.fillText('PAEC', px + 10, py + 12);
      break;
    }
    case 'exam_gate': {
      // Grand examination podium
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px + 4, py + 4, 32, 32);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 6, py + 6, 28, 28);
      // Open book on pedestal
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 12, py + 12, 16, 10);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 19, py + 12, 2, 10);
      break;
    }
    case 'teleport': {
      // Glowing zone exit / entrance portal
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(px + 20, py + 20, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px + 20, py + 20, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.fillText('PUERTA', px + 4, py + 23);
      break;
    }
  }
}

// -------------------------------------------------------------
// NPC RENDERING
// -------------------------------------------------------------
function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC) {
  const px = npc.x * TILE_SIZE;
  const py = npc.y * TILE_SIZE;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(px + 20, py + 34, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  let clothesColor = '#3b82f6';
  let hairColor = '#78350f';
  let badgeColor = '#f59e0b';

  if (npc.spriteType === 'teacher') {
    clothesColor = '#047857'; // Green teacher blazer
    hairColor = '#e2e8f0'; // White / grey hair
    badgeColor = '#eab308';
  } else if (npc.spriteType === 'technician') {
    clothesColor = '#d97706'; // Technician orange
    hairColor = '#451a03';
    badgeColor = '#38bdf8';
  } else if (npc.spriteType === 'consumer') {
    clothesColor = '#9333ea'; // Trendy purple
    hairColor = '#eab308'; // Blonde
    badgeColor = '#ec4899';
  } else if (npc.spriteType === 'guardian') {
    clothesColor = '#991b1b'; // Red/gold academy master robe
    hairColor = '#1f2937';
    badgeColor = '#fbbf24';
  }

  // Body / Clothes
  ctx.fillStyle = clothesColor;
  ctx.fillRect(px + 12, py + 16, 16, 16);

  // Head
  ctx.fillStyle = '#fde047'; // Skin tone
  ctx.fillRect(px + 14, py + 6, 12, 10);

  // Hair
  ctx.fillStyle = hairColor;
  ctx.fillRect(px + 12, py + 4, 16, 6);

  // Eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 15, py + 10, 2, 2);
  ctx.fillRect(px + 21, py + 10, 2, 2);

  // Role Badge / Glasses / Tool
  ctx.fillStyle = badgeColor;
  ctx.fillRect(px + 18, py + 20, 4, 4);

  // Role tag floating above head
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(px + 4, py - 4, 32, 10);
  ctx.fillStyle = '#ffffff';
  ctx.font = '7px sans-serif';
  ctx.fillText(npc.role.substring(0, 7), px + 6, py + 3);
}

// -------------------------------------------------------------
// PLAYER RENDERING (GBA Red / Protagonist)
// -------------------------------------------------------------
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  direction: Direction,
  isMoving: boolean,
  walkFrame: number
) {
  const px = pos.x * TILE_SIZE;
  const py = pos.y * TILE_SIZE;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(px + 20, py + 36, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const legOffset = isMoving ? (walkFrame % 2 === 0 ? -3 : 3) : 0;

  // Legs / Pants (Dark blue jeans)
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(px + 13, py + 28, 5, 8 + legOffset);
  ctx.fillRect(px + 22, py + 28, 5, 8 - legOffset);

  // Shoes (Red sneakers)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 12, py + 34 + legOffset, 7, 4);
  ctx.fillRect(px + 21, py + 34 - legOffset, 7, 4);

  // Torso / Jacket (Red & White GBA jacket)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 12, py + 16, 16, 13);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 17, py + 16, 6, 13);

  // Backpack on back
  ctx.fillStyle = '#f59e0b';
  if (direction === 'up') {
    ctx.fillRect(px + 14, py + 17, 12, 10);
  } else if (direction === 'left') {
    ctx.fillRect(px + 24, py + 17, 4, 10);
  } else if (direction === 'right') {
    ctx.fillRect(px + 12, py + 17, 4, 10);
  }

  // Head (Skin tone)
  ctx.fillStyle = '#fde047';
  ctx.fillRect(px + 14, py + 6, 12, 10);

  // Hair (Brown bangs)
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px + 13, py + 5, 14, 4);

  // Cap (Red cap with white brim)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(px + 12, py + 2, 16, 5);
  ctx.fillStyle = '#ffffff';
  if (direction === 'down') {
    ctx.fillRect(px + 14, py + 6, 12, 2);
  } else if (direction === 'left') {
    ctx.fillRect(px + 10, py + 5, 6, 2);
  } else if (direction === 'right') {
    ctx.fillRect(px + 24, py + 5, 6, 2);
  }

  // Eyes based on direction
  ctx.fillStyle = '#0f172a';
  if (direction === 'down') {
    ctx.fillRect(px + 16, py + 10, 2, 2);
    ctx.fillRect(px + 22, py + 10, 2, 2);
  } else if (direction === 'left') {
    ctx.fillRect(px + 14, py + 10, 2, 2);
  } else if (direction === 'right') {
    ctx.fillRect(px + 24, py + 10, 2, 2);
  }
}

// -------------------------------------------------------------
// INTERACTION PROMPT
// -------------------------------------------------------------
function drawInteractPrompt(ctx: CanvasRenderingContext2D, pos: Position, label: string) {
  const px = pos.x * TILE_SIZE;
  const py = pos.y * TILE_SIZE - 24;

  const text = `[A / ESPACIO] ${label}`;
  ctx.font = 'bold 9px sans-serif';
  const width = ctx.measureText(text).width + 16;

  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(px + 20 - width / 2, py, width, 18, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, px + 20 - width / 2 + 8, py + 12);
}

// -------------------------------------------------------------
// HUD BANNER
// -------------------------------------------------------------
function drawHUD(ctx: CanvasRenderingContext2D, zoneId: number) {
  const names: Record<number, string> = {
    1: 'Zona 1: Plaza Inicial (La Caja del Misterio)',
    2: 'Zona 2: El Taller de Ensamblaje (Puertos y Periféricos)',
    3: 'Zona 3: Laboratorio de Diagnóstico (Hardware vs Software)',
    4: 'Zona 4: Hospital de Dispositivos (Casos Clínicos)',
    5: 'Zona 5: Callejón del Tiempo (Obsolescencia)',
    6: 'Zona 6: Estación Cero Basura (PAEC)',
    7: 'Zona 7: Sala del Maestro de Sala (UNAM)'
  };

  const title = names[zoneId] || 'Distrito Tecnológico CETis';

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(12, 12, 340, 28, 6);
  ctx.fill();
  ctx.stroke();

  // Retro green LED dot
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(24, 26, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(title, 36, 29);
}
