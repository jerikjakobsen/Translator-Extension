# Translator Extension

This project is a google chrome extension which can be used to translate videos from one language into another and displays them via subtitles.

### Implementation

The project uses the MediaStream API to get the audio stream from whatever video is playing then displays the translated subtitles that to the user via a popup. It sends the audio stream captured from the video to the backend which streams the audio data to Microsoft Azure Speech service to do the speech recognition and translation. It then streams back the subtitles to the frontend to display on the page.

### To use

1) Clone this repo.
2) Get a key from Microsoft Azure Speech Service
3) Replace the key in the .env file with your key
4) Open the extension in the chrome extensions (in developer mode)
5) Play a video and see the subtitles