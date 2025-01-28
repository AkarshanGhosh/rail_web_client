# Rail Web Client

The **Rail Web Client** is the frontend interface for the Rail Web Server project. It is designed to provide users with a seamless and responsive experience for managing railway operations, including train, coach, and division data visualization.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
- **Real-Time Updates**: Periodically fetches the latest data from the backend.
- **Coach Details**:
  - Displays coach-specific information, such as latitude, longitude, chain status, temperature, humidity, and error codes.
  - Ensures the latest data is shown first.
- **Train Management**: Allows users to view real-time train-specific data.
- **Error Handling**: User-friendly error messages are displayed for failed API requests or missing data.

## Technologies Used

- **React.js**: For building a dynamic and interactive user interface.
- **React Router**: For managing navigation and dynamic routes.
- **Axios**: For API integration with the backend server.
- **Tailwind CSS**: For responsive and modern UI design.
- **JavaScript (ES6)**: Core language for development.
- **NPM**: Dependency management and build tools.

## Installation and Setup

### Prerequisites
- Ensure the backend server is running. You can set it up using the instructions in the [Rail Web Server](https://github.com/AkarshanGhosh/Rail_Web_Server) repository.
- Node.js and npm must be installed on your system. You can download them from [Node.js Official Site](https://nodejs.org/).

### Steps to Set Up the Frontend
1. Clone the repository:
   ```bash
   git clone https://github.com/AkarshanGhosh/rail_web_client.git
