//Axios를 백엔드 인증 구조에 맞게 분할 및 개조하여 사용할 수 있도록 처리하여 제공하는 파일
import axios from "axios";

//기본 정보 설정
const baseURL = import.meta.env.VITE_SERVER_URL;//기본 주소

//상황별로 쓰일 Axios 객체를 생성하여 내보내기
//[1] 인증용 Axios 객체 
export const authClient = axios.create({
    baseURL : `${baseURL}/service/auth`,
    timeout : 3000,
    withCredentials : true
});

//[2] 인증 메일용 Axios 객체
export const certClient = axios.create({
    baseURL : `${baseURL}/service/cert`,
    timeout : 10000,
    withCredentials : false
});

//[3] API 요청용 Axios 객체
export const  apiClient = axios.create({
    baseURL : `${baseURL}/api`,
    timeout : 5000,
    withCredentials : true
});

//(추가) [3]번 API 요청용 Axios객체의 요청이 실패한 상황 중 응답코드가 401번인 경우 갱신 요청
//- axios에는 interceptor(감시도구)라는 기능이 존재 
//- axios 공식 사이트에서 제공하는 interceptor 구문을 가져다가 수정

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    console.log("API 요청 발송 전", config);
    return config;
  },
  function (error) {
    console.log("API 요청 에러 발생", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  function (response) {
    console.log("API 응답 성공", response);
    return response;
  },
  function (error) {
    console.log("API 응답 오류", error);
    return Promise.reject(error);
  }
);
