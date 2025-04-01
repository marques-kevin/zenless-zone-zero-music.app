import { FirebaseService } from "@/services/firebase.service";
import { FirebaseUtils } from "@/utils/FirebaseUtils";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import { IPlaylistsRepository } from "@/interfaces/IPlaylistsRepository";
import { Playlist } from "@/types/playlist.type";
import { Track } from "@/types/track.type";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";

export class PlaylistsRepositoryFirebase
  extends FirebaseUtils
  implements IPlaylistsRepository
{
  constructor(private firebase: FirebaseService) {
    super();
  }

  async delete_playlist(params: {
    playlist_id: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const playlists_ref = collection(db, "users");
      const playlists_user_ref = doc(playlists_ref, params.user_id);
      const playlists_user_playlists_ref = collection(
        playlists_user_ref,
        "playlists"
      );

      const playlist_doc = doc(
        playlists_user_playlists_ref,
        params.playlist_id
      );

      await deleteDoc(playlist_doc);

      return {
        error: false,
        data: null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }

  async create(params: {
    user_id: string;
    name: string;
    cover: string;
  }): Promise<IRepositoryResponse<Playlist>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const playlists_ref = collection(db, "users");
      const playlists_user_ref = doc(playlists_ref, params.user_id);
      const playlists_user_playlists_ref = collection(
        playlists_user_ref,
        "playlists"
      );

      // Check if playlist with same name exists
      const playlists_query = await getDoc(playlists_user_ref);
      const playlists: Playlist[] = playlists_query.data()?.playlists || [];

      const does_playlist_already_exists = playlists.find(
        (playlist) => playlist.playlist_name === params.name
      );

      if (does_playlist_already_exists) {
        return {
          error: false,
          data: does_playlist_already_exists,
        };
      }

      const playlist_doc = doc(playlists_user_playlists_ref);
      const playlist_data = {
        playlist_name: params.name,
        playlist_cover: params.cover,
        playlist_id: playlist_doc.id,
        tracks: [],
        playlist_type: "user",
      };

      await setDoc(playlist_doc, playlist_data);

      return {
        error: false,
        data: playlist_data as Playlist,
      };
    } catch (error: any) {
      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }

  async change_playlist_picture(params: {
    playlist_id: string;
    character: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const users_ref = collection(db, "users");
      const users_user_ref = doc(users_ref, params.user_id);
      const users_user_playlists_ref = collection(users_user_ref, "playlists");
      const playlist_doc = doc(users_user_playlists_ref, params.playlist_id);

      await updateDoc(playlist_doc, {
        playlist_cover: params.character,
      });

      return {
        error: false,
        data: null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: error.message,
        message: error.message,
      };
    }
  }

  async change_playlist_name(params: {
    playlist_id: string;
    playlist_name: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const users_ref = collection(db, "users");
      const users_user_ref = doc(users_ref, params.user_id);
      const users_user_playlists_ref = collection(users_user_ref, "playlists");
      const playlist_doc = doc(users_user_playlists_ref, params.playlist_id);

      await updateDoc(playlist_doc, {
        playlist_name: params.playlist_name,
      });

      return {
        error: false,
        data: null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: error.message,
        message: error.message,
      };
    }
  }

  async fetch(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<Playlist[]>> {
    try {
      const db = getFirestore(this.firebase.getInstance());

      const playlists_ref = collection(db, "users");
      const playlists_user_ref = doc(playlists_ref, params.user_id);
      const playlists_user_playlists_ref = collection(
        playlists_user_ref,
        "playlists"
      );

      const playlists_snap = await getDocs(playlists_user_playlists_ref);

      const playlists = playlists_snap.docs.map(
        (doc) => doc.data() as Playlist
      );

      return {
        error: false,
        data: playlists,
      };
    } catch (error) {
      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: "An error occurred while fetching playlists",
      };
    }
  }

  async add_track_on_playlist(params: {
    user_id: string;
    playlist_id: string;
    track: Track;
  }): Promise<IRepositoryResponse<Playlist>> {
    try {
      const db = getFirestore(this.firebase.getInstance());

      const playlists_ref = collection(db, "users");
      const playlists_user_ref = doc(playlists_ref, params.user_id);
      const playlists_user_playlists_ref = collection(
        playlists_user_ref,
        "playlists"
      );
      const playlist_doc = doc(
        playlists_user_playlists_ref,
        params.playlist_id
      );

      const playlist_snap = await getDoc(playlist_doc);
      if (!playlist_snap.exists()) {
        return {
          error: true,
          code: "PLAYLIST_NOT_FOUND",
          message: "Playlist not found",
        };
      }

      const playlist_data = playlist_snap.data() as Playlist;
      const tracks = playlist_data.tracks || [];

      // Add new track if it doesn't exist already
      if (!tracks.find((t) => t.title_id === params.track.title_id)) {
        tracks.push(params.track);
      }

      await updateDoc(playlist_doc, {
        tracks,
      });

      return {
        error: false,
        data: {
          ...playlist_data,
          tracks,
        },
      };
    } catch (error: any) {
      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }

  async remove_track_from_playlist(params: {
    user_id: string;
    playlist_id: string;
    title_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());

      const playlists_ref = collection(db, "users");
      const playlists_user_ref = doc(playlists_ref, params.user_id);
      const playlists_user_playlists_ref = collection(
        playlists_user_ref,
        "playlists"
      );
      const playlist_doc = doc(
        playlists_user_playlists_ref,
        params.playlist_id
      );

      const playlist_snap = await getDoc(playlist_doc);
      if (!playlist_snap.exists()) {
        return {
          error: true,
          code: "PLAYLIST_NOT_FOUND",
          message: "Playlist not found",
        };
      }

      const playlist_data = playlist_snap.data() as Playlist;
      const tracks = playlist_data.tracks || [];

      // Add new track if it doesn't exist already
      const new_tracks = tracks.filter((t) => t.title_id !== params.title_id);

      await updateDoc(playlist_doc, {
        tracks: new_tracks,
      });

      return {
        error: false,
        data: null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }
}
