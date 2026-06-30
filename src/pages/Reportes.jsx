// src/pages/Reportes.jsx
import { useState, useEffect } from 'react';
import { getConsultas, ejecutarConsulta } from '../services/reporteService';

const iconos = {
  clientes_por_tipo:       '👥',
  prestamos_por_estado:    '💰',
  top_clientes_deuda:      '🏆',
  pagos_por_mes:           '📅',
  moras_por_rango:         '⚠️',
  solicitudes_por_mes:     '📄',
  asesores_rendimiento:    '👔',
  distribucion_tasas:      '📊',
};

function Reportes() {
  const [consultas, setConsultas]   = useState([]);
  const [activa, setActiva]         = useState(null);
  const [resultado, setResultado]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    getConsultas()
      .then(res => setConsultas(res.data))
      .catch(console.error)
      .finally(() => setLoadingInit(false));
  }, []);

  const ejecutar = (consulta) => {
    setActiva(consulta);
    setResultado(null);
    setLoading(true);
    ejecutarConsulta(consulta.id)
      .then(res => setResultado(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const formatVal = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') return val.toLocaleString();
    return val;
  };

  if (loadingInit) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando reportes...</div>;

  return (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>

      {/* Panel izquierdo — lista de consultas */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#003366' }}>
          <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>📋 Consultas disponibles</h3>
          <p style={{ color: '#c8d6e8', fontSize: '11px', marginTop: '2px' }}>Haz clic para ejecutar</p>
        </div>
        {consultas.map(c => (
          <button key={c.id} onClick={() => ejecutar(c)}
            style={{
              width: '100%', padding: '14px 20px', border: 'none', borderBottom: '1px solid #f0f2f5',
              textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              background: activa?.id === c.id ? '#eff6ff' : '#fff',
              borderLeft: activa?.id === c.id ? '3px solid #003366' : '3px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activa?.id !== c.id) e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={e => { if (activa?.id !== c.id) e.currentTarget.style.background = '#fff'; }}
          >
            <span style={{ fontSize: '18px' }}>{iconos[c.id] || '📊'}</span>
            <span style={{ fontSize: '13px', fontWeight: activa?.id === c.id ? '600' : '400', color: activa?.id === c.id ? '#003366' : '#1a1a2e' }}>
              {c.titulo}
            </span>
          </button>
        ))}
      </div>

      {/* Panel derecho — resultados */}
      <div>
        {!activa && (
          <div style={{ background: '#fff', borderRadius: '10px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Selecciona una consulta</h3>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Elige una consulta del panel izquierdo para ver los resultados aquí.</p>
          </div>
        )}

        {activa && loading && (
          <div style={{ background: '#fff', borderRadius: '10px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Ejecutando consulta...</p>
          </div>
        )}

        {activa && !loading && resultado && (
          <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* Header resultado */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{iconos[activa.id]} {resultado.titulo}</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{resultado.datos.length} registros encontrados</p>
              </div>
              <button
                onClick={() => {
                  const csv = [resultado.columnas.join(','),
                    ...resultado.datos.map(r => resultado.columnas.map(c => r[c]).join(','))
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url  = URL.createObjectURL(blob);
                  const a    = document.createElement('a');
                  a.href = url; a.download = `${activa.id}.csv`; a.click();
                }}
                style={{ padding: '7px 16px', background: '#003366', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                ⬇️ Exportar CSV
              </button>
            </div>

            {/* Tabla resultados */}
            <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ background: '#f0f2f5', position: 'sticky', top: 0 }}>
                  <tr>
                    {resultado.columnas.map(col => (
                      <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>
                        {col.replace(/_/g, ' ').toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultado.datos.length === 0 ? (
                    <tr><td colSpan={resultado.columnas.length} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Sin resultados</td></tr>
                  ) : resultado.datos.map((row, i) => (
                    <tr key={i}
                      style={{ borderBottom: '1px solid #e5e7eb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {resultado.columnas.map(col => (
                        <td key={col} style={{ padding: '11px 16px' }}>
                          {formatVal(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;