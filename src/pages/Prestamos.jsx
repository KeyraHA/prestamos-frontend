// src/pages/Prestamos.jsx
import { useState, useEffect } from 'react';
import { getPrestamos, getPrestamosStats } from '../services/prestamoService';
import CronogramaModal from '../components/CronogramaModal';

const estadoColor = {
  Activo:    { bg: '#dcfce7', color: '#16a34a' },
  Cancelado: { bg: '#f3f4f6', color: '#6b7280' },
  Moroso:    { bg: '#fee2e2', color: '#dc2626' },
  Vencido:   { bg: '#fef9c3', color: '#ca8a04' },
};

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [stats, setStats]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busqueda, setBusqueda]   = useState('');
  const [filtro, setFiltro]       = useState('Todos');
  const [cronogramaId, setCronogramaId] = useState(null);

  useEffect(() => {
    Promise.all([getPrestamos(), getPrestamosStats()])
      .then(([pRes, sRes]) => {
        setPrestamos(pRes.data);
        setStats(sRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStat = (estado) => stats.find(s => s.estado_prestamo === estado)?.total || 0;
  const getMonto = (estado) => stats.find(s => s.estado_prestamo === estado)?.monto_total || 0;

  const filtrados = prestamos.filter(p => {
    const matchB = `${p.nombre} ${p.apellido} ${p.dni}`.toLowerCase().includes(busqueda.toLowerCase());
    const matchF = filtro === 'Todos' || p.estado_prestamo === filtro;
    return matchB && matchF;
  });

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando préstamos...</div>;

  return (
    <div style={{ padding: '24px' }}>

      {/* Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Activos',    estado: 'Activo',    icon: '💰', color: '#16a34a' },
          { label: 'Morosos',    estado: 'Moroso',    icon: '⚠️', color: '#dc2626' },
          { label: 'Cancelados', estado: 'Cancelado', icon: '✅', color: '#6b7280' },
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
                <div style={{ fontSize: '26px', fontWeight: '700', color: c.color, marginTop: '4px' }}>{getStat(c.estado)}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  S/ {Number(getMonto(c.estado)).toLocaleString()}
                </div>
              </div>
              <span style={{ fontSize: '28px' }}>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>{filtrados.length} préstamos</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Buscar cliente o DNI..."
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
            <option>Activo</option>
            <option>Moroso</option>
            <option>Cancelado</option>
            <option>Vencido</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f0f2f5' }}>
            <tr>
              {['ID', 'Cliente', 'Monto aprobado', 'Tasa', 'Plazo', 'Fecha inicio', 'Estado', 'Cronograma'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron préstamos</td></tr>
            ) : filtrados.map(p => (
              <tr key={p.id_prestamo}
                style={{ borderBottom: '1px solid #e5e7eb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{p.id_prestamo}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{p.nombre} {p.apellido}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#003366' }}>S/ {Number(p.monto_aprobado).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>{p.valor_tasa}% {p.tipo_tasa}</td>
                <td style={{ padding: '12px 16px' }}>{p.plazo_meses} meses</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{p.fecha_inicio}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                    background: estadoColor[p.estado_prestamo]?.bg || '#f3f4f6',
                    color:      estadoColor[p.estado_prestamo]?.color || '#374151',
                  }}>{p.estado_prestamo}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => setCronogramaId(p.id_prestamo)}
                    style={{ padding: '4px 12px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    📅 Ver cuotas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal cronograma */}
      {cronogramaId && (
        <CronogramaModal
          prestamoId={cronogramaId}
          onCerrar={() => setCronogramaId(null)}
        />
      )}
    </div>
  );
}

export default Prestamos;