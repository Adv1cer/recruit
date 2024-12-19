import "bootstrap/dist/css/bootstrap.min.css"
import Image from "next/image"
export default function Navbar() {
    return (
        <div >
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <a className="navbar-brand" href="https://www.vannessplus.com/index.php">Vanness Plus</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php#about">About us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php#service">Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php#client">Clients</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php#job">Job</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://www.vannessplus.com/index.php#articles">Career tips</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}