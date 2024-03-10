// TODO
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers";
import { SpotifyAPI } from "./datasources/spotify-api";

// Bring in contents of our schema

// readFileSync and path are used to read in the contents of the schema.graphql file
import { readFileSync } from "fs";
import path from "path";

// gql utility is used for wrapping GraphQL strings like the schema definition we will import
// converts GraphQL strings into the format that Apollo libraries expect when working with operations
// and schemas
import { gql } from "graphql-tag";

// using the imports
const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  }),
);

// Creating an async function
// an async function returns a promise - an object representing the eventual completion or
// failure of an asynchronous operation. Placeholder for a value that is initially unknown, may become
// known or accessible in the future
async function startApolloServer() {
  // Defining a server with a new schema - we add the addMocksToSchema function and pass it an object
  // Object defines its own schema property, here we call the makeExeculableSchema function
  // pass this function an object containing our typeDefs
  // here we are generating an executable schema from our typeDefs and populating every queried schema field
  // with a placeholder value eg Hello World for String fields
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          spotifyAPI: new SpotifyAPI(),
        },
      };
    },
  });
  console.log(`
      🚀  Server is running!
      📭  Query at ${url}
    `);
}

startApolloServer();

// OLD

// import { addMocksToSchema } from "@graphql-tools/mock";
// import { makeExecutableSchema } from "@graphql-tools/schema";

// const mocks = {
//     Query: () => ({
//       featuredPlaylists: () => [...new Array(6)],
//     }),
//     Playlist: () => ({
//       id: () => "playlist_01",
//       name: () => "Groovin' with GraphQL",
//       description: () =>
//         "Serving up the hottest development hits, Groovin' with GraphQL has everything you need to get into the coding mindspace... and stay there!",
//     }),
//   };
