const question = document.querySelector(".question");
const answersContainer = document.querySelector(".answers-container");
const bullets = document.querySelector(".bullets");
let inputsRadio;
const submit = document.querySelector(".submit");
const timer = document.querySelector(".timer");
const results = document.querySelector(".results");
const tryA = document.querySelector(".try-again");

let querstionsNumber = 9;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let timerMinutes = 5;
let timerSeconds = 0;
let timerInterval;

// fetch json questions
fetch("QA.json")
  .then((res) => res.json())
  .then((res) => {
    console.log(res);

    // add first question with its answers
    addQuestion(res, currentQuestionIndex);

    // start timer
    startTimer(timerMinutes, timerSeconds);

    // make the selected input checked
    checkInput();

    // add bullets up to questionsNumber
    addBullets(querstionsNumber);

    // click event on submit
    submit.addEventListener("click", () => {
      // don't submit if they didn't choose an answer
      const chosenAnswer = document.querySelector("[checked]");
      if (chosenAnswer === null) {
        return;
      }

      // check the chosen answer if it is right
      checkAnswer(res, chosenAnswer);

      // clear the content of current question
      clearQuestion();

      // increment currentQuestionIndex
      currentQuestionIndex++;

      // if it is the last question clear interval and show the result
      if (currentQuestionIndex === querstionsNumber) {
        clearAndShow();
        tryAgain();
        return;
      }

      // add the next question
      addQuestion(res, currentQuestionIndex);

      // mark the bullet corsponding to question number
      markBullet();

      // make the selected input checked
      checkInput();
    });
  });

function addQuestion(objData, questionIndex) {
  // get current question
  const currentQ = objData[questionIndex];

  // create h2
  const h2 = document.createElement("h2");

  // append to h2 text title and a span holding question number
  h2.innerHTML = `<span class="q-num">${currentQuestionIndex + 1}-</span>
                 ${currentQ.title}`;

  // append h2 to question element
  question.append(h2);

  // create answers element with content
  for (let i = 1; i <= 4; i++) {
    // create div container for answers
    const divContainer = document.createElement("div");

    // add class answer to the div with its corsponding number
    divContainer.classList.add(`answer_${i}`);

    // create input radio
    const radio = document.createElement("input");

    // add type, name, dataset and id attributes to radio
    radio.name = "question";
    radio.id = `answer_${i}`;
    radio.type = "radio";
    radio.dataset.answer = currentQ[`answer_${i}`];

    // create label for radio input
    const label = document.createElement("label");

    // add 'for' attribute and text to label
    label.htmlFor = `answer_${i}`;
    label.textContent = currentQ[`answer_${i}`];

    // append the input and label to divContainer
    divContainer.append(radio, label);

    // append divContainer to answers element
    answersContainer.append(divContainer);
  }
}

// start timer
function startTimer(minutes, seconds) {
  timerInterval = setInterval(() => {
    if (seconds === 0) {
      minutes--;
      seconds = 60;
    }
    seconds--;

    let mints = minutes < 10 ? `0${minutes}` : minutes;
    let secnds = seconds < 10 ? `0${seconds}` : seconds;

    timer.textContent = `${mints}:${secnds}`;

    // clear interval if it is finished
    if (minutes === 0 && seconds === 0) {
      clearAndShow();
      tryAgain();
    }
  }, 1000);
}

// checked input
function checkInput() {
  // get all inputs radio
  inputsRadio = document.querySelectorAll('[type="radio"]');

  // attatch event lestener and checked the selected one
  inputsRadio.forEach((input) => {
    input.addEventListener("click", (e) => {
      // remove checked attribute fromm all and add it to the clicked one
      for (let i of inputsRadio) {
        i.removeAttribute("checked");
      }
      e.target.setAttribute("checked", "true");
    });
  });
}

// add bullets
function addBullets(num) {
  for (let i = 1; i <= num; i++) {
    // create bullet span
    const bullet = document.createElement("span");

    // add data set number to every span
    bullet.dataset.num = i;

    // mark the first bullet
    if (i === 1) {
      bullet.className = "on";
    }

    // append span to bullets element
    bullets.append(bullet);
  }
}

// mark the next bullet
function markBullet() {
  const bullet = document.querySelector(
    `[data-num="${currentQuestionIndex + 1}"]`
  );
  bullet.className = "on";
}

// check the answer if it is right
function checkAnswer(res, chosenAnswer) {
  let rightAnswer = res[currentQuestionIndex].right_answer;
  chosenAnswer = chosenAnswer.dataset.answer;

  // increment the correctAnswers if the answer is right
  if (rightAnswer === chosenAnswer) {
    correctAnswers++;
    console.log(correctAnswers);
  }
}

// clear the previous question
function clearQuestion() {
  question.innerHTML = "";
  answersContainer.innerHTML = "";
}

// clearInterval and show results
function clearAndShow() {
  clearInterval(timerInterval);
  clearQuestion();

  // tell how much good is the test
  let feedback;
  let forColor;

  if (correctAnswers === querstionsNumber) {
    feedback = "perfect";
    forColor = "green";
  } else if (correctAnswers > querstionsNumber / 2) {
    feedback = "Good";
    forColor = "blue";
  } else {
    feedback = "You Failed";
    forColor = "red";
  }

  // show results
  results.innerHTML = `You got ${correctAnswers} out of ${querstionsNumber},
                      <span class="${forColor}">${feedback}</span>`;
}

// try the quiz again
function tryAgain() {
  submit.classList.add("hide");
  tryA.classList.remove("hide");

  tryA.addEventListener("click", () => {
    location.reload();
  });
}
