#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/../.." && pwd)"

files_list="${script_dir}/files-to-download.txt"
out_dir="${script_dir}/files"
dockerfile_path="${repo_root}/scripts/ytmp3.Dockerfile"
image_name="zzz-ytmp3:latest"

require_cmd() {
	command -v "$1" >/dev/null 2>&1 || {
		echo "Error: '$1' is not installed or not in PATH." >&2
		exit 1
	}
}

print_usage() {
	cat <<EOF
YouTube to MP3 downloader (Docker-based)

Usage:
  $(basename "$0")

Behavior:
  - Reads URLs from: ${files_list}
  - Writes MP3 files to: ${out_dir}
  - Uses Docker image: ${image_name}

Notes:
  - One URL per line.
  - Lines starting with '#' or blank lines are ignored.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
	print_usage
	exit 0
fi

require_cmd docker

mkdir -p "${out_dir}"

if [[ ! -f "${files_list}" ]]; then
	echo "Error: URL file not found: ${files_list}" >&2
	echo "Create it and add one URL per line." >&2
	exit 1
fi

# Count valid URLs (non-empty, non-comment)
num_urls=$(grep -Ev '^[[:space:]]*(#|$)' "${files_list}" | wc -l | tr -d '[:space:]')
if [[ "${num_urls}" == "0" ]]; then
	echo "Error: No URLs found in ${files_list}" >&2
	exit 1
fi

# Build image if missing
if ! docker image inspect "${image_name}" >/dev/null 2>&1; then
	if [[ ! -f "${dockerfile_path}" ]]; then
		echo "Error: Dockerfile not found at ${dockerfile_path}" >&2
		exit 1
	fi
	echo "Building Docker image '${image_name}'..."
	docker build -t "${image_name%:*}" -f "${dockerfile_path}" "${repo_root}"
fi

echo "Output directory: ${out_dir}"
echo "Total URLs: ${num_urls}"
echo

success_count=0
fail_count=0

while IFS= read -r line; do
	# Skip empty lines and comments
	[[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
	url="$line"

	echo "Downloading: ${url}"
	if docker run --rm \
		-v "${out_dir}:/out" \
		"${image_name%:*}" \
		--no-progress \
		--ignore-errors \
		--continue \
		--no-playlist \
		--restrict-filenames \
		-x --audio-format mp3 --audio-quality 0 \
		--add-metadata \
		-o "/out/%(title)s.%(ext)s" \
		"${url}"; then
		((success_count++))
		echo "✓ Done"
	else
		((fail_count++))
		echo "✗ Failed: ${url}" >&2
	fi
	echo
done < "${files_list}"

echo "Completed. Success: ${success_count}, Failed: ${fail_count}"


