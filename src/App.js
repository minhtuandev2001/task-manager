import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import ForgotPassword from './pages/login/ForgotPassword';
import EnterOpt from './pages/login/EnterOpt';
import NewPassword from './pages/login/NewPassword';
import Layout from './components/layout/Layout';
import Project from './pages/project/Project';
import Task from './pages/task/Task';
import { AuthContext } from "./context/authContext"


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return children
}
function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
        <Route path='/enter-opt' element={<EnterOpt></EnterOpt>}></Route>
        <Route path='/new-password' element={<NewPassword></NewPassword>}></Route>
        <Route path='/' element={<ProtectedRoute><Layout></Layout></ProtectedRoute>}>
          <Route path='/project' element={<Project></Project>}></Route>
          {/* projectId == "" lấy tất cả */}
          {/* /task/projectId?statusProject=going&search=name */}
          <Route path='/task' element={<Task></Task>}></Route>
        </Route>
        <Route path='*' element={<div>404</div>}></Route>
      </Routes>
    </div>
  );
}

export default App;
