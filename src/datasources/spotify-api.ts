import { RESTDataSource } from "@apollo/datasource-rest";
import { PlaylistModel, SnapshotOrError } from "../models";
// class to allow us to pull data from the Spotify API

export class SpotifyAPI extends RESTDataSource {
  // base URL, property used as the prefix to all calls - make sure it ends with a /!
  baseURL = "https://spotify-demo-api-fe224840a08c.herokuapp.com/v1/";

  // method to reach out to REST API and return playlist data
  // return type defined as a Promise of a list of playlists
  async getFeaturedPlaylists(): Promise<PlaylistModel[]> {
    // perform a GET request to the browse/featured-playlists endpoint

    // from exploring the endpoint, we know that our response is an object with
    // a playlists key which contains an array of items
    // since this.get returns a promise, we need to add the await keyword
    // and turn the getFeaturedPlaylists method async
    const response = await this.get<{ playlists: { items: PlaylistModel[] } }>(
      "browse/featured-playlists",
    );

    return response?.playlists?.items ?? [];
  }

  // method to reach out to REST API and return playlist data
  getPlaylist(playlistId: string): Promise<PlaylistModel> {
    return this.get(`playlists/${playlistId}`);
  }

  addItemsToPlaylist(input: {
    playlistId: string;
    uris: string[];
  }): Promise<SnapshotOrError> {
    const { playlistId, uris } = input;
    return this.post(`playlists/${playlistId}/tracks`, {
      params: {
        uris: uris.join(","),
      },
    });
  }
}
