// src/components/CronogramaModal.jsx
import { useState, useEffect } from 'react';
import { getCronograma } from '../services/prestamoService';

const estadoCuota = {
  Pagada:   { bg: '#dcfce7', color: '#16a34a' },
  Pendiente:{ bg: '#fef9c3', color: '#ca8a04' },
  Vencida:  { bg: '#fee2e2', color: '#dc2626' },
};

function CronogramaModal({ prestamoId, onCerrar }) {
  const [cuotas, setCuotas]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCronograma(prestamoId)
      .then(res => setCuotas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [prestamoId]);

  const pagadas   = cuotas.filter(c => c.estado_cuota === 'Pagada').length;
  const pendientes = cuotas.filter(c => c.estado_cuota === 'Pendiente').length;
  const vencidas  = cuotas.filter(c => c.estado_cuota === 'Vencida').length;
  const progreso  = cuotas.length > 0 ? Math.round((pagadas / cuotas.length) * 100) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '680px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Cronograma de Pagos — Préstamo #{prestamoId}</h2>
          <button onClick={onCerrar} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>Cargando cronograma...</div>
        ) : (
          <>
            {/* Resumen + barra progreso */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Pagadas',    val: pagadas,    color: '#16a34a' },
                { label: 'Pendientes', val: pendientes, color: '#ca8a04' },
                { label: 'Vencidas',   val: vencidas,   color: '#dc2626' },
              ].map(c => (
                <div key={c.label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                <span>Progreso de pago</span>
                <span>{progreso}%</span>
              </div>
              <div style={{ height: '8px', background: '#f0f2f5', borderRadius: '4px' }}>
                <div style={{ width: `${progreso}%`, height: '100%', background: '#003366', borderRadius: '4px', transition: 'width 0.5s ease' }} />
              </div>
            </div>

            {/* Tabla cuotas */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ background: '#f0f2f5', position: 'sticky', top: 0 }}>
                  <tr>
                    {['N° Cuota', 'Monto', 'Vencimiento', 'Fecha pago', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cuotas.map(c => (
                    <tr key={c.id_cuota}
                      style={{ borderBottom: '1px solid #e5e7eb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>Cuota {c.nro_cuota}</td>
                      <td style={{ padding: '10px 14px' }}>S/ {Number(c.monto_total).toLocaleString()}</td>
                      <td style={{ padding: '10px 14px', color: '#6b7280' }}>{c.fecha_vencimiento}</td>
                      <td style={{ padding: '10px 14px', color: '#6b7280' }}>{c.fecha_pago || '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                          background: estadoCuota[c.estado_cuota]?.bg || '#f3f4f6',
                          color:      estadoCuota[c.estado_cuota]?.color || '#374151',
                        }}>{c.estado_cuota}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CronogramaModal;