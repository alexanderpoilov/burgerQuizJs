"use strict";

document.addEventListener("DOMContentLoaded", function () {

  const btnOpenModel = document.querySelector("#btnOpenModal"),
    modalBlock = document.querySelector("#modalBlock"),
    btnCloseModal = document.querySelector("#closeModal"),
    questionTitle = document.querySelector("#question"),
    formAnswers = document.querySelector("#formAnswers"),
    prevButton = document.querySelector("#prev"),
    nextButton = document.querySelector("#next"),
    sendButton = document.querySelector("#send");

    // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDXH5rPD8DqUOgshDS_15W3HmQBdw3b5d8",
    authDomain: "test-burgerquiz.firebaseapp.com",
    databaseURL: "https://test-burgerquiz.firebaseio.com",
    projectId: "test-burgerquiz",
    storageBucket: "test-burgerquiz.appspot.com",
    messagingSenderId: "1016078276445",
    appId: "1:1016078276445:web:979f474ef41843e3637ab4",
    measurementId: "G-MS16TRB2T0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Функция получения данных 
  const getData = () => {
    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');
    formAnswers.textContent = 'LOAD';
    setTimeout(() => {
      firebase.database().ref().child('questions').once('value')
        .then(snap => playTest(snap.val()))
      }, 500)
  }
  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.add("d-block");
    getData();
  });

  btnCloseModal.addEventListener("click", () => {
    modalBlock.classList.remove("d-block");
  });

  const playTest = (questions) => {
    const finalAnswers = [];
    let numberQuestion = 0;
    numberQuestion = 0;
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement("div");
        answerItem.classList.add(
          "answers-item",
          "d-flex",
          "justify-content-center"
        );
        answerItem.innerHTML = `                    
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value = "${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src=${answer.url} alt="burger">
                    <span>${answer.title}</span>
                    </label>
                `;
        formAnswers.appendChild(answerItem);
      });
    };

    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = ``;
      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);
        nextButton.classList.remove("d-none");
        prevButton.classList.remove("d-none");
        sendButton.classList.add("d-none");
        console.log(numberQuestion, 'more zero');
      };
      if (numberQuestion === questions.length) {
        console.log(numberQuestion, 'equial');
        questionTitle.textContent = "We calling you";
        prevButton.classList.add("d-none");
        nextButton.classList.add("d-none");
        sendButton.classList.remove("d-none");
        formAnswers.innerHTML = `
          <div class = "form-group">
              <label for="numberPhone">Enter your number</label>
              <input type="phone" class="form-control" id="numberPhone">
          </div>
          `;
      };
      if (numberQuestion === questions.length + 1) {
        questionTitle.textContent = "Thanks";
        formAnswers.textContent = "Cпасибо за пройденый тест";
        sendButton.classList.add("d-none");
        console.log(numberQuestion, 'the end');
        setTimeout(() => {
          modalBlock.classList.remove("d-block");
        }, 2000);
      };
      if (numberQuestion === 0) {
        prevButton.classList.add("d-none");
        console.log(numberQuestion, 'start');
      }
    };

    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const obj = {};
      const inputs = [...formAnswers.elements].filter(
        (input) => input.checked || input.id === "numberPhone"
      );

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }
        if (numberQuestion === questions.length) {
          obj["Номер телефона"] = input.value;
        }
      });
      finalAnswers.push(obj);
    };
    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };
    sendButton.onclick = () => {
      firebase.database().ref().child('contacts').push(finalAnswers);
      numberQuestion++;
      renderQuestions(numberQuestion);
      checkAnswer();
    };
  };
});
