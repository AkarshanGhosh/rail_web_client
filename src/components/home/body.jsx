import { assets } from "../../assets/assets";

function Body() {
  return (
    <div className="h-auto lg:h-[75vh] flex flex-col-reverse lg:flex-row items-center lg:items-center px-4 lg:px-16 bg-white">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0">
        <h1 className="text-4xl lg:text-6xl font-semibold text-gray-800 text-center lg:text-left">
          Welcome to Rail Watch 
        </h1>

        <p className="mt-4 text-lg lg:text-xl text-gray-600 text-center lg:text-left">
        This platform is designed exclusively for railway employees to efficiently monitor the condition of train chains across the network. 
        Stay updated in real-time on whether chains are intact or have been pulled, ensuring quick responses to any disruptions and 
        maintaining passenger safety.To access the monitoring dashboard and detailed train chain reports, 
        employees are required to log in with their credentials. Your secure account ensures access to critical 
        information and helps maintain operational integrity
        </p>
        <div className="mt-6">
          <div className="inline-block text-gray-800 text-lg font-semibold border border-gray-800 px-6 py-2 hover:bg-gray-200 rounded-full">
            Discover
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={assets.train}
          alt="train"
          className="w-32 lg:w-full max-w-xs lg:max-w-lg object-contain"
        />
      </div>
    </div>
  );
}

export default Body;
