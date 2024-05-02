import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import ForgotPassword from './pages/login/ForgotPassword';
import EnterOpt from './pages/login/EnterOpt';
import NewPassword from './pages/login/NewPassword';
import Layout from './components/layout/Layout';
import Project from './pages/project/Project';

function App() {
  const ProtectedRoute = ({ children }) => {
    if (false) {
      return <Navigate to="/login" />
    }
    return children
  }
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='/enter-opt' element={<EnterOpt></EnterOpt>}></Route>
        <Route path='/new-password' element={<NewPassword></NewPassword>}></Route>
        <Route path='/' element={<ProtectedRoute><Layout></Layout></ProtectedRoute>}>
          <Route path='/' element={<Project></Project>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
