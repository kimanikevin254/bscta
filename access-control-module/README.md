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

    - Still in the `api` folder, seed the database:

        ```bash
        npm run prisma:seed
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

    - Navigate to `http://localhost:5173/login` and log in with the details from the seed script.

> This is an invite-only system where the admin(created during the DB seed process) can invite other users and assign them roles. Once the users have been invited, they will receive an email which they can click to accept the invite, provide additional details and log in. Depending on the permissions assigned to their roles, they will have access to different data and be allowed to perform different actions.
