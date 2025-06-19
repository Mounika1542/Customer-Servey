const questions = [
  "How satisfied are you with our products?",
  "How fair are the prices compared to similar retailers?",
  "How satisfied are you with the value for money of your purchase?",
  "On a scale of 1–5, how likely are you to recommend us?",
  "What can we improve? (Text)"
];

const responses = [];
let currentQuestion = 0;

const welcomeScreen = document.getElementById("welcome-screen");
const surveyContainer = document.getElementById("survey-container");
const questionText = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const progressText = document.getElementById("progress");

document.getElementById("startBtn").onclick = () => {
  welcomeScreen.style.display = "none";
  surveyContainer.style.display = "block";
  loadQuestion();
};

document.getElementById("prevBtn").onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
};

document.getElementById("nextBtn").onclick = () => {
  // ✅ Save text input on final question
  if (currentQuestion === 4) {
    const textInput = document.querySelector("textarea");
    responses[currentQuestion] = textInput.value;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    //  Submit to server
    fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(responses.map((ans, i) => [`q${i + 1}`, ans]))
    })
      .then(res => res.text())
      .then(html => {
        document.body.innerHTML = html;
      })
      .catch(err => {
        alert("Submission failed. Please try again.");
        console.error(err);
      });
  }
};

function loadQuestion() {
  questionText.innerText = questions[currentQuestion];
  progressText.innerText = `${currentQuestion + 1}/5`;
  optionsDiv.innerHTML = "";

  if (currentQuestion === 4) {
    const input = document.createElement("textarea");
    input.rows = 4;
    input.cols = 30;
    input.value = responses[currentQuestion] || "";
    input.oninput = (e) => (responses[currentQuestion] = e.target.value);
    optionsDiv.appendChild(input);
  } else {
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className = "rating-button";
      if (responses[currentQuestion] == i) btn.classList.add("selected");
      btn.onclick = () => {
        responses[currentQuestion] = i;
        loadQuestion(); // Reload to show selection
      };
      optionsDiv.appendChild(btn);
    }
  }
}
