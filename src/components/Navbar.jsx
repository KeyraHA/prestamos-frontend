// src/components/Navbar.jsx
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/':             'Dashboard',
  '/clientes':     'Clientes',
  '/solicitudes':  'Solicitudes',
  '/evaluaciones': 'Evaluaciones',
  '/prestamos':    'Préstamos',
  '/cronogramas':  'Cronogramas',
  '/pagos':        'Pagos',
  '/reportes':     'Reportes',
};

function Navbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Sistema';

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-text)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '6px 12px',
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              color: 'var(--color-text)',
              width: '180px',
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px',
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.2' }}>Administrador</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>admin@interbank.pe</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;