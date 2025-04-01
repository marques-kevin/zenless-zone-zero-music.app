import { LikesRepositoryFirebase } from "@/repositories/likes.repository.firebase";
import { IModule } from "../interfaces/IModule";
import { AuthRepositoryFirebase } from "@/repositories/auth.repository.firebase";
import { PlaylistsRepositoryFirebase } from "@/repositories/playlists.repository.firebase";
import { FirebaseService } from "@/services/firebase.service";
import { AnalyticsServicePlausible } from "@/services/analytics.service.plausible";
import { LocalstorageServiceWindow } from "@/services/localstorage.service.window";

export class TestModule implements IModule {
  build() {
    const firebase = new FirebaseService();
    const AuthRepository = new AuthRepositoryFirebase(firebase);
    const PlaylistsRepository = new PlaylistsRepositoryFirebase(firebase);
    const AnalyticsService = new AnalyticsServicePlausible();
    const LocalstorageService = new LocalstorageServiceWindow();
    const LikesRepository = new LikesRepositoryFirebase(firebase);

    return {
      LocalstorageService,
      AuthRepository,
      PlaylistsRepository,
      AnalyticsService,
      LikesRepository,
    };
  }
}
