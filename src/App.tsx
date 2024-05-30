// import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from './routes';

function App() {

  return (
      <Routes>
        {/* Redirect the root path to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Map through the routes and create Route components */}
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
  )
}

export default App
