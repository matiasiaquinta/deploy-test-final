import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes";

import Register from "./pages/Register";
import { AlumnoForm } from "./pages/AlumnoForm";
import { AlumnoProvider } from "./context/AlumnosContext";
import { Login } from "./pages/Login";
//PAGES
import Home from "./pages/Home";
import Planes from "./pages/Planes";
import { Alumnos } from "./pages/Alumnos";
import Ajustes from "./pages/Ajustes";
import { PlanProvider } from "./context/PlanContext";
import Reportes from "./pages/Reportes";

/* esto es para el deploy */
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevTools();

function App() {
    return (
        <AuthProvider>
            <AlumnoProvider>
                <PlanProvider>
                    <BrowserRouter>
                        <main className="container md:mx-auto md:px-10">
                            {/* navbar */}
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />

                                {/* aca las paginas privadas al logearse */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/reportes"
                                        element={<Reportes />}
                                    />
                                    <Route
                                        path="/planes"
                                        element={<Planes />}
                                    />
                                    <Route
                                        path="/alumnos"
                                        element={<Alumnos />}
                                    />
                                    <Route
                                        path="/ajustes"
                                        element={<Ajustes />}
                                    />
                                </Route>
                            </Routes>
                        </main>
                    </BrowserRouter>
                </PlanProvider>
            </AlumnoProvider>
        </AuthProvider>
    );
}

export default App;
