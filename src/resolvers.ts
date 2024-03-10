// object keys will correspond to our schema's types and fields

import { Resolvers } from "./types";

// using the Resolcers types adds type safety to our resolvers object
export const resolvers: Resolvers = {
  Query: {
    // four optional arguments featuredPlaylists: (parent, args, contextValue, info) => {},
    // parent: returned value of the resolcer for the field's parents, useful when dealing with
    // resolvers that are nested
    // args: object that contains the GraphQL arguments that were provided for the field by the GraphQL
    // operation. When querying for a specific item (eg a specific track instead of all tracks), in
    // client land we will make a query with an id argument accessible via this args param
    // contextValue: object shared across all resolvers that are executing a particular operation.
    // resolver needs this arg to share state, like auth info, database connection or in our case the RESTDataSource
    // info: contains info about the operation's execution state including field name, path from the field to the root
    featuredPlaylists: (_, __, { dataSources }) => {
      return dataSources.spotifyAPI.getFeaturedPlaylists();
    },

    playlist: (_, { id }, { dataSources }) => {
      return dataSources.spotifyAPI.getPlaylist(id);
    },
  },
  Playlist: {
    tracks: ({ tracks }) => {
      const { items = [] } = tracks;
      return items.map(({ track }) => track);
    },
  },
  Track: {
    durationMs: (parent) => parent.duration_ms,
  },
};
