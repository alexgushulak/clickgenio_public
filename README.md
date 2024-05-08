Please ⭐Star⭐ if you like this project!

## To run the client:

Install node packages using npm
```console
clickgenio/client:~ $ npm install
```
then use this command to run the vite react project
```console
clickgenio/client:~ $ npm run client
```
After a success full launch you should see the localhost which can be launched by typing `-o`
```console
  VITE v4.4.9

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Links to libraries:
- https://mui.com/material-ui/getting-started/
- https://react.dev/
- https://www.typescriptlang.org/


## To run the server:
Navigate to the server directory and install node packages using npm
```console
clickgenio/server:~ $ npm install
```
then use this command to run the vite react project
```console
clickgenio/server:~ $ npm run server
```
You should see this if the server launches properly. It will also try to do some other stuff that will not work since the infrastructure is not setup.
```console
> server@1.0.0 server
> node server
```

## Tips:
1. Running this project requires some infrastructure: A database (Postgres) which can be run locally.
2. API keys for necessary functionality such as for OpenAI API calls, or Google OAuth.
3. Certain environment variables must be set. If all the environment variables are correct, everything should run properly.
