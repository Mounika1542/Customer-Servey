const questions = [
    "How satisfied are you with our products?",
    "How fair are the prices compared to similar retailers?",
    "How satisfied are you with the value for money of your purchase?",
    "On a scale of 1–5, how likely are you to recommend us?",
    "What can we improve? (Text)"
];

const responses = {}; // Store user answers keyed by question index
let currentQuestion = 0;

// Get DOM elements
const welcomeScreen = document.getElementById("welcome-screen");
const surveyContainer = document.getElementById("survey-container");
const questionText = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const progressText = document.getElementById("progress");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Start Survey
document.getElementById("startBtn").onclick = () => {
    welcomeScreen.style.display = "none";
    surveyContainer.style.display = "block";
    loadQuestion();
};

// Previous Question
prevBtn.onclick = () => {
    saveCurrentResponse();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
};

// Next or Submit
nextBtn.onclick = () => {
    saveCurrentResponse();

    if (currentQuestion < questions.length - 1 && responses[currentQuestion] === undefined) {
        alert("Please select an option before proceeding.");
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        // Submit responses
        console.log("Submitting survey responses:", responses);

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
            alert("Submission failed. Please try again.");
            console.error("Submission error:", err);
        });
    }
};

// Save current response
function saveCurrentResponse() {
    if (currentQuestion === questions.length - 1) {
        const textInput = optionsDiv.querySelector("textarea");
        if (textInput) {
            responses[currentQuestion] = textInput.value.trim();
        }
    }
}

// Load question and options
function loadQuestion() {
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
