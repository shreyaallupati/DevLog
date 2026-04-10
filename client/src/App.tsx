import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/NavBar.tsx';
import { ProtectedRoute } from './components/ProtectedRoute';
import SplashCursor from './components/SplashCursor';
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
                
                {/* --- GLOBAL BACKGROUND ANIMATION --- */}
                {/* fixed inset-0 makes it full screen. z-[-1] pushes it behind your app content. */}
                {/* pointer-events-none ensures it doesn't block you from clicking buttons! */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <SplashCursor
                        SIM_RESOLUTION={192}
                        DYE_RESOLUTION={1280}
                        DENSITY_DISSIPATION={1.5}
                        VELOCITY_DISSIPATION={2.5}
                        PRESSURE={0.4}
                        CURL={11}
                        SPLAT_RADIUS={0.25}
                        SPLAT_FORCE={11500}
                        COLOR_UPDATE_SPEED={7}
                    />
                </div>
                {/* ---------------------------------- */}

                {/* Main App Content */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">
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