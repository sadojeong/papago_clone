// Node.js, Express 패키지를 활용한 간단한 서버 구성
const express = require('express'); // Like import pandas as pd
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const httpRequest = require('request');

app.use(express.static('public'));
app.use(express.json());

// 브라우저 URL에 http:127.0.0.1:3000'/' 경로로 요청 시 동작하는 메서드
app.get('/', (request, response) => response.sendFile('index.html'));

// http://localhost:3000'/detect'로 요청했을 때 
app.post('/detect', (request, response) => {

    // papago에게 데이터 전달
    const url = 'https://openapi.naver.com/v1/papago/detectLangs';

    // 실제 요청 전송
    httpRequest.post(optionsFrom(url, request.body), (error, httpResponse, body) => {
        if (!error && response.statusCode === 200) {
            // 응답 데이터를 app_v2.js로 반환
            response.send(body);
        } else {
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });
});

// 번역 요청
app.post('/translate', (request, response) => {
    const url = 'https://openapi.naver.com/v1/papago/n2mt';

    httpRequest.post(optionsFrom(url, request.body), (error, httpResponse, body) => {
        if (!error && response.statusCode === 200) {
            response.send(body);
        } else {
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });
});

const port = 3000;
app.listen(port, () => console.log(`http://127.0.0.1:${port}/ app listening on port ${port}`));

// 서버 실행 명령어 : node 실행할 파일명(server.js)

// 유틸 메서드
const optionsFrom = (url, form, headers) => {
    return {
        url,
        form,
        headers: {
            'Content-Type': 'application/json',
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
            ...headers,
        }
    };
};