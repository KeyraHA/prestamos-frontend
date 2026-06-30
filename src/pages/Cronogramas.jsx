// src/pages/Cronogramas.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const estadoColor = {
  Pagada:   { bg: '#dcfce7', color: '#16a34a' },
  Pendiente:{ bg: '#fef9c3', color: '#ca8a04' },
  Vencida:  { bg: '#fee2e2', color: '#dc2626' },
};

function Cronogramas() {
  const [cuotas, setCuotas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState('Pendiente');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api.get('/cronograma/resumen')
      .then(res => setCuotas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const conteo = (estado) => cuotas.filter(c => c.estado_cuota === estado).length;

  const filtradas = cuotas.filter(c => {
    const matchF = filtro === 'Todos' || c.estado_cuota === filtro;
    const matchB = `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase());
    return matchF && matchB;
  });

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando cronograma...</div>;

  return (
    <div style={{ padding: '24px' }}>

      {/* Tarjetas resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Por vencer',  estado: 'Pendiente', icon: '🕐', color: '#ca8a04' },
          { label: 'Vencidas',   estado: 'Vencida',   icon: '⚠️', color: '#dc2626' },
          { label: 'Pagadas',    estado: 'Pagada',    icon: '✅', color: '#16a34a' },
        ].map(c => (
          <div key={c.estado}
            onClick={() => setFiltro(filtro === c.estado ? 'Todos' : c.estado)}
            style={{
              background: '#fff', borderRadius: '10px', padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `4px solid ${c.color}`,
              cursor: 'pointer', opacity: filtro !== 'Todos' && filtro !== c.estado ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: c.color, marginTop: '4px' }}>{conteo(c.estado)}</div>
              </div>
              <span style={{ fontSize: '28px' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>{filtradas.length} cuotas</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', width: '200px' }}
          />
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', background: '#fff' }}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Vencida">Vencidas</option>
            <option value="Pagada">Pagadas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f0f2f5' }}>
            <tr>
              {['Cliente', 'Préstamo', 'N° Cuota', 'Monto', 'Vencimiento', 'Días restantes', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No hay cuotas</td></tr>
            ) : filtradas.map((c, i) => {
              const hoy = new Date();
              const venc = new Date(c.fecha_vencimiento);
              const dias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));

              return (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{c.nombre} {c.apellido}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{c.id_prestamo}</td>
                  <td style={{ padding: '12px 16px' }}>#{c.nro_cuota}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#003366' }}>S/ {Number(c.monto_total).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.fecha_vencimiento}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {c.estado_cuota === 'Pagada' ? '—' : (
                      <span style={{
                        fontWeight: '600',
                        color: dias < 0 ? '#dc2626' : dias <= 7 ? '#ca8a04' : '#16a34a'
                      }}>
                        {dias < 0 ? `${Math.abs(dias)} días vencida` : dias === 0 ? 'Vence hoy' : `${dias} días`}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: estadoColor[c.estado_cuota]?.bg || '#f3f4f6',
                      color:      estadoColor[c.estado_cuota]?.color || '#374151',
                    }}>{c.estado_cuota}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cronogramas;