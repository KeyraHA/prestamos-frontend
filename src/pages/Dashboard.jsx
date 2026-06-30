// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getStats, getPagos } from '../services/dashboardService';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } },
};

const doughnutOptions = {
  responsive: true, cutout: '70%',
  plugins: { legend: { position: 'bottom' } },
};

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value ?? '...'}</div>
          {sub && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{sub}</div>}
        </div>
        <span style={{ fontSize: '28px' }}>{icon}</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [pagos, setPagos]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getPagos()])
      .then(([sRes, pRes]) => {
        setStats(sRes.data);
        setPagos(pRes.data.slice(0, 8));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const doughnutData = {
    labels: ['Préstamos', 'Pagos', 'Morosos'],
    datasets: [{
      data: [
        stats?.total_prestamos || 0,
        stats?.total_pagos     || 0,
        stats?.morosos         || 0,
      ],
      backgroundColor: ['#003366', '#e8a020', '#dc2626'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: ['Clientes', 'Activos', 'Préstamos', 'Pagos', 'Morosos'],
    datasets: [{
      label: 'Total',
      data: [
        stats?.total_clientes   || 0,
        stats?.clientes_activos || 0,
        stats?.total_prestamos  || 0,
        stats?.total_pagos      || 0,
        stats?.morosos          || 0,
      ],
      backgroundColor: ['#003366','#0066cc','#e8a020','#16a34a','#dc2626'],
      borderRadius: 6,
    }],
  };

  if (loading) return (
    <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
      Cargando datos...
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Clientes"   value={stats?.total_clientes?.toLocaleString()}   icon="👥" color="#003366" sub={`${stats?.clientes_activos} activos`} />
        <StatCard label="Préstamos"  value={stats?.total_prestamos?.toLocaleString()}  icon="💰" color="#0066cc" />
        <StatCard label="Pagos"      value={stats?.total_pagos?.toLocaleString()}      icon="💳" color="#e8a020" />
        <StatCard label="Morosos"    value={stats?.morosos?.toLocaleString()}          icon="⚠️" color="#dc2626" />
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Resumen general</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Distribución</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Últimos pagos */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Últimos pagos registrados</h3>
        {pagos.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '13px' }}>No hay pagos registrados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Cliente', 'Cuota N°', 'Monto', 'Fecha', 'Estado', 'Medio'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagos.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', fontWeight: '500' }}>{p.nombre} {p.apellido}</td>
                  <td style={{ padding: '10px 12px' }}>#{p.nro_cuota}</td>
                  <td style={{ padding: '10px 12px' }}>S/ {Number(p.monto_pago).toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{p.fecha_pago}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                      background: p.estado_pago === 'Pagado' ? '#dcfce7' : '#fef9c3',
                      color:      p.estado_pago === 'Pagado' ? '#16a34a' : '#ca8a04',
                    }}>{p.estado_pago}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#6b7280' }}>{p.nombre_medio_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;