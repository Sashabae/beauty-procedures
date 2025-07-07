import { BrowserRouter, Route, Routes } from "react-router";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";

import ProtectedRoute from "./components/ProtectedRoute";

// LAYOUT
import Layout from "./layout/Layout";

// PAGES
import NotFound from "./pages/NotFound";
import AllServices from "./pages/services/AllServices";
import MyServices from "./pages/user/MyServices";
import ServiceDetails from "./pages/services/ServiceDetails";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ADMIN
import Registrations from "./pages/admin/Registrations";
import EditService from "./pages/admin/EditService";

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={user ? <AllServices /> : <Login />} />

            <Route path="/services" element={<AllServices />} />
            <Route path="/services/:id" element={<ServiceDetails />} />

            <Route path="*" element={<NotFound />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/myservices"
              element={
                <ProtectedRoute>
                  <MyServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registrations"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Registrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/edit/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditService />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
