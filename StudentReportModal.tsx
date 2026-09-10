import React from 'react';
import { GameProgression, StudentInfo } from '../types';
import { ClipboardList, FileDown, X, Award, RotateCcw } from 'lucide-react';
import { sounds } from '../audio';

interface ReportModalProps {
  student: StudentInfo;
  onUpdateStudent: (info: StudentInfo) => void;
  progression: GameProgression;
  totalDexCount: number;
  onClose: () => void;
  onOpenStartScreen?: () => void;
}

export const StudentReportModal: React.FC<ReportModalProps> = ({
  student,
  onUpdateStudent,
  progression,
  totalDexCount,
  onClose,
  onOpenStartScreen
}) => {
  const calculateGrade = () => {
    // 0 to 10 scale for Mexican high school (CETis)
    const base = (progression.score / 100) * 10;
    return Math.min(10, Math.max(0, parseFloat(base.toFixed(1))));
  };

  const handleDownloadStandaloneHtml = () => {
    sounds.playSelect();

    const standaloneHtmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte Diagnóstico - ${student.name || 'Alumno'} - Cultura Digital I</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; }
    .font-pixel { font-family: 'Press Start 2P', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 p-4 sm:p-8">
  <div class="max-w-4xl mx-auto bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
    <!-- Header -->
    <div class="border-b-2 border-cyan-500 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Centro de Estudios Tecnológicos Industrial y de Servicios No. 2</span>
        <h1 class="text-2xl font-bold text-white mt-1">Cultura Digital I • Hoja de Registro de Diagnóstico</h1>
        <p class="text-xs text-slate-400 mt-0.5">Estrategia PAEC: Cero Basura antes del Desecho • Ciclo Escolar 2026</p>
      </div>
      <div class="text-right bg-slate-950 p-3 rounded-xl border border-slate-800 min-w-36">
        <span class="text-[10px] text-slate-400 uppercase block font-bold">Calificación</span>
        <span class="text-2xl font-bold text-emerald-400 font-pixel">${calculateGrade()}</span>
        <span class="text-xs text-slate-400"> / 10.0</span>
      </div>
    </div>

    <!-- Student Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
      <div>
        <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Alumno:</span>
        <span class="text-base font-bold text-white">${student.name || 'Sin especificar'}</span>
      </div>
      <div>
        <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Grupo / Semestre:</span>
        <span class="text-base font-semibold text-cyan-300">${student.group || '1° Semestre'}</span>
      </div>
    </div>

    <!-- Score Breakdown -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] text-slate-400 block">Puntaje</span>
        <strong class="text-lg font-bold text-emerald-400 font-pixel">${progression.score} / 100</strong>
      </div>
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] text-slate-400 block">Módulos Aprobados</span>
        <strong class="text-lg font-bold text-cyan-400">${progression.completedZones.length} / 7</strong>
      </div>
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] text-slate-400 block">DEX Glosario</span>
        <strong class="text-lg font-bold text-purple-400">${progression.unlockedDexIds.length} / ${totalDexCount}</strong>
      </div>
      <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span class="text-[10px] text-slate-400 block">Examen UNAM</span>
        <strong class="text-lg font-bold ${progression.examPassed ? 'text-emerald-400' : 'text-amber-400'}">${progression.examPassed ? 'Acreditado' : 'Pendiente'}</strong>
      </div>
    </div>

    <!-- Diagnostic Cases Summary -->
    <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
      <h3 class="font-bold text-cyan-300 text-sm mb-2">Diagnósticos y Casos Técnicos Resueltos:</h3>
      <p>• <strong>Plaza Inicial (Caja Misteriosa):</strong> ${progression.hypothesis || 'Hardware verificado antes de desecho.'}</p>
      <p>• <strong>Taller de Ensamblaje:</strong> ${progression.workshopCompleted ? 'Panel de puertos conectado y periféricos clasificados.' : 'En proceso.'}</p>
      <p>• <strong>Laboratorio de Teclado:</strong> ${progression.keyboardFixed ? 'Hardware 100% íntegro. Error lógico corregido (distribución de idioma).' : 'Pendiente.'}</p>
      <p>• <strong>Hospital de Dispositivos:</strong> Mouse (${progression.hospitalCases.mouse ? 'Resuelto' : 'Pendiente'}), Monitor (${progression.hospitalCases.monitor ? 'Resuelto' : 'Pendiente'}), Impresora (${progression.hospitalCases.printer ? 'Resuelto' : 'Pendiente'}).</p>
      <p>• <strong>Obsolescencia Percibida:</strong> ${progression.obsolescenceConvinced ? 'Evitó residuo orientando a donación y actualización.' : 'Pendiente.'}</p>
      <p>• <strong>Estación Cero Basura (PAEC):</strong> ${progression.paecSortedCount >= 3 ? '3 aparatos clasificados exitosamente.' : 'Pendiente.'}</p>
      <p>• <strong>Examen UNAM:</strong> ${progression.examPassed ? 'Reactivo oficial aprobado.' : 'Pendiente.'}</p>
    </div>

    ${student.notes ? `
    <div class="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
      <h3 class="font-bold text-slate-300 text-xs uppercase mb-1">Conclusión del Alumno:</h3>
      <p class="text-slate-300 italic">"${student.notes}"</p>
    </div>` : ''}

    <div class="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
      Generado el ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')} • Simulador Educativo CETis
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([standaloneHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-CETis2-${(student.name || 'Alumno').replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const grade = calculateGrade();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 p-4 border-b-4 border-slate-950 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-cyan-300">BITÁCORA TÉCNICA DEL ALUMNO</span>
              <h2 className="text-lg font-bold text-white">Evaluación Continua y Reporte de Evidencias</h2>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar for Teacher and Student */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-2 items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Puntaje Global:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-xs font-pixel text-emerald-300">
              {progression.score} / 100 PTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500 text-xs font-pixel text-cyan-300">
              CALIF: {grade}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handleDownloadStandaloneHtml}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descarga el archivo HTML completo listo para abrir en cualquier navegador"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar Reporte HTML</span>
            </button>

            {onOpenStartScreen && (
              <button
                onClick={() => {
                  sounds.playSelect();
                  onClose();
                  onOpenStartScreen();
                }}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/70 text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Registrar nuevo alumno o reiniciar partida"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Nuevo Alumno / Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Report Content - This element prints cleanly via @media print */}
        <div id="printable-report" className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-900 text-slate-100">
          {/* Institutional CETis Header */}
          <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Centro de Estudios Tecnológicos Industrial y de Servicios No. 2
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Cultura Digital I • Hoja de Registro de Diagnóstico
              </h3>
              <p className="text-xs text-slate-400">
                Estrategia PAEC: Cero Basura antes del Desecho • Ciclo Escolar 2026
              </p>
            </div>
            <div className="text-right bg-slate-950/80 border border-slate-800 p-3 rounded-xl min-w-36">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Evaluación Cuantitativa</span>
              <span className="text-2xl font-bold font-pixel text-emerald-400">{grade}</span>
              <span className="text-xs text-slate-400"> / 10.0</span>
            </div>
          </div>

          {/* Student Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Nombre del Alumno:
              </label>
              <input
                type="text"
                placeholder="Nombre completo..."
                value={student.name}
                onChange={e => onUpdateStudent({ ...student, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Grupo / Especialidad / Turno:
              </label>
              <input
                type="text"
                placeholder="Ej. 1º A Programación Matutino"
                value={student.group}
                onChange={e => onUpdateStudent({ ...student, group: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Summary Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Módulos Aprobados</span>
              <strong className="text-lg font-bold text-cyan-400">{progression.completedZones.length} / 7</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DEX-Glosario</span>
              <strong className="text-lg font-bold text-purple-400">{progression.unlockedDexIds.length} / {totalDexCount}</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Casos Hospital</span>
              <strong className="text-lg font-bold text-emerald-400">
                {[progression.hospitalCases.mouse, progression.hospitalCases.monitor, progression.hospitalCases.printer].filter(Boolean).length} / 3
              </strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Examen UNAM</span>
              <strong className={`text-lg font-bold ${progression.examPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {progression.examPassed ? 'Acreditado' : 'En Curso'}
              </strong>
            </div>
          </div>

          {/* Detailed Decision Log */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Historial de Decisiones Diagnósticas Registradas:
            </h4>

            {progression.decisions.length > 0 ? (
              <div className="space-y-2">
                {progression.decisions.map((d, i) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-cyan-300">{d.zoneTitle}</span>
                      <span className="text-[10px]">{d.timestamp}</span>
                    </div>
                    <p className="text-slate-200"><strong className="text-slate-400">Respuesta:</strong> {d.selectedAnswer}</p>
                    <p className="text-emerald-300 italic text-[11px]"><strong className="text-slate-400">Fundamento:</strong> {d.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl border border-slate-800">
                Aún no has registrado diagnósticos. Interactúa con las cajas y terminales en el mapa.
              </p>
            )}
          </div>

          {/* Reflection notes */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Conclusión Personal del Alumno para Evaluación Docente:
            </label>
            <textarea
              rows={2}
              placeholder="Explica qué aprendiste sobre no tirar dispositivos antes de diagnosticarlos..."
              value={student.notes}
              onChange={e => onUpdateStudent({ ...student, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end no-print">
          <button
            onClick={() => {
              sounds.playSelect();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Cerrar Bitácora y Continuar Juego
          </button>
        </div>
      </div>
    </div>
  );
};
