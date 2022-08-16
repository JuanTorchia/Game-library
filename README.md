# springboot-react-keycloak

The goal of this project is to secure `games-app` using [`Keycloak`](https://www.keycloak.org/)(with PKCE). `games-app` consists of two applications: one is a [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) Rest API called `games-api` and another is a [ReactJS](https://reactjs.org/) application called `games-ui`.

## Project diagram

![project-diagram](documentation/project-diagram.png)

## Applications

- ### games-api

  `Spring Boot` Web Java backend application that exposes a REST API to manage **games**. Its secured endpoints can just be accessed if an access token (JWT) issued by `Keycloak` is provided.
  
  `games-api` stores its data in a [`Mongo`](https://www.mongodb.com/) database.

  `game-api` has the following endpoints

  | Endpoint                                                          | Secured | Roles                       |
  |-------------------------------------------------------------------|---------|-----------------------------|
  | `GET /api/userextras/me`                                          | Yes     | `GAMES_MANAGER` and `USER` |
  | `POST /api/userextras/me -d {avatar}`                             | Yes     | `GAMES_MANAGER` and `USER` | 
  | `GET /api/games`                                                 | No      |                             |
  | `GET /api/games/{imdbId}`                                        | No      |                             |
  | `POST /api/games -d {"imdb","title","director","year","poster"}` | Yes     | `GAMES_MANAGER`            |
  | `DELETE /api/games/{imdbId}`                                     | Yes     | `MANAGE_GAMES`             |
  | `POST /api/games/{imdbId}/comments -d {"text"}`                  | Yes     | `GAMES_MANAGER` and `USER` |

- ### games-ui

  `ReactJS` frontend application where `users` can see and comment games and `admins` can manage games. In order to access the application, `user` / `admin` must login using his/her username and password. Those credentials are handled by `Keycloak`. All the requests coming from `games-ui` to secured endpoints in `games-api` have a access token (JWT) that is generated when `user` / `admin` logs in.
  
  `games-ui` uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

## Prerequisites

- [`Java 11+`](https://www.oracle.com/java/technologies/downloads/#java11)
- [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [`Docker`](https://www.docker.com/)
- [`Docker-Compose`](https://docs.docker.com/compose/install/)
- [`jq`](https://stedolan.github.io/jq)
- [`OMDb API`](https://rapidapi.com/psimavel/api/steam2/) KEY

  To use the `Wizard` option to search and add a game, you need to get an API KEY from OMDb API. In order to do it, access https://www.omdbapi.com/apikey.aspx and follow the steps provided by the website.

  Once you have the API KEY, create a file called `.env.local` in `springboot-react-keycloak/games-ui` folder with the following content 
  ```
  REACT_APP_OMDB_API_KEY=<your-api-key>
  ```

## PKCE

As `Keycloak` supports [`PKCE`](https://tools.ietf.org/html/rfc7636) (`Proof Key for Code Exchange`) since version `7.0.0`, we are using it in this project. 

## Start Environment

- In a terminal and inside `Games Library` root folder run
  ```
  docker-compose up -d
  ```

- Wait for all Docker containers to be up and running. To check it, run
  ```
  docker-compose ps
  ```

## Running games-app using Maven & Npm

- **games-api**

  - Open a terminal and navigate to `Games Library/games-api` folder

  - Run the following `Maven` command to start the application
    ```
    ./mvnw clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=9080"
    ```

    Once the startup finishes, `KeycloakInitializerRunner.java` class will run and initialize `company-services` realm in `Keycloak`. Basically, it will create:
    - Realm: `company-services`
    - Client: `games-app`
    - Client Roles: `GAMES_MANAGER` and `USER`
    - Two users
      - `admin`: with roles `MANAGE_GAMES` and `USER`
      - `user`: only with role `USER`

  
- **games-ui**

  - Open another terminal and navigate to `springboot-react-keycloak/games-ui` folder

  - Run the command below if you are running the application for the first time
    ```
    npm install
    ```

  - Run the `npm` command below to start the application
    ```
    npm start
    ```

## Applications URLs

| Application | URL                                         | Credentials                           |
|-------------|---------------------------------------------|---------------------------------------|
| games-api   | http://localhost:9080/swagger-ui/index.html | [Access Token](#getting-access-token) |
| games-ui    | http://localhost:3000                       | `admin/admin` or `user/user`          |
| Keycloak    | http://localhost:8080/admin                 | `admin/admin`                         |



## Testing games-api endpoints

You can manage games by accessing directly `games-api` endpoints using the Swagger website or `curl`. However, for the secured endpoints like `POST /api/games`, `PUT /api/games/{id}`, `DELETE /api/games/{id}`, etc, you need to inform an access token issued by `Keycloak`.

### Getting Access Token

- Open a terminal

- Run the following commands to get the access token
  ```
  ACCESS_TOKEN="$(curl -s -X POST \
    "http://localhost:8080/realms/company-services/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin" \
    -d "password=admin" \
    -d "grant_type=password" \
    -d "client_id=games-app" | jq -r .access_token)"

  echo $ACCESS_TOKEN
  ```

### Calling games-api endpoints using curl

- Trying to add a game without access token
  ```
  curl -i -X POST "http://localhost:9080/api/games" \
    -H "Content-Type: application/json" \
    -d '{ "imdbId": "tt5580036", "title": "I, Tonya", "director": "Craig Gillespie", "year": 2017, "poster": "https://m.media-amazon.com/images/M/MV5BMjI5MDY1NjYzMl5BMl5BanBnXkFtZTgwNjIzNDAxNDM@._V1_SX300.jpg"}'
  ```

  It should return
  ```
  HTTP/1.1 401
  ```

- Trying again to add a game, now with access token (obtained at #getting-access-token)
  ```
  curl -i -X POST "http://localhost:9080/api/games" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "imdbId": "tt5580036", "title": "I, Tonya", "director": "Craig Gillespie", "year": 2017, "poster": "https://m.media-amazon.com/images/M/MV5BMjI5MDY1NjYzMl5BMl5BanBnXkFtZTgwNjIzNDAxNDM@._V1_SX300.jpg"}'
  ```

  It should return
  ```
  HTTP/1.1 201
  {
    "imdbId": "tt5580036",
    "title": "I, Tonya",
    "director": "Craig Gillespie",
    "year": "2017",
    "poster": "https://m.media-amazon.com/images/M/MV5BMjI5MDY1NjYzMl5BMl5BanBnXkFtZTgwNjIzNDAxNDM@._V1_SX300.jpg"
  }
  ```

- Getting the list of games. This endpoint does not requires access token
  ```
  curl -i http://localhost:9080/api/games
  ```

  It should return
  ```
  HTTP/1.1 200
  [
    {
      "imdbId": "tt5580036",
      "title": "I, Tonya",
      "director": "Craig Gillespie",
      "year": "2017",
      "poster": "https://m.media-amazon.com/images/M/MV5BMjI5MDY1NjYzMl5BMl5BanBnXkFtZTgwNjIzNDAxNDM@._V1_SX300.jpg",
      "comments": []
    }
  ]
  ```

### Calling games-api endpoints using Swagger

- Access `games-api` Swagger website, http://localhost:9080/swagger-ui/index.html

- Click `Authorize` button.

- In the form that opens, paste the `access token` (obtained at [getting-access-token](#getting-access-token)) in the `Value` field. Then, click `Authorize` and `Close` to finalize.

- Done! You can now access the secured endpoints

## Useful Commands

- **MongoDB**

  List all games
  ```
  docker exec -it mongodb mongo gamesdb
  db.games.find()
  ```
  > Type `exit` to get out of MongoDB shell

## Shutdown

- To stop `games-api` and `games-ui`, go to the terminals where they are running and press `Ctrl+C`

- To stop and remove docker-compose containers, network and volumes, go to a terminal and, inside `springboot-react-keycloak` root folder, run the command below
  ```
  docker-compose down -v
  ```

## How to upgrade games-ui dependencies to latest version

- In a terminal, make sure you are in `springboot-react-keycloak/games-ui` folder

- Run the following commands
  ```
  npm upgrade
  npm i -g npm-check-updates
  ncu -u
  npm install
  ```
  
  
## TO-DO 

- **Social Identity Providers** like `Google`, `Facebook`, `Twitter`, `GitHub`, etc can be configured by following the steps described in [`Keycloak` Documentation](https://www.keycloak.org/docs/latest/server_admin/#social-identity-providers)
 
