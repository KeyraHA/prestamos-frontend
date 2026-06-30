// src/pages/Solicitudes.jsx
import { useState, useEffect } from 'react';
import { getSolicitudes, getSolicitudesStats } from '../services/solicitudService';

const estadoColor = {
  Pendiente: { bg: '#fef9c3', color: '#ca8a04' },
  Aprobada:  { bg: '#dcfce7', color: '#16a34a' },
  Rechazada: { bg: '#fee2e2', color: '#dc2626' },
};

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [stats, setStats]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [busqueda, setBusqueda]       = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [detalle, setDetalle]         = useState(null);

  useEffect(() => {
    Promise.all([getSolicitudes(), getSolicitudesStats()])
      .then(([sRes, stRes]) => {
        setSolicitudes(sRes.data);
        setStats(stRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStat = (estado) => stats.find(s => s.estado_solicitud === estado)?.total || 0;

  const filtrados = solicitudes.filter(s => {
    const matchBusqueda = `${s.nombre} ${s.apellido} ${s.dni} ${s.motivo_prestamo}`
      .toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || s.estado_solicitud === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando solicitudes...</div>;

  return (
    <div style={{ padding: '24px' }}>

      {/* Tarjetas resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Pendientes', estado: 'Pendiente', icon: '🕐', color: '#ca8a04' },
          { label: 'Aprobadas',  estado: 'Aprobada',  icon: '✅', color: '#16a34a' },
          { label: 'Rechazadas', estado: 'Rechazada', icon: '❌', color: '#dc2626' },
        ].map(c => (
          <div key={c.estado}
            onClick={() => setFiltroEstado(filtroEstado === c.estado ? 'Todos' : c.estado)}
            style={{
              background: '#fff', borderRadius: '10px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `4px solid ${c.color}`,
              cursor: 'pointer', opacity: filtroEstado !== 'Todos' && filtroEstado !== c.estado ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: c.color, marginTop: '4px' }}>{getStat(c.estado)}</div>
              </div>
              <span style={{ fontSize: '28px' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>{filtrados.length} solicitudes</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', width: '200px' }}
          />
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', background: '#fff' }}
          >
            <option>Todos</option>
            <option>Pendiente</option>
            <option>Aprobada</option>
            <option>Rechazada</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f0f2f5' }}>
            <tr>
              {['ID', 'Cliente', 'DNI', 'Motivo', 'Monto solicitado', 'Score', 'Fecha', 'Estado', 'Detalle'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron solicitudes</td></tr>
            ) : filtrados.map(s => (
              <tr key={s.id_solicitud}
                style={{ borderBottom: '1px solid #e5e7eb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{s.id_solicitud}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{s.nombre} {s.apellido}</td>
                <td style={{ padding: '12px 16px' }}>{s.dni}</td>
                <td style={{ padding: '12px 16px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.motivo_prestamo}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>S/ {Number(s.monto_solicitud).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>{s.score_crediticio}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.fecha_solicitud}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                    background: estadoColor[s.estado_solicitud]?.bg || '#f3f4f6',
                    color:      estadoColor[s.estado_solicitud]?.color || '#374151',
                  }}>{s.estado_solicitud}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => setDetalle(s)}
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
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Solicitud #{detalle.id_solicitud}</h2>
              <button onClick={() => setDetalle(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            {[
              ['Cliente',          `${detalle.nombre} ${detalle.apellido}`],
              ['DNI',              detalle.dni],
              ['Motivo',           detalle.motivo_prestamo],
              ['Monto solicitado', `S/ ${Number(detalle.monto_solicitud).toLocaleString()}`],
              ['Ingreso mensual',  `S/ ${Number(detalle.ingreso_mensual).toLocaleString()}`],
              ['Score crediticio', detalle.score_crediticio],
              ['Fecha solicitud',  detalle.fecha_solicitud],
              ['Estado',           detalle.estado_solicitud],
              ['Historial',        detalle.historial_crediticio],
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

export default Solicitudes;