// Work on splash screen

let span_splash = document.querySelector(".splash-screen span")
let promt = "";

span_splash.onclick = function () {

    promt = prompt("Whats your name");

    if(promt == null || promt == "") {

        document.querySelector(".name").innerHTML = "Unknown";

    }else {

        document.querySelector(".name").innerHTML = promt;

    }

    document.querySelector(".splash-screen").remove()
    AddDatatoarray()
}



let duration = 1000;

let memoriesblock = document.querySelector(".memories-block")
let divs_memories_block = Array.from(memoriesblock.children)
let shuffling = [...Array.from({length : divs_memories_block.length}).keys()]


// Shuffling => Random Value
for(let i = 0; i < shuffling.length;i++) {

    // Temporatory Value
    let temp = shuffling[i];
    // Generate Random Num
    let r = Math.floor(Math.random() * shuffling.length)
    // Current = random
    shuffling[i] = shuffling[r]
    // Swap to let r = temp
    shuffling[r] = temp;
}


// Add Order on divs to make it random 
divs_memories_block.forEach((e , index) => {
    e.style.order = shuffling[index]

    e.addEventListener("click" , () => {
        isFlipped(e)
    })
    
})


function isFlipped(element) {

    element.classList.add("flipped")


    let filtered = divs_memories_block.filter((e) => e.classList.contains("flipped"));


    if(filtered.length == 2) {
     
        stopClick()
        hasMatched(filtered[0], filtered[1])
    }
}


function stopClick() {

    memoriesblock.classList.add("no-clicking")


    setTimeout(() => {

        memoriesblock.classList.remove("no-clicking")

    }, duration);

}


function hasMatched(firstblock , secondblock) {



    if(firstblock.dataset.techonlogy == secondblock.dataset.techonlogy) {
   

   

        firstblock.classList.remove("flipped")
        secondblock.classList.remove("flipped")


        firstblock.classList.add("has-match")
        secondblock.classList.add("has-match")

        document.querySelector(".succuss").play()
    }else {

        updateWrongTries()


        setTimeout(() => {
            firstblock.classList.remove("flipped")
            secondblock.classList.remove("flipped")
        }, duration);


    }



}

let wrongTries = document.querySelector(".wrong-try").innerHTML

let dashboardDetails = document.querySelector(".dashboard");


let arrayOfTask = [];


if(window.localStorage.getItem("data")) {

    arrayOfTask = JSON.parse(window.localStorage.getItem("data"))

}


function AddDatatoarray() {
    let existingTask = arrayOfTask.filter(task => task.title === promt);

    if (existingTask.length === 0) {
        const data = {
            id: Date.now(),
            title: promt == undefined || "" ? title = "Unknow" : promt,
            wrongTry: 0  
        };
        arrayOfTask.push(data);
    } else {
        arrayOfTask = arrayOfTask.map(task => {
            if (task.title === promt) {
                return {...task , wrongTry : task.wrongTry}
            }
           return task
        });
    }

    createDashboardscore(arrayOfTask)
    addDataToLocalStorage(arrayOfTask)
}



function addDataToLocalStorage(arrayOfTask) {

    window.localStorage.setItem("data" , JSON.stringify(arrayOfTask))

}

function createDashboardscore(arrayOfTask) {

    dashboardDetails.innerHTML = "";        
    arrayOfTask.forEach((e) => {

        let mainDiv = document.createElement("div")
        mainDiv.className = "dashScore";
        let textNodeDiv = document.createTextNode(`The Name Is : ${e.title}`);
        mainDiv.appendChild(textNodeDiv)

        let mainSpan = document.createElement("span")
        let textSpan = document.createTextNode(`Wrong Tris is : ${e.wrongTry}`)

        mainSpan.appendChild(textSpan)

        mainDiv.appendChild(mainSpan)
        dashboardDetails.appendChild(mainDiv)
    })


}



function triggerDataOnPage() {

    let Data =  window.localStorage.getItem("data");

    if(Data) {
        
        createDashboardscore(JSON.parse(window.localStorage.getItem("data")))

    }

}

triggerDataOnPage()






function updateWrongTries() {
    let wrongTriesElement = document.querySelector(".wrong-try");
    let wrongTries = parseInt(wrongTriesElement.innerHTML) + 1;
    wrongTriesElement.innerHTML = wrongTries;


    if(wrongTries == 8) {
        document.querySelector(".memories-block").classList.add("end")
        document.querySelector(".fail").play()
    }
    // Update the local array and localStorage
    arrayOfTask.forEach(task => {
        if (task.title === promt) { 
            task.wrongTry = wrongTries;
        }
    });
    addDataToLocalStorage(arrayOfTask);
    createDashboardscore(arrayOfTask)
}
