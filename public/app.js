// 0. <select>, <textarea> 태그 가져오기
/**
 * 도메인 용어 정의
 * source~ : 내가 번역하고 싶은 텍스트 및 언어의 타입과 관련된 용어, 원본(source) 언어
 * target~ : 번역된 결과 텍스트 및 언어의 타입과 관련된 용어, 타겟(target) 언어
 * 
 */
const xhr = new XMLHttpRequest();

const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');
const [sourceTextArea, targetTextArea] = document.querySelectorAll('textarea');

// 1. 화면에 입력한 텍스트가 콘솔에 출력될 수 있도록 이벤트 추가
sourceTextArea.addEventListener('input', (event) => {
    const text = event.target.value; // 번역할 텍스트
    console.log(sourceTextArea.value);

    const url = '/translate'; // 직접 구축한 Node.js기반의 서버 URL

    // 1. XMLHttpRequest 객체 생성

    // 2. readyState가 4번(DONE)이고 응답 코드(status)가 200이면 서버로부터 응답이 정상적으로 완료되었음을 의미
    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    }

    // 3. 요청 준비 코드 작성
    xhr.open('POST', url);

    // 3-1. 클라이언트가 서버에게 보내는 데이터 작성, 

    // 요청을 보낼 데이터(JS Object)
    const requestData = {
        text, // text: text와 같음, 프로퍼티와 변수명이 동일할 경우 하나로 써도됨
    };

    // 요청을 보낼 데이터를 JSON 형태의 포맷으로 변환
    const jsonData = JSON.stringify(requestData)

    //클라이언트가 서버에게 보내는 요청 데이터의 형식이 JSON 포맷임을 명시
    xhr.setRequestHeader('Content-Type', 'application/json')

    // 4. 클라이언트가 서버에게 요청 전송
    xhr.send(jsonData);
});

// 2. select box에서 번역할 언어를 선택할 때마다 value값이 콘솔에 출력될 수 있도록
let targetLanguage = 'en';

targetSelect.addEventListener('change', () => {
    targetLanguage = targetSelect.value;

});