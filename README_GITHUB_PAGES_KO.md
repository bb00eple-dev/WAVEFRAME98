# WAVEFRAME 98 PWA FIX5

FIX5는 브라우저 사이트 데이터 삭제를 요구하지 않는 업데이트 경로를 사용합니다.

## 변경 사항
- manifest URL에 `?v=fix5`를 붙여 새 요청 주소 사용
- 서비스 워커 파일명을 `service-worker-fix5.js`로 변경해 새 워커 설치 유도
- 새 캐시 이름 `waveframe98-fix5-shell`
- 새 워커 활성화 시 기존 `waveframe98-*` 캐시 자동 정리
- 진단창에 실제 manifest URL과 현재 service worker 제어 여부 표시

## GitHub 업데이트
저장소 최상위에 다음 파일을 덮어쓰거나 추가하세요.
- `index.html` (덮어쓰기)
- `service-worker-fix5.js` (새 파일 추가)
- `manifest.webmanifest` (FIX5 패키지 버전으로 덮어쓰기)
- `icons/` (기존 유지 가능)

기존 `service-worker.js`는 삭제하지 않아도 됩니다. 새 파일명이므로 Chrome이 새 워커 스크립트를 요청합니다.

## 적용
GitHub Pages 배포 완료 후 Chrome에서 사이트를 새로고침하고 앱 설치 버튼을 눌러 진단을 확인하세요. 사이트 데이터/저장공간 삭제는 필요하지 않습니다.

참고: 실제 설치창 활성화는 Chrome이 PWA 조건을 충족한다고 판단해야 하며, 이 환경에서 Android Chrome 설치를 직접 검증할 수는 없습니다.
