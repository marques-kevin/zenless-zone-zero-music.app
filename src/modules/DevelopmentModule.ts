import { LikesRepositoryFirebase } from "@/repositories/likes.repository.firebase";
import { LadderRepositoryFirebase } from "@/repositories/ladder.repository.firebase";
import { IModule } from "../interfaces/IModule";
import { AuthRepositoryFirebase } from "@/repositories/auth.repository.firebase";
import { PlaylistsRepositoryFirebase } from "@/repositories/playlists.repository.firebase";
import { FirebaseService } from "@/services/firebase.service";
import { AnalyticsServiceUmami } from "@/services/analytics.service.umami";
import { LocalstorageServiceWindow } from "@/services/localstorage.service.window";

export class DevelopmentModule implements IModule {
  build() {
    const firebase = new FirebaseService();
    const AuthRepository = new AuthRepositoryFirebase(firebase);
    const PlaylistsRepository = new PlaylistsRepositoryFirebase(firebase);

    const AnalyticsService = new AnalyticsServiceUmami();
    const LocalstorageService = new LocalstorageServiceWindow();
    const LikesRepository = new LikesRepositoryFirebase(firebase);
    const LadderRepository = new LadderRepositoryFirebase(firebase);

    return {
      LocalstorageService,
      AuthRepository,
      LikesRepository,
      PlaylistsRepository,
      AnalyticsService,
      LadderRepository,
    };
  }
}
