# WAVEFRAME 98 · GitHub PWA FIX3

- 실패 진단된 별도 maskable 아이콘 경로를 manifest에서 제거했습니다.
- 필수 일반 아이콘 192x192 및 512x512만 선언합니다.
- 기존 편집기와 픽셀 UI는 유지합니다.

기존 저장소 최상위에서 manifest.webmanifest, index.html, service-worker.js, icons/를 덮어쓰세요. Pages 배포 후 Android Chrome에서 새로고침하고 설치를 확인하세요. 실제 기기 설치 성공은 Chrome에서 확인해야 합니다.
