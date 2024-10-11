const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
// returns all checkboxes -> querySelectorAll
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
// for picking up random symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially 
let password = "";
let passwordLength = 8;
let checkCount = 0;
// set strength circle color to grey
setIndicator("#ccc");

// called function
handleSlider();

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // or kuch bhi karna chahiye?
    // SLIDER KE EK PART KO DIFFERENT COLOR SE SHOW KARNA HAI
    const min = inputSlider.min;
    const max = inputSlider.max;
    // X-axis mein ye variable % aur Y-axis mein
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min) + "% 100%" );
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow - HW
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max){
    return Math.floor( Math.random()*(max-min) ) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
    // return symbols[randNum];
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// await karane ke liye async bhi likhna hoga
async function copyContent(){
    try{
        // copying password to clipboard and waiting until not copied
        await navigator.clipboard.writeText(passwordDisplay.value);
        // will show below line only if upper line executed successfully
        copyMsg.innerText = "copied";
    }
    catch(e){
        // if promise not fullfilled
        copyMsg.innerText = "Failed";
    }

    // to make copy wala span visible
    // agar active naam ki class bani hai to CSS mein ab wo active ho jayegi
    copyMsg.classList.add("active"); 

    // after 2s active class hata do
    setTimeout( ()=> {
        copyMsg.classList.remove("active");
    },2000);

}

// slider ke upar eventListener laga rahe jiska kaam hai, length change & show karna
// ye event listener 'input' event pe chalega i.e input dene par chalega (can be click, drag etc. intead of input),
// and thisEvent (value of slider input recieved) is function parameter of arrow function
// handle slider function call karke ye new length usse pass-on kar rahe hain
inputSlider.addEventListener('input', (thisEvent)=>{
    passwordLength = thisEvent.target.value; // value of slider input recieved
    handleSlider();
})

// copy
copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copyContent();
})

// sabhi checkboxes par iterate karke jitne bhi checked wale hain unka count do
function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); // to update password length in UI
    }

}

// saare checkboxes par iterate karo aur kisi bhi checkbox mein koi bhi change ho
// tick/untick toh handleCheckboxChange function call karo
allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})

// GENERATE PASSWORD
generateBtn.addEventListener('click', ()=>{
    
    // none of the checkbox are selected
    if(checkCount==0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); // to update password length in UI
    }

    // let's start the journey to find new password

    // console.log("Password creation started");
    
    // remove old password
    password = "";

    // console.log("Password got empty");
    
    // let's put the stuff mentioned by the checkboxes
    
    // if(uppercaseCheck.checked){
        //     password += generateUpperCase();
        // }
        // if(lowercaseCheck.checked){
            //     password += generateLowerCase();
            // }
    // if(numbersCheck.checked){
        //     password += generateRandomNumber();
        // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    
    // console.log("functions added");
    
    // compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

})
