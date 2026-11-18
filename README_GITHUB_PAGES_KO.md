# WAVEFRAME 98 GitHub Pages PWA FIX2

기존 V5.1 Pixel 편집기를 유지한 설치 진단 보완판입니다.

기존 GitHub 저장소 최상위에 `index.html`, `manifest.webmanifest`, `service-worker.js`, `icons/`, `screenshots/`를 모두 덮어써 주세요. 일부 파일만 교체하면 이전 서비스 워커/매니페스트가 남을 수 있습니다.

Settings → Pages → Deploy from a branch → `main` / `/(root)` 설정 후 HTTPS 주소를 Android Chrome으로 여세요. 새로고침한 뒤 앱 내부 `앱 설치` 버튼을 누르면 HTTPS, 매니페스트/아이콘, 서비스 워커 상태를 진단합니다.

설치 성공은 실제 배포 주소와 Android Chrome에서 최종 확인해야 합니다.
