// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const menuItems = [
  { path: '/',            label: 'Dashboard',    icon: '📊' },
  { path: '/clientes',    label: 'Clientes',     icon: '👥' },
  { path: '/solicitudes', label: 'Solicitudes',  icon: '📄' },
  { path: '/evaluaciones',label: 'Evaluaciones', icon: '📋' },
  { path: '/prestamos',   label: 'Préstamos',    icon: '💰' },
  { path: '/cronogramas', label: 'Cronogramas',  icon: '📅' },
  { path: '/pagos',       label: 'Pagos',        icon: '💳' },
  { path: '/reportes',    label: 'Reportes',     icon: '📈' },
];

const sidebarStyle = {
  width: 'var(--sidebar-width)',
  height: '100vh',
  background: 'var(--color-primary)',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,
  boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
};

const logoStyle = {
  padding: '24px 20px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.10)',
  marginBottom: '8px',
};

const logoTitleStyle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  letterSpacing: '0.3px',
};

const logoSubStyle = {
  color: 'var(--color-accent)',
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  marginTop: '2px',
};

const navStyle = {
  flex: 1,
  padding: '8px 12px',
  overflowY: 'auto',
};

function Sidebar() {
  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>
        <div style={logoTitleStyle}>🏦 InterBank</div>
        <div style={logoSubStyle}>Sistema de Préstamos</div>
      </div>

      <nav style={navStyle}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '2px',
              textDecoration: 'none',
              color: isActive ? '#ffffff' : 'var(--color-sidebar-text)',
              background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              fontWeight: isActive ? '600' : '400',
              fontSize: '13.5px',
              transition: 'all 0.15s ease',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'var(--color-sidebar-hover)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        color: 'var(--color-sidebar-text)',
        fontSize: '11px',
      }}>
        © 2025 InterBank
      </div>
    </aside>
  );
}

export default Sidebar;