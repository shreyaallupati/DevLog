import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/NavBar.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';
import SplashCursor from './components/SplashCursor';
import LiquidEther from './components/LiquidEther';
import ColorBends from './components/ColorBends';
import Galaxy from './components/Galaxy';
import { AuthProvider } from './context/AuthContext.tsx';
// Import our pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile'; 
import { ReadPost } from "./pages/ReadPost"; 


function App() {
    return (
        <AuthProvider>
            <Router>

                {/* Main App Content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 bg- text-white">
                        {/* fixed inset-0 makes it full screen. z-[-1] pushes it behind your app content. */}
                        {/* pointer-events-none ensures it doesn't block you from clicking buttons! */}
                        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                            {/* <SplashCursor
                                SIM_RESOLUTION={192}
                                DYE_RESOLUTION={1280}
                                DENSITY_DISSIPATION={1}
                                VELOCITY_DISSIPATION={1.5}
                                PRESSURE={0.4}
                                CURL={9}
                                SPLAT_RADIUS={0.25}
                                SPLAT_FORCE={10500}
                                COLOR_UPDATE_SPEED={7}
                            /> */}
                            <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none"> 
                                {/* <LiquidEther/> */}
                                <Galaxy />
                                </div>
                            
                            {/* <ColorBends/> */}
                        </div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/posts/:id" element={<ReadPost />} />
                            
                            <Route element={<ProtectedRoute />}>
                                <Route path="/create" element={<CreatePost />} />
                                <Route path="/profile" element={<Profile />} />
                            </Route>
                        </Routes>
                    </main>
                </div>
                
            </Router>
        </AuthProvider>
    );
}

export default App;