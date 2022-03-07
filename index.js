const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
const baseRouter = require("./routes");
global.__basedir = __dirname

const init = async () => {
    //server
    const server = new Hapi.Server({
      port: 1234,
      host: "localhost",
    });
  
    // await jwtAuthentication(server);
  
    const swaggerOptions = {
      documentationPath: "/documentation",
      basePath: "/api",
      info: {
        title: "Test API Documentation",
        version: Pack.version,
      },
      grouping: "tags",
      securityDefinitions: {
        jwt: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
      security: [{ jwt: [] }],
      schemes: ["http", "https"],
    };
  
    // Adding plugins for swagger docs;
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);
  
    await server.register(baseRouter);
  
    server.events.on("response", function (request) {
      console.log(
        request.info.remoteAddress +
          ": " +
          request.method.toUpperCase() +
          " " +
          request.path +
          " --> " +
          request.response.statusCode
      );
    });
    await server.start();
    console.log("Server running on %s", server.info.uri);
  };
  
  //failure function
  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });
  
  init();
  