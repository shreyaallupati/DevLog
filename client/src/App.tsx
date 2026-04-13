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
                
                {/* BACKGROUND LAYER */}
                {/* z-0 keeps it safely above the body background, but behind your z-10 app content */}
                {/* pointer-events-none ensures it doesn't block you from clicking buttons */}
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <Galaxy />
                </div>

                {/* MAIN APP CONTENT LAYER */}
                {/* relative and z-10 ensures all your routes and navbar sit on top of the Galaxy */}
                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 text-white">
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