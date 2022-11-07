
# Auth Pro

This is an API project for a role-aware user authentication/registration system, using restify + mondodb.

## Progress
-----

- [x] Routing
- [x] Hypermedia Rest
- [x] JWT configuration
- [x] Authenticated routes with roles
- [x] Logger
- [x] Errors handling
- [x] Tests
- [x] Cors configuration

## Available Scripts
-----

Builds the app for production to the dist folder.

```
    npm run build
```

Runs the app in the development mode.

```
    npm run dev
```

Launches the test runner.

```
    npm run test
```


## Extra 
-----


### Starting mongo db

I advise using docker to instantiate the database

```
docker run -d -p 27017:27017 -v /project-folder-data/db --name auth-mongo mongo
```

### Load test example:

Install the [loadtest](https://www.npmjs.com/package/loadtest) before running the codes below

```
loadtest -c 100 -t 15 http://localhost:4000
```