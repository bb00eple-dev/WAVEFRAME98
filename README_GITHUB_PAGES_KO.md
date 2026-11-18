# WAVEFRAME 98 · GitHub PWA FIX4

FIX4는 이전 버전의 서비스 워커가 오래된 manifest/index를 캐시에서 반환할 수 있는 문제를 수정합니다.

## 반드시 교체할 파일
- `index.html`
- `manifest.webmanifest`
- `service-worker.js`

`icons/` 폴더는 기존 것을 유지합니다.

## 적용 후
1. GitHub Pages 배포 완료 대기
2. Android Chrome에서 해당 사이트 열기
3. 새로고침
4. 앱 설치 버튼을 눌러 진단 확인

FIX4 진단창은 실제 manifest URL도 표시합니다. 실제 설치 가능 여부는 배포 후 Chrome에서 최종 확인해야 합니다.
