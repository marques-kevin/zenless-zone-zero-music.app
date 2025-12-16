FROM debian:stable-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      python3 \
      ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp standalone binary (avoid pip/PEP 668 issues)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /work

ENTRYPOINT [ "yt-dlp" ]


