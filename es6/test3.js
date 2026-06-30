//module 시스템에서 사용할 수 있는 형태로 라이브러리를 제작
//(규칙) 불러올 때는 import,  내보낼 항목은 export를 써야한다
//-> ESM (Ecma Script Modules) 방식

const a = 10;
const b = "hi";
const c = 1.234;

//a와 b만 내보내기 설정
export {a, b};