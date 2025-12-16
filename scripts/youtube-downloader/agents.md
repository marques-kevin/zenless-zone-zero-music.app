# Musics and files managements

In the directory @/musics, we store all musics that will be listen in the application.

The filename should begin by the zenless zone zero version, for example, 2.4 followed by the title in kebab-case.

For example:
Where Winds Meet (Battle Theme).mp3 -> 2.4--where-winds-meet--battle-theme.mp3

## Where the application get the metadata from tracks ?

The file src/database/tracks.ts list all tracks available in the app.
Each track should belongs to one or more albums.

For example, 2.4 musics are in the 2.4 albums. If a music belongs to a character too, it should belongs to the two albums, the 2.4 and the character album.

The file @src/database/albums.ts list all albums available.

The @src/database/artists.ts file like all artists. Before, real artists was listed but now, a ZZZ version is an artist.
