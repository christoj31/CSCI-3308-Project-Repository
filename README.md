Sec 14 Team 1

Contributors:
Christo Jewett, chje6872@colorado.edu
Andrew Rho, anrh8554@colorado.edu
Daria Ruchala, daru8464@gmail.edu
Irene Weimer, irwe7876@colorado.edu
Max, Aronheim, maar5011@colorad.edu
Jay Hernandez, Jahir.Hernandez@colorado.edu
...

Application description:
Our application is a streamlined leads tracker designed specifically for internship opportunities. It helps users organize, track, and manage internship applications, providing a clear overview of statuses and deadlines in one place. Future versions aim to enhance this experience with automated reminders via SMS or Google Calendar to keep users on top of important updates.

Technology Stack:
Frontend:
  Languages: HTML, CSS, JS
  UI Tools: Tailwind, DaisyUI
Backend:
  Language: Nodejs
  Framework: Express
Database:
  Language: SQL
  Database: Postgres
ApplicationServer:
  Language: Nodejs
Middleware: None
Cloud Provider: Render

*****DIRECTORY STRUCTURE*****
All application code can be found within the project source code. Within this folder are several configuration files and a src folder which houses all of our primary code base for the entire application. Routes can be found directly within index.js. Other relevant fodlers would include milestone submissions which houses relevant design documents and meeting notes from our meetings with the TA. Team meeting logs also house relevant meetings that occured outside of our time with the TA.

Prerequisites:
## Prerequisites

To run this application, ensure the following software is installed on your machine:

### Frontend

- **Node.js**: Required for running and managing packages.
  - [Download Node.js](https://nodejs.org/)
  
- **Tailwind CSS**: Utility-first CSS framework for styling.
  - Install Tailwind CSS in your Svelte project:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init
    ```

- **DaisyUI**: A component library for Tailwind CSS.
  - Install DaisyUI in your Svelte project:
    ```bash
    npm install daisyui
    ```

### Backend

- **Node.js**: (Already mentioned above)
  
- **Express**: Web framework for Node.js.
  - Install Express in your backend project:
    ```bash
    npm install express
    ```

### Database

- **PostgreSQL**: Database server to store application data.
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - Optionally, install **pgAdmin** for a graphical interface.

### Middleware

- **Google Calendar API**: To integrate calendar functionalities.
  - Set up a Google Cloud project and enable the Google Calendar API. Refer to the [Google Calendar API documentation](https://developers.google.com/calendar) for setup instructions.

### Cloud Provider

- **Render**: For deploying the application.
  - Create an account at [Render](https://render.com/) and follow the deployment instructions.

Instructions on how to run the application locally:
## Running the Application Locally
------
To run the application on your local machine, follow these steps:
To run the application from the CSCI-3308-Project-Repository, please follow these steps:

1. git clone https://github.com/christoj31/CSCI-3308-Project-Repository.git
2. cd CSCI-3308-Project-Repository
3. npm install
4. npm run migrate
5. npm start
------
How to run the tests:
To run the tests, please follow these steps:
1. cd CSCI-3308-Project-Repository
2. cd ProjectSourceCode
3. docker compose up

The tests will run automatically, you will see them at the bottom of your terminal.
------
Link to the deployed application:
https://node-jra9.onrender.com/login

********

If your docker still doesn't work, try this order of CLI commands:

Commands: docker compose down, rm -rf node_modules, npm install, docker compose up --build
  if that still doesn't work, continue by executing this:
    docker exec -it projectsourcecode-web-1 sh -c "rm -rf node_modules && npm install", docker compose up
