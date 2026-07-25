import { CatalogJson, SerializedTrack } from "../../src/types/catalog.type";
import { Track } from "../../src/types/track.type";
import {
  buildCatalog,
  deserializeTrack,
  rebuildCatalogPlaylists,
  serializeTrack,
} from "./build-catalog";

export function parseCatalogJson(content: string): CatalogJson {
  return JSON.parse(content) as CatalogJson;
}

export function getTrackKey(track: Pick<Track, "title_id" | "playlist_id">): string {
  return `${track.title_id}::${track.playlist_id}`;
}

export function mergeTrackLists(
  baseTracks: Track[],
  incomingTracks: Track[]
): Track[] {
  const merged = new Map<string, Track>();

  for (const track of baseTracks) {
    merged.set(getTrackKey(track), track);
  }

  for (const track of incomingTracks) {
    merged.set(getTrackKey(track), track);
  }

  return [...merged.values()];
}

export function mergeCatalogs(params: {
  remote?: CatalogJson | null;
  incoming: CatalogJson;
}): CatalogJson {
  const remoteTracks = (params.remote?.tracks ?? []).map(deserializeTrack);
  const incomingTracks = params.incoming.tracks.map(deserializeTrack);
  const mergedTracks = mergeTrackLists(remoteTracks, incomingTracks);

  const nextVersion = Math.max(params.remote?.version ?? 0, params.incoming.version) + 1;

  return rebuildCatalogPlaylists({
    version: nextVersion,
    updated_at: new Date().toISOString(),
    tracks: mergedTracks.map(serializeTrack),
    playlists: params.incoming.playlists,
  });
}

export function buildCatalogFromTypescript(): CatalogJson {
  return buildCatalog();
}

export function getCatalogStats(catalog: CatalogJson) {
  return {
    version: catalog.version,
    track_count: catalog.tracks.length,
    playlist_count: catalog.playlists.official.length,
    updated_at: catalog.updated_at,
  };
}

export function assertSafeToUpload(params: {
  local: CatalogJson;
  remote: CatalogJson | null;
  force: boolean;
}) {
  if (!params.remote) {
    return;
  }

  const remoteStats = getCatalogStats(params.remote);
  const localStats = getCatalogStats(params.local);

  if (params.force) {
    console.warn(
      `[force] Overwriting remote catalog v${remoteStats.version} (${remoteStats.track_count} tracks) with local v${localStats.version} (${localStats.track_count} tracks)`
    );
    return;
  }

  if (localStats.version < remoteStats.version) {
    throw new Error(
      [
        "Refusing to upload: local catalog is older than remote.",
        `Remote: v${remoteStats.version} (${remoteStats.track_count} tracks, ${remoteStats.updated_at})`,
        `Local:  v${localStats.version} (${localStats.track_count} tracks, ${localStats.updated_at})`,
        "Run `yarn catalog:pull` to sync local from R2, or use `yarn catalog:add-track --remote`.",
        "Use `yarn catalog:sync --force` only if you really want to overwrite remote.",
      ].join("\n")
    );
  }

  if (localStats.track_count < remoteStats.track_count) {
    throw new Error(
      [
        "Refusing to upload: local catalog has fewer tracks than remote.",
        `Remote: ${remoteStats.track_count} tracks (v${remoteStats.version})`,
        `Local:  ${localStats.track_count} tracks (v${localStats.version})`,
        "This usually means `catalog:export` regenerated a stale local file.",
        "Run `yarn catalog:pull` first, or use `yarn catalog:sync --force` to override.",
      ].join("\n")
    );
  }
}
