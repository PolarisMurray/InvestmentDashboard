#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_DIR="${SCRIPT_DIR:h:h}"
BUILD_DIR="${SCRIPT_DIR}/build"
APP_DIR="${BUILD_DIR}/长期资产看板.app"
CONTENTS_DIR="${APP_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"
RESOURCES_DIR="${CONTENTS_DIR}/Resources"

/bin/rm -rf "${BUILD_DIR}"
/bin/mkdir -p "${MACOS_DIR}" "${RESOURCES_DIR}"
/bin/cp "${SCRIPT_DIR}/Info.plist" "${CONTENTS_DIR}/Info.plist"
/bin/cp "${PROJECT_DIR}/资产看板.html" "${RESOURCES_DIR}/资产看板.html"

/usr/bin/xcrun clang -fobjc-arc -O2 -framework Cocoa -framework WebKit \
  -fmodules-cache-path="${BUILD_DIR}/module-cache" \
  "${SCRIPT_DIR}/main.m" -o "${MACOS_DIR}/长期资产看板"

/usr/bin/xcrun clang -fobjc-arc -O2 -framework Cocoa \
  -fmodules-cache-path="${BUILD_DIR}/module-cache" \
  "${SCRIPT_DIR}/make-icon.m" -o "${BUILD_DIR}/make-icon"
"${BUILD_DIR}/make-icon" "${BUILD_DIR}/AppIcon-1024.png"
/bin/cp "${BUILD_DIR}/AppIcon-1024.png" "${RESOURCES_DIR}/AppIcon.png"
/usr/bin/codesign --force --deep --sign - "${APP_DIR}" >/dev/null
/usr/bin/plutil -lint "${CONTENTS_DIR}/Info.plist"

print -r -- "${APP_DIR}"
