import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import ServiceList from "../../components/services/ServiceList";
import CreateService from "../../components/admin/CreateService";

export default function AllServices() {
  const { user } = useContext(UserContext);

  const [showCreateService, setShowCreateService] = useState(false);

  const toggleCreateService = () => {
    setShowCreateService(!showCreateService);
  };

  return (
    <div>
      <h1 className="text-4xl pb-10 text-center">All Procedures</h1>

      {user && user.role === "admin" && (
        <div className="pb-10">
          <button onClick={toggleCreateService} className="submit-button">
            Create New Service
          </button>

          {showCreateService && <CreateService onClose={toggleCreateService} />}
        </div>
      )}

      <ServiceList />
    </div>
  );
}
