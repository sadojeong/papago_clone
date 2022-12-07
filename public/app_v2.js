const [sourceSelect, targetSelect] = document.getElementsByClassName("form-select");
const [sourceTextArea, targetTextArea] = document.querySelectorAll("textarea");
const switchBtn = document.getElementById("switch")
const [sourceCopy, targetCopy] = document.getElementsByClassName("text-copy")

let targetLanguage = "en";

targetSelect.addEventListener("change", () => {
    targetLanguage = targetSelect.value;
});

switchBtn.addEventListener("click", () => {
    const sourceLangValue = sourceSelect.value
    const targetLangValue = targetSelect.value
    const sourceTextValue = sourceTextArea.value
    const targetTextValue = targetTextArea.value

    sourceSelect.value = targetLangValue
    targetSelect.value = sourceLangValue
    sourceTextArea.value = targetTextValue
    targetTextArea.value = sourceTextValue
})

sourceCopy.addEventListener("click", () => {
    sourceTextArea.select();
    // event.target.select();
    document.execCommand('copy');
    alert("클립보드에 복사되었습니다.")
})

targetCopy.addEventListener("click", () => {
    targetTextArea.select();
    // event.target.select();
    document.execCommand('copy');
    alert("클립보드에 복사되었습니다.")
})

const translateFunc = () => {
    const text = sourceTextArea.value; // 번역할 텍스트
    if (!text) {
        targetTextArea.value = ""
        return
    };

    const url = "/detect";

    const requestData = {
        query: text
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    };

    // 언어 감지 요청
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            const sourceLanguage = data.langCode;

            sourceSelect.value = sourceLanguage;

            if (sourceLanguage === targetLanguage) {
                if (sourceLanguage === "ko") {
                    targetLanguage = "en";
                } else {
                    targetLanguage = "ko";
                }
            }

            const url = "/translate";

            const requestData = {
                source: sourceLanguage,
                target: targetLanguage,
                text: text,
            };

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData),
            };

            fetch(url, options)
                .then(response => response.json())
                .then(data => data.message.result.translatedText)
                .then(text => {
                    targetTextArea.value = text
                });
        });
}

let debouncer;

sourceTextArea.addEventListener("input", (event) => {
    if (debouncer) {
        clearTimeout(debouncer);
    }

    debouncer = setTimeout(() => translateFunc(), 500);
});

targetSelect.addEventListener("change", () => translateFunc())