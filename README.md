# Nunnu bot

메신저봇R로 돌아가는 카카오톡 봇입니다.  
이 봇은 Typescript로 쓰여졌으며. 특별히 [@thoratica](https://github.com/thoratica) 에게 감사를 전합니다.

# features

이 봇은 주로 간단한 기능들로 구현될 에정입니다.

## non bot feature (at coding)

-   [x] 타입스크립트
-   [x] 모듈 설치

### 모듈 설치?

-   npm run push시 폰에는 nunnu-module만 올라갑니다.
-   레포지토리에도 nunnu-module만 올라갑니다.
-   코딩시에는 모든 모듈을 다운받아서 합니다. (for 자동완성과 tsc)
-   require 함수를 재정의하여, 실시간 다운로드 후 require됩니다. (참고: [after_build.js](./after_build.js) [moduleInfo.json](./src/modules/moduleInfo.json) [module-checker.ts](./src/modules/nunnu-module/module-checker.ts))

## to-do features

-   [x] HTTP Client Wrapper 구현 (EASY USING)
-   [ ] TCP Client Wrapper 구현 (EASY USING) - 보류: 쓸데가 없음
-   [ ] 봇 매니저 구현 (커맨드 execution, database, etc..)

### todo just reply

-   [ ] 날씨 정보 제공
-   [ ] 학습 구현

### todo mini games

-   [ ] 미니게임 매니저 구현
-   [ ] 1:1 채팅 시스템 구현
-   [ ] 뱅 구현 (FINALLY)

# how-to-build-and-run?

1. 이 레포지토리를 clone하고 adb로 디바이스를 연결해줍니다.
2. 메신저봇R 어플을 열어 Bot 이라는 이름의 봇을 하나 만들어줍니다. (이미 있다면 코드를 백업해주세요!)
3. npm install과 npm run push를 해주면 adb를 통해 Bot 이라는 이름의 봇에 코드가 쓰여집니다!
4. 이제 Bot 을 실행해보세요!

# license

이 봇은 라이센스 "GPL-v3" 으로 제공됩니다. 정확한 사항은 LICENSE 파일을 읽어보세요.

# 레퍼런스 & used module

-   @thoratica - https://cafe.naver.com/nameyee/38950
-   @Darktornado - https://cafe.naver.com/nameyee/39192
-   @naijun0403 (kakaolink module) - https://github.com/naijun0403/kakaolink
