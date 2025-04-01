import { LocalstorageServiceWindow } from "@/services/localstorage.service.window";
import { IAnalyticsService } from "./IAnalyticsService";
import { IAuthRepository } from "./IAuthRepository";
import { IPlaylistsRepository } from "./IPlaylistsRepository";
import { ILikesRepository } from "./ILikesRepository";

export type Modules = {
  AuthRepository: IAuthRepository;
  PlaylistsRepository: IPlaylistsRepository;
  AnalyticsService: IAnalyticsService;
  LocalstorageService: LocalstorageServiceWindow;
  LikesRepository: ILikesRepository;
};

export interface IModule {
  build(): Modules;
}
