const questions = [
    "How satisfied are you with our products?",
    "How fair are the prices compared to similar retailers?",
    "How satisfied are you with the value for money of your purchase?",
    "On a scale of 1–5, how likely are you to recommend us?",
    "What can we improve? (Text)"
];

const responses = {};
let currentQuestion = 0;

// DOM Elements
const welcomeScreen = document.getElementById("welcome-screen");
const surveyContainer = document.getElementById("survey-container");
const questionText = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const progressText = document.getElementById("progress");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const messageBox = document.getElementById("message");

// Start Survey
document.getElementById("startBtn").onclick = () => {
    welcomeScreen.style.display = "none";
    surveyContainer.style.display = "block";
    loadQuestion();
};

// Previous button
prevBtn.onclick = (e) => {
    e.preventDefault();
    saveCurrentResponse();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
};

// Next/Submit button
nextBtn.onclick = (e) => {
    e.preventDefault();
    saveCurrentResponse();

    if (currentQuestion < questions.length - 1 && responses[currentQuestion] === undefined) {
        showMessage("Please select an option before proceeding.", "error");
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        // Submit
        const formData = new URLSearchParams();
        questions.forEach((q, i) => {
            formData.append(`q${i + 1}`, responses[i] ?? '');
        });

        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, Message: ${text}`);
                });
            }
            return res.text();
        })
        .then(html => {
            document.body.innerHTML = html;
        })
        .catch(err => {
            showMessage("Submission failed. Please try again.", "error");
            console.error("Submission error:", err);
        });
    }
};

// Save current input
function saveCurrentResponse() {
    if (currentQuestion === questions.length - 1) {
        const textInput = optionsDiv.querySelector("textarea");
        if (textInput) {
            responses[currentQuestion] = textInput.value.trim();
        }
    }
}

// Load a question
function loadQuestion() {
    clearMessage();

    questionText.innerText = questions[currentQuestion];
    progressText.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
    optionsDiv.innerHTML = "";

    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
    nextBtn.innerText = currentQuestion === questions.length - 1 ? "Submit" : "Next";

    if (currentQuestion === questions.length - 1) {
        const textarea = document.createElement("textarea");
        textarea.rows = 6;
        textarea.cols = 40;
        textarea.placeholder = "Type your suggestions or comments here...";
        textarea.value = responses[currentQuestion] || "";
        textarea.oninput = (e) => {
            responses[currentQuestion] = e.target.value;
        };
        optionsDiv.appendChild(textarea);
    } else {
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.className = "rating-button";
            if (responses[currentQuestion] == i) {
                btn.classList.add("selected");
            }
            btn.onclick = () => {
                const allButtons = optionsDiv.querySelectorAll(".rating-button");
                allButtons.forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                responses[currentQuestion] = i;
            };
            optionsDiv.appendChild(btn);
        }
    }
}

// Show in-page message
function showMessage(text, type) {
    if (!messageBox) return;
    messageBox.innerText = text;
    messageBox.style.color = type === "error" ? "red" : "green";
    messageBox.style.display = "block";
}

// Clear message
function clearMessage() {
    if (messageBox) {
        messageBox.innerText = "";
        messageBox.style.display = "none";
    }
}
