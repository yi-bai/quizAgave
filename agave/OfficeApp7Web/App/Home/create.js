/// <reference path="../App.js" />

function task() {
    "use strict";
    var defaultQuestions = [
      /*{
          "type": "single",
          "description": "Who is the first president of US?",
          "choices": ["Jefferson", "Washington", "Bush", "Lincoln"],
          "answers": [false, true, false, false],
          "inputAnswer": "",
      },
      {
          "type": "multi",
          "description": "Which of the followings are metals?",
          "choices": ["Lithium", "Hydrogen", "Gold", "Helium", "Iron"],
          "answers": [true, false, true, false, true],
          "inputAnswer": "",
      },
      {
          "type": "input",
          "description": "What is the answer to the universe?",
          "choices": [],
          "answers": [],
          "inputAnswer": "42",
      },*/
      {
          "type": "single",
          "description": "Who is the first president of US?",
          "choices": ["Jefferson", "Washington", "Bush", "Lincoln"],
          "answers": [false, true, false, false],
          "inputAnswer": "",
      }
    ];
    var savedQuestions = Office.context.document.settings.get('questions');

    if (savedQuestions != null) step1controller.setQuestions(savedQuestions);
    else step1controller.setQuestions(defaultQuestions);

    step1controller.saveQuiz();
    Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, step1controller.saveQuiz); //when ActiveViewChanged save quiz locally automatically
};

var createQuizApp = angular.module('createQuizApp', []);
createQuizApp.filter('indexToCharacter', function () {
    return function (input) {
        return String.fromCharCode(input + 65);
    }
});

function step1controller($scope) {

    $scope.step = 1; //1:edit, 2:preview
    $scope.questions = [];

    $scope.showScope = function () {
        console.debug($scope.questions);
    };

    $scope.addQuestion = function () {
        $scope.questions.push({
            "type": "single",
            "description": " ",
            "choices": [" ", " ", " ", " "],
            "answers": [true, false, false, false],
            "inputAnswer": [],
        });
    }

    $scope.deleteQuestion = function (index) {
        $scope.questions.splice(index, 1);
        console.debug($scope.questions);
    };

    $scope.setSingleCorrectAnswer = function (questionIndex, answerIndex) {
        for (i in $scope.questions[questionIndex].answers) $scope.questions[questionIndex].answers[i] = (answerIndex == i) ? true : false;
    }

    $scope.setMultiReverseAnswer = function (questionIndex, answerIndex) {
        $scope.questions[questionIndex].answers[answerIndex] = $scope.questions[questionIndex].answers[answerIndex] ? false : true;
    }

    $scope.addChoice = function (questionIndex) {
        $scope.questions[questionIndex].choices.push('');
        $scope.questions[questionIndex].answers.push(false);
    }
    $scope.deleteChoice = function (questionIndex, answerIndex) {
        $scope.questions[questionIndex].choices.splice(answerIndex, 1);
        $scope.questions[questionIndex].answers.splice(answerIndex, 1);
    }

    $scope.setQuestionType = function (questionIndex, type) {
        $scope.questions[questionIndex].type = type;
    }

    $scope.setStep = function (step) {
        $scope.step = step;
    }

    $scope.saveQuiz = function () {
        Office.context.document.settings.set('questions', $scope.questions);
        Office.context.document.settings.set('quiz_id', 'local');
        Office.context.document.settings.saveAsync(function (asyncResult) {
            
        });
    }

    $scope.updateQuestionDescriptionBySelectedData = function (questionIndex) {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, { valueFormat: "unformatted" }, function (asyncResult) {
            $scope.questions[questionIndex].description = asyncResult.value;
            $scope.$apply();
        });
    }

    step1controller.saveQuiz = $scope.saveQuiz;

    step1controller.setQuestions = function (questions) {
        $scope.questions = questions;
        $scope.$apply();
    }
}