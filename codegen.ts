import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.graphql", // says where the schema location is
  generates: {
    "./src/types.ts": {
      // creates new file called types.ts
      plugins: ["typescript", "typescript-resolvers"], // plugins point to our two plugins
      config: {
        contextType: "./context#DataSourceContext",
        mappers: {
          Playlist: "./models#PlaylistModel",
          Track: "./models#TrackModel",
        },
      },
    },
  },

  // typescript is the base plugin needed to generate TypeScript types from our schema
  // typescript-resolvers is the plugin needed to generate TypeScript resolvers from our schema
};

export default config;
