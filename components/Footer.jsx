import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GoogleMapRouteComponent from './Googlemap';
import "../src/app/globals.css";

export default function Footer() {
  return (
    <div className="bg-slate-800">
      <div className="container bg-orange-500 pb-4">
        <div>
          <h2 className="text-white mx-4 pt-4">
            Contact us
          </h2>
        </div>
        <div className="text-white flex flex-col md:flex-row justify-between mx-4 m-4">
          <div className="mb-4 md:mb-0">
            <h3>Address</h3>
            <h3 className="mx-2">98 Sathorn Square Building,</h3>
            <h3 className="mx-2">North Sathorn Road,</h3>
            <h3 className="mx-2">Silom, Bangrak, Bangkok 10500</h3>
          </div>
          <div className="mb-4 md:mb-0">
            <h3 className="">email</h3>
            <h3 className="mx-2">hr@vannessplus.com</h3>
          </div>
          <div>
            <h3 className="">phone</h3>
            <h3 className="mx-2">084-922-3468</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between bg-white rounded-md mx-4">
          <div className="flex-1 w-full h-full m-4 max-w-[300px] p-10">
            <GoogleMapRouteComponent />
          </div>
        </div>
      </div>
      <footer className="py-3 bg-dark">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php" className="nav-link px-2 text-white">HOME</a></li>
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php#about" className="nav-link px-2 text-white">ABOUT US</a></li>
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php#service" className="nav-link px-2 text-white">SERVICES</a></li>
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php#client" className="nav-link px-2 text-white">CLIENTS</a></li>
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php#job" className="nav-link px-2 text-white">JOB</a></li>
          <li className="nav-item"><a href="https://www.vannessplus.com/index.php#articles" className="nav-link px-2 text-white">CAREER TIPS</a></li>
        </ul>
        <p className="text-center text-white">© 2016 Vanness Plus</p>
      </footer>
    </div>
  );
}