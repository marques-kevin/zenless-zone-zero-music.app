import React, { useEffect, useRef, useState } from "react";
import {
  connector,
  ContainerProps,
} from "./container/audio-global-html-component.container";
import { AnalyticsServicePlausible } from "@/services/analytics.service.plausible";
import { getCdnUrl } from "@/utils/get-cdn-url";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (props.is_playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [props.is_playing, props.current_track]);

  useEffect(() => {
    const service = new AnalyticsServicePlausible();

    service.send({
      category: "tracks",
      action: "playing",
      data: {
        track_id: props.current_track.title_id,
      },
    });
  }, [props.current_track]);

  useEffect(() => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = props.slider_track_time;
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.slider_track_time]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: props.current_track.title,
        artist: props.current_track.artist,
        album: props.current_track.playlist_name,
        artwork: [
          {
            src: props.current_track.playlist_cover,
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        props.onPlay();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        props.onPause();
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details.seekTime) {
          if (audioRef.current) {
            audioRef.current.currentTime = details.seekTime;
          }
        }
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        props.onPrevious();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        props.onNext();
      });

      navigator.mediaSession.setActionHandler("stop", () => {
        props.onPause();
      });
    }
  }, [props.current_track?.title_id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = props.volume / 100;
    }
  }, [props.volume]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      props.onTimeUpdate({
        duration: audioRef.current.duration,
        track_time: audioRef.current.currentTime,
      });
    }
  };

  const onEnd = () => {
    if (props.replay_mode === "replay_track") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      props.onNext();
    }
  };

  return (
    <>
      <audio
        className="hidden"
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnd}
        onLoadStart={() => props.onLoading()}
        onLoadedMetadata={onTimeUpdate}
        onWaiting={() => props.onLoading()}
        src={getCdnUrl(props.current_track.source)}
        muted={props.is_muted}
      />
    </>
  );
};

export const AudioGlobalHtmlComponent = connector(Wrapper);
