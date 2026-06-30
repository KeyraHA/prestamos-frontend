import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard    from './pages/Dashboard';
import Clientes     from './pages/Clientes';
import Solicitudes  from './pages/Solicitudes';
import Evaluaciones from './pages/Evaluaciones';
import Prestamos    from './pages/Prestamos';
import Cronogramas  from './pages/Cronogramas';
import Pagos        from './pages/Pagos';
import Reportes     from './pages/Reportes';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"             element={<Dashboard />} />
              <Route path="/clientes"     element={<Clientes />} />
              <Route path="/solicitudes"  element={<Solicitudes />} />
              <Route path="/evaluaciones" element={<Evaluaciones />} />
              <Route path="/prestamos"    element={<Prestamos />} />
              <Route path="/cronogramas"  element={<Cronogramas />} />
              <Route path="/pagos"        element={<Pagos />} />
              <Route path="/reportes"     element={<Reportes />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;