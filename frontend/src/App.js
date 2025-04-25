import './App.css';
import { Routes, Route, useLocation, Navigate} from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignUp from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Climbs from './pages/Climbs.jsx';
import ProtectedRoute from './protectedRoutes.jsx'
import Nav from './components/NavBar.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx'

function App() {
  const location = useLocation();
  
  return (
    <>
      <Routes>  
        <Route path = "/signup" element = {<SignUp/>}></Route>
        <Route path = "/login" element = {<Login/>}></Route>
        
        <Route path="/climbs" element={<ProtectedRoute element = {Climbs}/>}/>
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/profile/:username" element={<ProtectedRoute element = {Profile}/>}/>
        <Route path="/edit-profile" element = {<ProtectedRoute element = {EditProfile}/>}/>
        <Route path="*" element={<Navigate to="/home" />}/>
      </Routes>        

      {location.pathname !== "/signup" && location.pathname !== "/login" && location.pathname !== "/signup-profile" && <Nav />}

    </>
  )
}

export default App;
