import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <img src="/beauty.svg" alt="lipstick icon" className="w-12" />
        <p className="text-lg font-bold">Procedures</p>
      </aside>

      {/* Services */}
      <nav>
        <h6 className="footer-title">Procedures</h6>
        <Link to={"/services"} className="link link-hover">
          All procedures
        </Link>
      </nav>

      {/* Not functional links */}
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
}
