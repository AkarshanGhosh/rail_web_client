import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ResourceCard = ({ data }) => {
  return (
    <Link to={`/division-id/${data._id}`}>
      <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Train Name: {data.train_Name}</h2>
        <p className="mt-2 text-gray-600 font-medium">Train Number: {data.train_Number}</p>
        <p className="mt-2 text-gray-600 font-medium">Division: {data.division}</p>
        <p className="mt-2 text-gray-600 font-medium">State: {data.states}</p>
        <p className="mt-2 text-gray-600 font-medium">City: {data.cities}</p>
      </div>
    </Link>
  );
};

// PropTypes for ResourceCard
ResourceCard.propTypes = {
  data: PropTypes.shape({
    train_Name: PropTypes.string.isRequired,
    train_Number: PropTypes.string.isRequired,
    division: PropTypes.string.isRequired,
    states: PropTypes.string.isRequired,
    cities: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceCard;
