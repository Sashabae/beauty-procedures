import StarRating from "../reviews/StarRating";
import { Link } from "react-router";

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service.id}`} key={service.id}>
      <div className="card w-full mx-auto max-w-sm bg-base-100 shadow-2xl hover:border-blue-500 border border-black transition duration-200">
        <figure>
          <img
            src={`${UPLOADS_URL}/${service.image}`}
            alt="Service image"
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{service.name}</h2>
          <div className="card-actions items-center justify-end">
            <StarRating rating={service.average_rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}
