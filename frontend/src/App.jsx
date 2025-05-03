// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Restaurants from './components/pages/Restaurants';
import Acceuil from './components/pages/Acceuil';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardRestaurateur from './components/Dashboard/DashboardRestaurateur';
import Menu from './components/pages/Menu';
import AddUser from './components/Formulaire/AddUser';
import AddRestau from './components/Formulaire/AddRestau';
import AddMenu from './components/Formulaire/AddMenu';

import MyCalendar from './components/pages/MyCalendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard/commande" element={<DashboardRestaurateur/>}/>
        <Route path="/dashboard/adduser" element={<AddUser/>}/>
        <Route path="/dashboard/addRestau" element={<AddRestau/>}/>
        <Route path="/dashboard/addmenu" element={<AddMenu/>}/>
        <Route path="/dashboard/MyCalendar" element={<MyCalendar/>}/>
        </Route>
        <Route path="/" element={<Acceuil />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/menu/:id" element={< Menu/>} />

        
       
      </Routes>
    </Router>
  );
}
export default App;
