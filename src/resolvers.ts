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
  Mutation: {
    addItemsToPlaylist: async (_, { input }, { dataSources }) => {
      try {
        const response = await dataSources.spotifyAPI.addItemsToPlaylist(input);
        if (response.snapshot_id) {
          return {
            code: 200,
            success: true,
            message: "Tracks added to playlist!",
            playlistId: response.snapshot_id,
          };
        } else {
          throw Error("snapshot_id property not found");
        }
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${err}`,
          playlistId: null,
        };
      }
    },
  },
  AddItemsToPlaylistPayload: {
    playlist: ({ playlistId }, _, { dataSources }) => {
      return dataSources.spotifyAPI.getPlaylist(playlistId);
    },
  },
};
