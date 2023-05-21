# HOTSHELPER

This is a web app that helps you find the best heroes to pick in Blizzard's Heroes of the Storm game. Based on your allies, your enemies, and the map, it will suggest the best heroes to pick.
I made it with Vue3/Vite, and the backend is a NESTJS server.

Had some fun learning how to scrape data from the web, and how to use Docker to deploy the app.

## How to run

You just need to provide the following environment variables in a .env file at the root of the directory.
    
```
SERVER_PORT= ... # The port the server will run on (mapped in the container)
CLIENT_PORT= ... # The port the client will run on (mapped in the container)
SERVER_HOST= ... # The host the server will run on (mapped in the container), likely localhost in most cases
```

Then, you can run the following command to start the app:

```
docker-compose up
```

