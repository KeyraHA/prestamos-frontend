// src/pages/Clientes.jsx
import { useState, useEffect } from 'react';
import { getClientes } from '../services/clienteService';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
  borderRadius: '7px', fontSize: '13px', outline: 'none', background: '#fff',
};
const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px', display: 'block' };
const btnPrimary = { padding: '9px 20px', background: '#003366', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
const btnEdit    = { padding: '5px 12px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginRight: '6px' };
const btnDanger  = { padding: '5px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' };

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    getClientes()
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.dni} ${c.correo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>Cargando clientes...</div>;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>{clientes.length} clientes registrados</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ ...inputStyle, width: '220px' }}
          />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f0f2f5' }}>
            <tr>
              {['ID', 'Nombre completo', 'DNI', 'Correo', 'Celular', 'Ingreso', 'Score', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No se encontraron clientes</td></tr>
            ) : filtrados.map(c => (
              <tr key={c.id_cliente}
                style={{ borderBottom: '1px solid #e5e7eb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{c.id_cliente}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{c.nombre} {c.apellido}</td>
                <td style={{ padding: '12px 16px' }}>{c.dni}</td>
                <td style={{ padding: '12px 16px' }}>{c.correo}</td>
                <td style={{ padding: '12px 16px' }}>{c.celular}</td>
                <td style={{ padding: '12px 16px' }}>S/ {Number(c.ingreso_mensual).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>{c.score_crediticio}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                    background: c.estado_cliente === 'Activo' ? '#dcfce7' : '#fee2e2',
                    color:      c.estado_cliente === 'Activo' ? '#16a34a' : '#dc2626',
                  }}>{c.estado_cliente}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;