# Running the Project

1. `cd` into the `api` folder and:

    - Rename `.env.example` to `.env` and provide the necessary values for sending mail.

    - Execute the command below to run MySQL DB in a Docker container:

        ```bash
        docker compose up
        ```

    - Install dependencies:

        ```bash
        npm i
        ```

    - Run the server:

        ```bash
        npm run start:dev
        ```

2. `cd` into the `frontend` folder and:

    - Install dependencies:

        ```bash
        npm i
        ```

    - Run server:

        ```bash
        npm run dev
        ```

    - Navigate to `http://localhost:5173`
