const balanceE1 = document.querySelector(".balance .value");
const incomeTotalE1 = document.querySelector(".income-total");
const outcomeTotalE1 = document.querySelector(".outcome-total");
const incomeE1 = document.querySelector("#income");
const expenseE1 = document.querySelector("#expense");
const allE1 = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// btns
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

//input  btns
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const  expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const  incomeAmount = document.getElementById("income-amount-input");

// var
let ENTRY_LIST;
let balance =0, income=0, outcome=0;

const DELETE = "delete" , EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();
 // event listeners

expenseBtn.addEventListener("click" , function(){
    show(expenseE1);
    hide([incomeE1 , allE1]);
    active( expenseBtn );
    inactive([incomeBtn , allBtn]);
})

incomeBtn.addEventListener("click" , function(){
    show(incomeE1);
    hide([expenseE1 , allE1]);
    active( incomeBtn );
    inactive([expenseBtn , allBtn]);
})

allBtn.addEventListener("click" , function(){
    show(allE1);
    hide([incomeE1 , expenseE1]);
    active( allBtn );
    inactive([incomeBtn , expenseBtn]);
})

addExpense.addEventListener("click" , function(){
    // if one of input input is empty then we exit
    if(!expenseTitle.value || !expenseAmount.value) return;
    // save
    let expense ={
        type : "expense" ,
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([expenseTitle , expenseAmount])
})

addIncome.addEventListener("click" , function(){
    // if one of input input is empty then we exit
    if(!incomeTitle.value || !incomeAmount.value) return;
    // save
    let income ={
        type : "income" ,
        title : incomeTitle.value,
        amount : parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income);


    updateUI();
    clearInput([incomeTitle , incomeAmount])
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPERS

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
 income = calculateTotal("income" , ENTRY_LIST);
 outcome = calculateTotal("expense" ,ENTRY_LIST);
 balance = Math.abs(calculateBalance(income , outcome));
 //determine sign of balance
 let sign = (income >= outcome) ? "$" : "-$";
 // update Ui
 balanceE1.innerHTML = `<small>${sign}</small>${balance}`;
 outcomeTotalE1.innerHTML = `<small>$</small>${outcome}`;
 incomeTotalE1.innerHTML = `<small>$</small>${income}`;

 clearElement([expenseList , incomeList , allList]);

 ENTRY_LIST.forEach( (entry, index) => {
    if( entry.type == "expense" ){
        showEntry(expenseList, entry.type, entry.title, entry.amount, index)
    }else if( entry.type == "income" ){
        showEntry(incomeList, entry.type, entry.title, entry.amount, index)
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index)
});
    updateChart(income , outcome);
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}
function showEntry(list , type , title , amount , id){
    const entry =  `<li id ="${id}" class ="${type}">
    <div class = "entry"> ${title}: $${amount}</div>
    <div id = "edit"></div>
    <div id ="delete"></div>
    </li>`;
    const position = "afterbegin";
    list.insertAdjacentHTML(position , entry);
}



function clearElement(elements){
    elements.forEach(element =>{
        element.innerHTML = "";
    })
}

function calculateTotal(type , list){
    let sum =0;
    list.forEach(entry =>{
        if(entry.type ==type){
            sum+=entry.amount;
        }
    })
    return sum;
}
 
function calculateBalance(income , outcome){
   return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input =>{
        input.value = "";
    })
}
// helpers
function show(element){
    element.classList.remove("hide");
}
function hide(elements){
    elements.forEach(element =>{
        element.classList.add("hide");
    })
}
function active(element){
    element.classList.add("active");

}
function inactive(elements){
    elements.forEach(element =>{
        element.classList.remove("active");
    })
}