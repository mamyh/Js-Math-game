let core = (function(){
    let autoGenerator = function(max){
       return  Math.floor(Math.random()*(max+1))
    }
    let state={
        points:0,
        wrongAnswer:0,
    }
    let setGame = function(){
        return {
            firstNumber : autoGenerator(10),
            secondNumber: autoGenerator(10),
            operator    : ['+','-','x'][autoGenerator(2)]
        }
    }

    let initialState = function(h1,input,p){
        input.value ="";
        input.focus();
        state.currentProblem = setGame();    
        h1.textContent = `${state.currentProblem.firstNumber} ${state.currentProblem.operator} ${state.currentProblem.secondNumber}`;
        p.innerHTML =`You need <span class='points'>${10-state.points}</span> more points and are allowed to make <span class='mistakes'>${2-state.wrongAnswer}</span> more mistakes`;
    }
    let renderProgress = function (progress){
        progress.style.transform =`scaleX(${state.points/10})`;
    }
    return {
       initialState : initialState,
       state        : state,
       renderProgress: renderProgress,
    }
})();

let view = (function(){
    let dataFromHtml ={
        autoNumber: document.querySelector('.auto-number'),
        answerInput: document.querySelector('.answer'),
        text       : document.querySelector('.text'),
        form       : document.querySelector('.rightAnswerForm'),
        progressBAr: document.querySelector('.progress-inner'),
        resetBtn   :document.querySelector('.resetBtn'),
        endMessage :document.querySelector('.end-message'),
    }
    let colorChange = function(yourClass){
        dataFromHtml.autoNumber.classList.add(yourClass);
        setTimeout(function(){
            dataFromHtml.autoNumber.classList.remove(yourClass);
        },441)
    }
    return {
        dataFromHtml : dataFromHtml,
        colorChange  :colorChange,
    }
})();

let controller = (function(core,view){
    let viewData = view.dataFromHtml;
    let problem  = core.state;
    core.initialState(viewData.autoNumber,viewData.answerInput,viewData.text);
    viewData.form.addEventListener('submit',function(e){
        let answer;
        e.preventDefault();

        if(problem.currentProblem.operator == '+')
           answer =problem.currentProblem.firstNumber + problem.currentProblem.secondNumber;
        
        if(problem.currentProblem.operator == '-')
           answer = problem.currentProblem.firstNumber - problem.currentProblem.secondNumber;

        if(problem.currentProblem.operator =='x')
            answer = problem.currentProblem.firstNumber * problem.currentProblem.secondNumber;
   
        let yourAnswer =parseInt(viewData.answerInput.value);
        
        if(yourAnswer === answer){
           problem.points++;
           view.colorChange('animate-right');
           if(problem.points <=10){
               if(problem.points == 10){
                   viewData.endMessage.textContent ="Congrates!! You win";
                   reset();
               }
            this.nextElementSibling.firstElementChild.textContent = 10-problem.points;
            core.initialState(viewData.autoNumber,viewData.answerInput,viewData.text);
            core.renderProgress(viewData.progressBAr);
           }
        }else{
          problem.wrongAnswer++;
          view.colorChange('animate-wrong');
          if(problem.wrongAnswer <=2){
              if(problem.wrongAnswer ==2){
                  viewData.endMessage.textContent = "Ahh!! all the best for the next";
                  reset();
              }
            this.nextElementSibling.lastElementChild.textContent = 2- problem.wrongAnswer;
            core.initialState(viewData.autoNumber,viewData.answerInput,viewData.text);
          }
          
        }
    });
    viewData.resetBtn.addEventListener('click',function(){
           document.body.classList.remove('overlay-is-open');
    })
    function reset(){
        document.body.classList.add('overlay-is-open');
        setTimeout(function(){
            viewData.resetBtn.focus();
        },1500);
        core.state.points =0;
        core.state.wrongAnswer =0;
        core.initialState(viewData.autoNumber,viewData.answerInput,viewData.text);
        core.renderProgress(viewData.progressBAr);
    }
})(core,view);