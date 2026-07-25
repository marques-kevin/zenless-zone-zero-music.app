import { CatalogJson } from "../../src/types/catalog.type";
import { rebuildCatalogPlaylists } from "./build-catalog";
import {
  downloadCatalogFromR2,
  uploadCatalogToR2,
  writeLocalCatalog,
} from "./r2";

export class CatalogNotFoundError extends Error {
  constructor() {
    super(
      "No remote catalog found on R2. Run `yarn catalog:bootstrap` once to initialize it."
    );
    this.name = "CatalogNotFoundError";
  }
}

export async function loadRemoteCatalog(): Promise<CatalogJson> {
  const content = await downloadCatalogFromR2();

  if (!content) {
    throw new CatalogNotFoundError();
  }

  return JSON.parse(content) as CatalogJson;
}

export async function saveRemoteCatalog(catalog: CatalogJson): Promise<void> {
  const content = JSON.stringify(catalog, null, 2);
  await uploadCatalogToR2(content);
  await writeLocalCatalog(content);
}

export async function mutateRemoteCatalog(
  mutator: (catalog: CatalogJson) => CatalogJson
): Promise<CatalogJson> {
  const current = await loadRemoteCatalog();
  const mutated = mutator(current);

  const nextCatalog = rebuildCatalogPlaylists({
    ...mutated,
    version: current.version + 1,
    updated_at: new Date().toISOString(),
  });

  await saveRemoteCatalog(nextCatalog);
  return nextCatalog;
}
