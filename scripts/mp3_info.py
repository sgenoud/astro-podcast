import sys
import os
from mutagen.mp3 import MP3

def format_duration(seconds: int) -> str:
    """Convert seconds to HH:MM:SS format."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python get_audio_info.py <path_to_mp3>")
        sys.exit(1)

    file_path = sys.argv[1]

    if not os.path.exists(file_path):
        print(f"Error: file not found — {file_path}")
        sys.exit(1)

    # File size in bytes
    file_size = os.path.getsize(file_path)

    # Audio duration
    audio = MP3(file_path)
    duration_seconds = int(audio.info.length)
    duration_formatted = format_duration(duration_seconds)

    # Print results
    print("File:", file_path)
    print("File size (bytes):", file_size)
    print("Duration (seconds):", duration_seconds)
    print("Duration (HH:MM:SS):", duration_formatted)

if __name__ == "__main__":
    main()
