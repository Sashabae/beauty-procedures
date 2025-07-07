import { Outlet } from "react-router";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <div className="sticky top-0 mb-15 z-50">
        <Header />
      </div>
      <main className="container min-h-screen">
        <Outlet />
      </main>
      <div className="mt-15">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
