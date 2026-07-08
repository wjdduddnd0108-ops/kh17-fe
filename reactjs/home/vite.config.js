import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//주요 경로에 대한 별칭(alias) 설정
//- 절대경로란 개념이 존재하지 않기 때문에 특정 위치를 쉽게 부를 수 있도록 별칭을 부여
//- node.js에 있는 파일 시스템과 별칭을 연결해서 설정으로 작성해두어야 한다
//- (ex) 내가 만약 `@src` 라고 하면 `src` 폴더를 말하는걸로 생각해라!
//- (ex) 내가 만약 `@components` 라고 하면 `src/components` 폴더를 말하는걸로 생각해라!
import { fileURLToPath, URL } from "node:url";
const path = (value)=>fileURLToPath(new URL(value, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias:{
      "@src": path("./src"),
      "@assets": path("./src/assets"),
      "@components": path("./src/components"),
      "@templates": path("./src/templates"),
      "@error": path("./src/error")
    }
  }
})
