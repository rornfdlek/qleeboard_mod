# QLeeBoard

### 환경
Node.js 10.15 환경에서 개발, (현재 LTS버전 10.16, 상관없을듯)

DB는 mariadb, mysql, mssql 가능,

### config 파일 세팅

~~~
// ./config/config.template.json 파일에 필요정보 입력 후 config.json로 다른 이름으로 저장
~~~

### 프로젝트 구조

./ -> 백엔드 부분은 node.js의 프레임워크인 express project, app.js가 entry point

./client -> frontend 부분, vue.js, ./client/src/main.js가 entry point

### 관련 패키지 설치

~~~
// root folder
npm install // express(백엔드 부분)의 package설치 명령어, package 정보는 ./package.json 파일에 있음

cd client
npm install // vue.js(프론트 부분)의  package설치 명령어, package 정보는 ./client/package.json 파일에 있음
~~~

### 개발 화면 띄우기

~~~
// backend
// root folder에서
npm start 또는 node ./bin/www // localhost:3010에서 확인

// frontend
// client folder에서
cd clent
npm run serve // localhost:3000에서 확인
~~~

### 빌드버전 띄우기

~~~
cd client
npm run build // ./client/dist 폴더에 build 파일 생성(production)

cd ..
NODE_ENV=production node ./bin/www // localhost:3010에서 확인

// 포트 변경
NODE_ENV=production PORT=PORT번호 node ./bin/www // localhost:원하는 포트 번호에서 확인
~~~