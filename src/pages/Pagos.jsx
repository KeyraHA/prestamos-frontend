// src/pages/Pagos.jsx
import { useState, useEffect } from 'react';
import { getPagos, getMoras, getPagosStats } from '../services/pagoService';

const tabs = ['Pagos', 'Moras'];

function Pagos() {
  const [tab, setTab]       = useState('Pagos');
  const [pagos, setPagos]   = useState([]);
  const [moras, setMoras]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    Promise.all([getPagos(), getMoras(), getPagosStats()])
      .then(([pRes, mRes, sRes]) => {
        setPagos(pRes.data);
        setMoras(mRes.data);
        setStats(sRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pagosFiltrados = pagos.filter(p =>
    `${p.nombre} ${p.apellido} ${p.numero_operacion}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const morasFiltradas = moras.filter(m =>
    `${m.nombre} ${m.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando...</div>;

  return (
    <div style={{ padding: '24px' }}>

      {/* Tarjetas stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #003366' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Total pagos</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#003366', marginTop: '4px' }}>{stats?.total_pagos?.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #16a34a' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Monto recaudado</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#16a34a', marginTop: '4px' }}>S/ {Number(stats?.monto_total || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: '4px solid #dc2626' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Casos de mora</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#dc2626', marginTop: '4px' }}>{moras.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#f0f2f5', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setBusqueda(''); }}
            style={{
              padding: '7px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#003366' : '#6b7280',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t}</button>
        ))}
      </div>

      {/* Buscador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>
          {tab === 'Pagos' ? `${pagosFiltrados.length} pagos` : `${morasFiltradas.length} moras`}
        </p>
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', width: '220px' }}
        />
      </div>

      {/* Tabla Pagos */}
      {tab === 'Pagos' && (
        <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ background: '#f0f2f5' }}>
              <tr>
                {['ID', 'Cliente', 'Préstamo', 'Cuota N°', 'Monto', 'Medio de pago', 'Fecha', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No hay pagos registrados</td></tr>
              ) : pagosFiltrados.map(p => (
                <tr key={p.id_pago}
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{p.id_pago}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{p.nombre} {p.apellido}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{p.id_prestamo}</td>
                  <td style={{ padding: '12px 16px' }}>#{p.nro_cuota}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#003366' }}>S/ {Number(p.monto_pago).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>{p.nombre_medio_pago}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{p.fecha_pago}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: p.estado_pago === 'Pagado' ? '#dcfce7' : '#fef9c3',
                      color:      p.estado_pago === 'Pagado' ? '#16a34a' : '#ca8a04',
                    }}>{p.estado_pago}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Moras */}
      {tab === 'Moras' && (
        <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ background: '#f0f2f5' }}>
              <tr>
                {['ID', 'Cliente', 'Préstamo', 'Cuota', 'Días atraso', 'Días gracia', 'Monto mora', 'Vencimiento', 'Calculado'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {morasFiltradas.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No hay moras registradas</td></tr>
              ) : morasFiltradas.map(m => (
                <tr key={m.id_mora}
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{m.id_mora}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>{m.nombre} {m.apellido}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{m.id_prestamo}</td>
                  <td style={{ padding: '12px 16px' }}>#{m.nro_cuota}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: m.dias_atraso > 90 ? '#fee2e2' : m.dias_atraso > 30 ? '#fef9c3' : '#f3f4f6',
                      color:      m.dias_atraso > 90 ? '#dc2626' : m.dias_atraso > 30 ? '#ca8a04' : '#374151',
                    }}>{m.dias_atraso} días</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{m.dias_gracia}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#dc2626' }}>S/ {Number(m.monto_mora).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{m.fecha_vencimiento}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{m.fecha_calculo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Pagos;