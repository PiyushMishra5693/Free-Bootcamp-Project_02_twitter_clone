import { Routes,Route } from "react-router-dom"
import HomePage from "./pages/auth/home/HomePage"
import Signup from "./pages/auth/signup/Signup"
import Login from "./pages/auth/login/Login"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/Notification"
import ProfilePage from "./pages/profile/ProfilePage"
const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/notifications" element={<NotificationPage/>}/>
        <Route path="/profile/:userName" element={<ProfilePage/>}/>
      </Routes>
      <RightPanel/>
    </div>
  )
}

export default App