#!/bin/bash

# Script to get durations of music files
# Usage: ./scripts/get-music-durations.sh [pattern1] [pattern2] ...
# 
# Examples:
#   ./scripts/get-music-durations.sh                           # Get all mp3 files
#   ./scripts/get-music-durations.sh "2.3--*.mp3"             # Get all 2.3 files
#   ./scripts/get-music-durations.sh "2.2--*.mp3"             # Get all 2.2 files
#   ./scripts/get-music-durations.sh "2.3--damdami.mp3"       # Get specific file
#   ./scripts/get-music-durations.sh "2.3--*.mp3" "1.7--*.mp3" # Get multiple patterns

# If no patterns provided, get all mp3 files
if [ $# -eq 0 ]; then
    PATTERNS=("*.mp3")
else
    PATTERNS=("$@")
fi

echo "Getting durations for music files..."
echo "Patterns: ${PATTERNS[*]}"
echo ""

# Check if ffprobe is available
if ! command -v ffprobe &> /dev/null; then
    echo "Error: ffprobe is not installed or not in PATH"
    echo "Please install ffmpeg to use this script"
    exit 1
fi

# Process each pattern
for pattern in "${PATTERNS[@]}"; do
    echo "Processing pattern: $pattern"
    
    # Expand pattern in musics folder
    files=( musics/$pattern )
    
    if [ ${#files[@]} -eq 0 ] || [ ! -f "${files[0]}" ]; then
        echo "No files found matching pattern: $pattern"
        echo ""
        continue
    fi
    
    # Process each file matching the pattern
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "=== $file ==="
            duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$file" 2>/dev/null)
            if [ $? -eq 0 ] && [ -n "$duration" ]; then
                echo "$duration"
            else
                echo "Error getting duration"
            fi
        fi
    done
    echo ""
done

echo "Duration extraction complete!"
