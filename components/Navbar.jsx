import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 ">
        <Link className="navbar-brand hover:scale-110 transition-transform duration-300" href="https://www.vannessplus.com/index.php">
          Vanness Plus
        </Link>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php#about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php#service">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php#client">
                Clients
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php#job">
                Job
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link hover:scale-110 transition-transform duration-1000" href="https://www.vannessplus.com/index.php#articles">
                Career Tips
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
