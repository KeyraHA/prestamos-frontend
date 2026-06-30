// src/pages/Evaluaciones.jsx
import { useState, useEffect } from 'react';
import { getEvaluaciones } from '../services/evaluacionService';

const resultadoColor = {
  Aprobado:  { bg: '#dcfce7', color: '#16a34a' },
  Rechazado: { bg: '#fee2e2', color: '#dc2626' },
  Observado: { bg: '#fef9c3', color: '#ca8a04' },
};

function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [busqueda, setBusqueda]         = useState('');
  const [filtro, setFiltro]             = useState('Todos');
  const [detalle, setDetalle]           = useState(null);

  useEffect(() => {
    getEvaluaciones()
      .then(res => setEvaluaciones(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const conteo = (r) => evaluaciones.filter(e => e.resultado === r).length;

  const filtradas = evaluaciones.filter(e => {
    const matchB = `${e.nombre} ${e.apellido} ${e.nombre_asesor} ${e.apellido_asesor}`
      .toLowerCase().includes(busqueda.toLowerCase());
    const matchF = filtro === 'Todos' || e.resultado === filtro;
    return matchB && matchF;
  });

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando evaluaciones...</div>;

  return (
    <div style={{ padding: '24px' }}>

      {/* Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Aprobadas',  resultado: 'Aprobado',  icon: '✅', color: '#16a34a' },
          { label: 'Rechazadas', resultado: 'Rechazado', icon: '❌', color: '#dc2626' },
          { label: 'Observadas', resultado: 'Observado', icon: '👁️', color: '#ca8a04' },
        ].map(c => (
          <div key={c.resultado}
            onClick={() => setFiltro(filtro === c.resultado ? 'Todos' : c.resultado)}
            style={{
              background: '#fff', borderRadius: '10px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `4px solid ${c.color}`,
              cursor: 'pointer', opacity: filtro !== 'Todos' && filtro !== c.resultado ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: c.color, marginTop: '4px' }}>{conteo(c.resultado)}</div>
              </div>
              <span style={{ fontSize: '28px' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>{filtradas.length} evaluaciones</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Buscar cliente o asesor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', width: '220px' }}
          />
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', background: '#fff' }}
          >
            <option>Todos</option>
            <option>Aprobado</option>
            <option>Rechazado</option>
            <option>Observado</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f0f2f5' }}>
            <tr>
              {['ID', 'Cliente', 'Asesor', 'Capacidad pago', 'Puntaje riesgo', 'Fecha', 'Resultado', 'Detalle'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron evaluaciones</td></tr>
            ) : filtradas.map(e => (
              <tr key={e.id_evaluacion}
                style={{ borderBottom: '1px solid #e5e7eb' }}
                onMouseEnter={ev => ev.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{e.id_evaluacion}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{e.nombre} {e.apellido}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{e.nombre_asesor} {e.apellido_asesor}</td>
                <td style={{ padding: '12px 16px' }}>S/ {Number(e.capacidad_pago).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: '#f0f2f5', borderRadius: '3px' }}>
                      <div style={{ width: `${e.puntaje_riesgo}%`, height: '100%', borderRadius: '3px',
                        background: e.puntaje_riesgo > 70 ? '#dc2626' : e.puntaje_riesgo > 40 ? '#e8a020' : '#16a34a' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '30px' }}>{e.puntaje_riesgo}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{e.fecha_evaluacion}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                    background: resultadoColor[e.resultado]?.bg || '#f3f4f6',
                    color:      resultadoColor[e.resultado]?.color || '#374151',
                  }}>{e.resultado}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => setDetalle(e)}
                    style={{ padding: '4px 12px', background: '#f0f2f5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {detalle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Evaluación #{detalle.id_evaluacion}</h2>
              <button onClick={() => setDetalle(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            {[
              ['Cliente',         `${detalle.nombre} ${detalle.apellido}`],
              ['Asesor',          `${detalle.nombre_asesor} ${detalle.apellido_asesor}`],
              ['Monto solicitado',`S/ ${Number(detalle.monto_solicitud).toLocaleString()}`],
              ['Capacidad pago',  `S/ ${Number(detalle.capacidad_pago).toLocaleString()}`],
              ['Puntaje riesgo',  detalle.puntaje_riesgo],
              ['Resultado',       detalle.resultado],
              ['Estado eval.',    detalle.estado_evaluacion],
              ['Fecha',           detalle.fecha_evaluacion],
              ['Observaciones',   detalle.observaciones || '—'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f5', fontSize: '13px' }}>
                <span style={{ color: '#6b7280', fontWeight: '600' }}>{label}</span>
                <span style={{ color: '#1a1a2e', maxWidth: '260px', textAlign: 'right' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluaciones;