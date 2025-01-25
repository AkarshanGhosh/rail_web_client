const UnderConstruction = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        <div className="text-center max-w-lg p-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-4">
            Page Under Construction
          </h1>
          <p className="text-lg text-zinc-300 mb-6">
            We're working hard to bring you a better experience. Please check back soon!
          </p>
          <div className="flex justify-center mb-4">
            <iframe
              src="https://giphy.com/embed/vR1dPIYzQmkRzLZk2w"
              width="100%"
              height="100%"
              className="max-w-xs md:max-w-md h-auto"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <p>
            <a
              href="https://giphy.com/gifs/pudgypenguins-maintenance-under-construction-vR1dPIYzQmkRzLZk2w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              
            </a>
          </p>
        </div>
      </div>
    );
  };
  
  export default UnderConstruction;
  