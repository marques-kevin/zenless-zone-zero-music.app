# Musics and files managements

In the directory @/musics, we store all musics that will be listen in the application.

The filename should begin by the zenless zone zero version, for example, 2.4 followed by the title in kebab-case.

For example:
Where Winds Meet (Battle Theme).mp3 -> 2.4--where-winds-meet--battle-theme.mp3

## Downloading Music from YouTube

The project includes a Docker-based YouTube downloader for easy music acquisition.

### Prerequisites

- **Docker** must be installed and running on your system

### Usage

1. **Add YouTube URLs** to `files-to-download.txt`:

   - One URL per line
   - Lines starting with `#` or blank lines are ignored
   - Example:
     ```
     https://www.youtube.com/watch?v=example1
     https://www.youtube.com/watch?v=example2
     ```

2. **Run the downloader**:

   ```bash
   yarn mp3
   ```

3. **Process downloaded files**:
   - Files are downloaded to `scripts/youtube-downloader/files/`
   - Move them to `musics/` directory
   - Rename them according to the naming convention (see above)

**Note:** The script uses Docker to run yt-dlp in an isolated environment. The Docker image will be built automatically on first run.

## Where the application get the metadata from tracks ?

The file src/database/tracks.ts list all tracks available in the app.
Each track should belongs to one or more albums.

For example, 2.4 musics are in the 2.4 albums. If a music belongs to a character too, it should belongs to the two albums, the 2.4 and the character album.

The file @src/database/albums.ts list all albums available.

The @src/database/artists.ts file like all artists. Before, real artists was listed but now, a ZZZ version is an artist.

## How to get track duration ?

You can run @scripts/get-music-durations.sh to get the track duration.
