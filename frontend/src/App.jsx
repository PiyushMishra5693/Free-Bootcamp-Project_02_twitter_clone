import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/auth/home/HomePage";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/Notification";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const App = () => {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			if(data.error) return null;
			if (!res.ok || data.error) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
				<Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
};

export default App;