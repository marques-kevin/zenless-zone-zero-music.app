import { LocalstorageServiceWindow } from "@/services/localstorage.service.window";
import { IAnalyticsService } from "./IAnalyticsService";
import { IAuthRepository } from "./IAuthRepository";
import { IPlaylistsRepository } from "./IPlaylistsRepository";
import { ILikesRepository } from "./ILikesRepository";
import { ILadderRepository } from "./ILadderRepository";
import { IAskMusicsRepository } from "./IAskMusicsRepository";

export type Modules = {
  AuthRepository: IAuthRepository;
  PlaylistsRepository: IPlaylistsRepository;
  AnalyticsService: IAnalyticsService;
  LocalstorageService: LocalstorageServiceWindow;
  LikesRepository: ILikesRepository;
  LadderRepository: ILadderRepository;
  AskMusicsRepository: IAskMusicsRepository;
};

export interface IModule {
  build(): Modules;
}
