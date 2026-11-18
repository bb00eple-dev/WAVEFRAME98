# WAVEFRAME 98 PWA FIX6

이번 버전은 아이콘 경로 문제를 피하기 위해 필수 PWA 아이콘을 `icons/` 하위 폴더가 아니라 `index.html`과 같은 저장소 최상위에 둡니다.

## GitHub에 업로드할 파일
기존 저장소 최상위에 다음 파일을 그대로 덮어쓰기/추가하세요.
- `index.html` (덮어쓰기)
- `manifest.webmanifest` (덮어쓰기)
- `service-worker-fix6.js` (새 파일 추가)
- `icon-192.png` (최상위에 새로 추가)
- `icon-512.png` (최상위에 새로 추가)

`icons/` 폴더는 더 이상 PWA 설치 아이콘 용도로 참조하지 않습니다. 기존 폴더를 삭제할 필요는 없습니다.
기존 `service-worker-fix5.js`와 `service-worker.js`도 삭제하지 않아도 됩니다.

GitHub Pages 배포가 끝난 뒤 사이트를 새로고침하고 앱 내부 설치 진단을 실행하세요. 이번 진단은 `/WAVEFRAME98/icon-512.png` 같은 저장소 최상위 아이콘 경로를 검사합니다.
