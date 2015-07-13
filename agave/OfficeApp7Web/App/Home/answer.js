function task() {
    var savedQuestions = Office.context.document.settings.get('questions');
    var answeredQuestions = [];
    jQuery.extend(true, answeredQuestions, savedQuestions);
    for (var i in answeredQuestions) {
        answeredQuestions[i].responseAnswers = [];
        for (var j in answeredQuestions[i].answers) {
            answeredQuestions[i].responseAnswers.push(false);
        }
        answeredQuestions[i].responseInputAnswer = '';
        answeredQuestions[i].isCorrect = false;
    }

    step1controller.setQuestions(answeredQuestions);
};

var createQuizApp = angular.module('createQuizApp', []);
createQuizApp.filter('indexToCharacter', function () {
    return function (input) {
        return String.fromCharCode(input + 65);
    }
});

function step1controller($scope) {

    $scope.step = 1; //1:answer, 2:preview
    $scope.questions = [];

    $scope.setSingleResponseAnswer = function (questionIndex, answerIndex) {
        for (var i in $scope.questions[questionIndex].responseAnswers) $scope.questions[questionIndex].responseAnswers[i] = (answerIndex == i) ? true : false;
    }

    $scope.setMultiResponseAnswer = function (questionIndex, answerIndex) {
        $scope.questions[questionIndex].responseAnswers[answerIndex] = $scope.questions[questionIndex].responseAnswers[answerIndex] ? false : true;
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

    $scope.viewAnswer = function () {
        for (var i in $scope.questions) {
            if ($scope.questions[i].type == 'single' || $scope.questions[i].type == 'multi') {
                $scope.questions[i].isCorrect = true;
                for (var j in $scope.questions[i].answers) {
                    if ($scope.questions[i].answers[j] != $scope.questions[i].responseAnswers[j]) {
                        $scope.questions[i].isCorrect = false;
                        break;
                    }
                }
            }
            else if ($scope.questions[i].type == 'input') {
                if ($scope.questions[i].inputAnswer == $scope.questions[i].responseInputAnswer) {
                    $scope.questions[i].isCorrect = true;
                } else $scope.questions[i].isCorrect = false;

            }
        }

        $scope.step = 2;
    }

    step1controller.setQuestions = function (questions) {
        $scope.questions = questions;
        $scope.$apply();
    }
}