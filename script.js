"use strict";
// blood family
// https://petlatkea.dk/2021/hogwarts/families.json 
window.addEventListener("DOMContentLoaded", init);

// ARRAYS
// const allStudents = [];
let allStudents = [];
let allStudentsFiltered = [];
let allStudentsExpelled = [];
let allStudentsSquad = [];
let systemHacked = false;
// let slytherinPrefects = [];
// let gryffindorPrefects = [];
// let hufflepuffPrefects = [];
// let ravenclawPrefects = [];
const searchBar = document.querySelector("#searchBar");

// OBJECTS
const Student = {
    firstName: "",
    lastName: "",
    middleName: "unknown",
    nickName: "unknown",
    gender: "",
    house: "",
    bloodType: "",
    image: "unknown",
    prefect: false,
    expelled: false,
    squad: false
};



// EVENT LISTENERS
function init() {
    console.log("init");
    loadJSON();
    document.querySelector("[data-filter=Slytherin]").addEventListener("click", slytherinButton);
    document.querySelector("[data-filter=Ravenclaw]").addEventListener("click", ravenclawButton);
    document.querySelector("[data-filter=Hufflepuff]").addEventListener("click", hufflepuffButton);
    document.querySelector("[data-filter=Gryffindor]").addEventListener("click", gryffindorButton);
    document.querySelector("[data-filter=BloodType]").addEventListener("click", bloodTypeButton);
    document.querySelector("[data-filter=Prefect]").addEventListener("click", prefectButton);
    document.querySelector("[data-filter=Expelled]").addEventListener("click", expelledButton);
    document.querySelector("[data-filter=Squad]").addEventListener("click", squadButton);
    document.querySelector("[data-filter=all]").addEventListener("click", allButton);
    document.querySelector("[data-filter=firstNameSort]").addEventListener("click" , sortFirstName);
    document.querySelector("[data-filter=lastNameSort]").addEventListener("click" , sortLastName);
    document.querySelector("[data-filter=houseNameSort]").addEventListener("click", sortHouseName);
    // document.querySelector(".modalExpelledButton").querySelector.addEventListener("click", expelledButton);
    // document.querySelector(".modalPrefectButton").querySelector.addEventListener("click", prefectButton);
}

// FETCH DATA
function loadJSON() {
    console.log("loadJSON");
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(r => r.json())
    .then (jsonData => {
        // loaded --> prepare objects
        prepareObjects(jsonData);
    });
}

// CLEAN DATA
function prepareObjects(jsonData) {
    console.log("prepareObjects");
    jsonData.forEach(jsonObject => {
        // new object created with cleaned data --> will be in allAnimals
        const student = Object.create(Student);
        // cleaning data
        // remove spacing around (remove first and last space)
        const flSpace = jsonObject.fullname.trim();
        // spliting every word
        // .split()
        const firstSpace = flSpace.indexOf(" ");
        const lastSpace = flSpace.lastIndexOf(" ");

        // firstName
        if (firstSpace == -1) {
            student.firstName = flSpace;
        } else {
            student.firstName = flSpace.substring(0,firstSpace);
        }
        // student.firstName = flSpace.substring(0,firstSpace);
        student.firstName = student.firstName.substring(0,1).toUpperCase() + student.firstName.substring(1).toLowerCase();

        // lastName (-)
        if (lastSpace == -1) {
            // now removed so doesnt print "Leanne's name"
            student.lastName = "";
        } else {
            student.lastName = flSpace.substring(lastSpace+1);
        }

        const hyphen = student.lastName.indexOf("-");

        if (hyphen == -1) {
            student.lastName = student.lastName.substring(0,1).toUpperCase() + student.lastName.substring(1).toLowerCase();        
        } else {
            student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1, hyphen+1).toLowerCase() + student.lastName.substring(hyphen+1, hyphen+2).toUpperCase() + student.lastName.substring(hyphen+2).toLowerCase();
        }

        // middleName
        student.middleName = flSpace.substring(firstSpace,lastSpace).trim();
    
        if (student.middleName.substring(0,1) == `"`) {
            student.nickName = student.middleName;
            student.middleName = "";
            student.nickName = student.nickName.split('"').join('');
            student.nickName = student.nickName.substring(0,1).toUpperCase() + student.nickName.substring(1).toLowerCase();
        } else {
            student.nickName = "";
            student.middleName = student.middleName.substring(0,1).toUpperCase() + student.middleName.substring(1).toLowerCase();
        }

        // gender
        student.gender = jsonObject.gender.trim();
        student.gender = student.gender.substring(0,1).toUpperCase() + student.gender.substring(1).toLowerCase();

        // house
        student.house = jsonObject.house.trim();
        student.house = student.house.substring(0,1).toUpperCase() + student.house.substring(1).toLowerCase();

        if (student.lastName == false) {
            student.image = "hogwarts.png";
        } else if (student.firstName === "Padma"){
            student.image = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
        } else if (student.firstName === "Parvati") {
            student.image = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
        } else if (hyphen == -1) {
            student.image = student.lastName.toLowerCase() + "_" + student.firstName.substring(0,1).toLowerCase() + ".png";
        } else {
            student.image = student.lastName.substring(hyphen+1).toLowerCase() + `_${student.firstName.substring(0,1).toLowerCase()}` + `.png`;
        } 
        
        // new object 
        // student.firstName = name[0];
        console.log(student.firstName);
        // student.lastName = name[0];
        console.log(student.lastName);
        // student.middleName = name[0];
        console.log(student.middleName);
        // student.nickName = name[0]
        console.log(student.nickName);
        // student.gender = jsonObject.gender;
        console.log(student.gender);
        // student.house = jsonObject.house;
        console.log(student.house);
        // student.image = ;

        // everyone first not expelled nor a prefect
        // student.expelled = false;
        // student.prefect = false;

        // FETCH JSON DATA FOR BLOOD/FAMILY
        fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then(r => r.json())
    .then (jsonData => {
        student.bloodType = checkBloodType(jsonData);
        // loaded --> prepare objects
        console.log(jsonData);
    });
    
    function checkBloodType(jsonData) {
        console.log("checkBloodType");
        if (jsonData.pure.includes(student.lastName) == true) {
            return "pure";
        } else if (jsonData.half.includes(student.lastName) == true) {
            return "half";
        } else {
            return "muggle";
        }
    }

        allStudents.unshift(student);

    });
    allStudentsFiltered = allStudents 
    displayList();
}
// DISPLAY
function displayList() {
    console.log("displayList");
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    countNumberStudents();
    document.querySelector("#showNumTotal").textContent = allStudents.length;
    document.querySelector("#showNumTotalNotExpelled").textContent = allStudents.length;
    // document.querySelector("#showNumExpelled").textContent = allStudentsExpelled.length;
    document.querySelector("#showNumCurrentlyDisp").textContent = allStudents.length;

    allStudents.forEach(displayStudent);
    console.table(allStudents);
}

function displayStudent(student) {
    console.log("displayStudent");
    // create clone / aka cloning my template in html
    const clone = document.querySelector("template#student").content.cloneNode(true);
    // set clone data
    clone.querySelector("[data-field=firstName]").addEventListener("click", clickStudent);
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    // clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    // clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    // clone.querySelector("[data-field=gender]").textContent = student.gender;
    clone.querySelector("[data-field=house]").textContent = student.house;
    // clone.querySelector("img").src = `images/${student.image}`;
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);

    // clone.querySelector("[data-field=firstName]").addEventListener("click", clickStudent);
    function clickStudent() {
        console.log("clickStudent");
        showModal(student);
    } 
    
    
}

// TODO counting not done
// COUNTING STUDENTS
function countNumberStudents() {
    const slytherinStudent = allStudents.filter(student => {
        if(student.house === "Slytherin") {
            return true;
        } else {
            return false;
        }
    });
    const gryffindorStudent = allStudents.filter(student => {
        if(student.house === "Gryffindor") {
            return true;
        } else {
            return false;
        }
    });
    const hufflepuffStudent = allStudents.filter(student => {
        if(student.house === "Hufflepuff") {
            return true;
        } else {
            return false;
        }
    });
    const ravenclawStudent = allStudents.filter(student => {
        if(student.house === "Ravenclaw") {
            return true;
        } else {
            return false;
        }
    });
    
    document.querySelector("#showNumGryffindor").textContent = gryffindorStudent.length;
    document.querySelector("#showNumSlytherin").textContent = slytherinStudent.length;
    document.querySelector("#showNumHufflepuff").textContent = hufflepuffStudent.length;
    document.querySelector("#showNumRavenclaw").textContent = ravenclawStudent.length;
    document.querySelector("#showNumExpelled").textContent = allStudentsExpelled.length;
}

// SEARCH
searchBar.addEventListener("keyup", (e) => {
    console.log("search");
    let searchString = e.target.value;
    searchString = searchString.toLowerCase();
    const filterStudents = allStudents.filter((student) => {
        return (student.firstName.toLowerCase().includes(searchString) || student.lastName.toLowerCase().includes(searchString) || student.house.toLowerCase().includes(searchString));
    });
    displayListFiltered(filterStudents);
});

// MODAL
function showModal(student) {
    console.log(student);
    const modal = document.querySelector(".modalBackground");
    modal.querySelector(".modalStudentName").textContent = student.firstName + " " + student.middleName + " " + student.lastName;
    modal.querySelector(".modalColor").classList.remove("Slytherin");
    modal.querySelector(".modalColor").classList.remove("Gryffindor");
    modal.querySelector(".modalColor").classList.remove("Hufflepuff");
    modal.querySelector(".modalColor").classList.remove("Ravenclaw");

    // middlename
    if (student.nickName){
        modal.querySelector(".modalNickName").classList.remove("hide");
        modal.querySelector(".modalNickName").textContent = "Nickname: " + student.nickName;
    } 

    modal.querySelector(".modalHouse").textContent = student.house;
    modal.querySelector(".modalGender").textContent = "Gender: " + student.gender;
    // FIX TWO PEOPLE WIITH SAME P AND SAME LAST NAME
    modal.querySelector(".modalImage").src = `images/${student.image}`;
    modal.querySelector(".modalEmblem").src = `emblems/${student.house}_color.png`;
    modal.querySelector(".modalColor").classList.add(student.house);
    // modal.querySelector(".modalPrefect").textContent = "Prefect: " + "is/not prefect";
    if (student.prefect == true) {
        modal.querySelector(".modalPrefect").textContent = "Is a prefect";
    } else {
        modal.querySelector(".modalPrefect").textContent = "Is not a prefect";
    }
    // modal.querySelector(".modalExpelled").textContent = "Expelled: " + "is/not expelled";
    if (student.expelled) {
        modal.querySelector(".modalExpelled").textContent = "Is expelled";
    } else {
        modal.querySelector(".modalExpelled").textContent = "Is not expelled";
    }
    // modal.querySelector(".modalMember").textContent = "Member of Inquisitorial Squad: " + "is/not member";
    if (student.squad) {
        modal.querySelector(".modalSquad").textContent = "Member of Inquisitorial Squad";
    } else {
        modal.querySelector(".modalSquad").textContent = "Not a memember of Inquisitorial Squad";
    }
    modal.querySelector(".modalBloodType").textContent = "Blood Status: " + student.bloodType;

    // EXPELLED STUDENTS
    modal.querySelector(".modalExpelledButton").addEventListener("click", modalExpelledButton);
    modal.querySelector(".modalPrefectButton").addEventListener("click", modalPrefectButton);
    modal.querySelector(".modalSquadButton").addEventListener("click", modalSquadButton);
    
    function modalExpelledButton() {    
        console.log("modalExpelledButton");
        if (student.expelled == "impossible") {
            alert("Student can't be expelled!!");
        } else {
            modal.querySelector(".modalExpelledButton").removeEventListener("click", modalExpelledButton);
            student.expelled = true;
            allStudents = allStudents.filter(expelling);
            allStudentsFiltered = allStudentsFiltered.filter(expelling);
            allStudentsExpelled.unshift(student);
            console.log(allStudentsExpelled);
            displayListFiltered(allStudentsFiltered);
            student.prefect = false;
            // TODO remove from array prefect
        }
    }

    // if (student.prefect == true) {
    //     modal.querySelector(".prefectIndicator").classList.remove("modalPrefectDisplay"); 
    // }

    // TODO toggle
    function modalPrefectButton() {
        console.log("modalPrefectButton");
        modal.querySelector(".modalPrefectButton").removeEventListener("click", modalPrefectButton);

        if (student.house === "Slytherin") {
            console.log("Slytherin");
            prefectSlytherin(student);
        } else if (student.house === "Ravenclaw") {
            console.log("Ravenclaw");
            prefectRavenclaw(student);
        } else if (student.house === "Hufflepuff") {
            console.log("Hufflepuff");
            prefectHufflepuff(student);
        } else if (student.house === "Gryffindor") {
            console.log("Gryffindor");
            prefectGryffindor(student);
        }
    }  

    // TODO toggle
    function modalSquadButton() {
        console.log("modalSquadButton");
        modal.querySelector(".modalSquadButton").removeEventListener("click", modalSquadButton);
        if (student.squad == true) {
            student.squad = false;
        } else if (student.house === "Slytherin") {
            student.squad = true;
        } else if (student.bloodType === "pure") {
            student.squad = true;
        } else if (student.bloodType === "half", student.bloodType === "muggle") {
            alert("Student can't become a member.")
        }
    }
    
  //...
    modal.classList.remove("hide");
    document.querySelector(".modalClose").addEventListener("click", closeModal);
    function closeModal() {
        console.log("closeModal");
        document.querySelector(".modalBackground").classList.add("hide");
        modal.querySelector(".modalContent").classList.remove(student.house);
        modal.querySelector(".modalExpelledButton").removeEventListener("click", modalExpelledButton);
        // modal.querySelector(".modalSquadButton").removeEventListener("click", modalSquadButton);
        document.querySelector(".modalClose").removeEventListener("click", closeModal);

    }
}

// TODO adding me and is hacking working?
// HACKING
function hackTheSystem() {
   if (systemHacked == false) {
       console.log("System Hacked");
       const me = Object.create(student);

       me.firstName = "Claudia";
       me.lastName = "Gesmar-Larsen";
       me.middleName = "";
       me.nickName = "";
       me.gender = "girl";
       me.house = "Gryffindor";
       me.bloodType = "muggle";
       me.image = "me.png";
       me.prefect = true;
       me.expelled = "impossible";
       me.squad = false;
       
       hackBloodStatus();
       allStudents.unshift(me);

       systemHacked = true;
   } else {
       alert("System is already hacked!");
   }
   setTimeout(function(){alert("You have been hacked!");}, 1000);
}

// TODO not done
function addSquad() {
    console.log("addSquad");
    if (systemHacked == true) {
        setTimeout(function() {
            squadButton();
        }, 1000);
    }
    allStudents[index].squad = true;
    document.querySelector(".modalSquadButton").classList.add("click", squadButton);
}

// TODO not done
function removeSquad() {
    console.log("removeSquad");
    document.querySelector(".modalSquadButton").classList.remove("click", squadButton);
    if (systemHacked == true) {
        setTimeout(function() {
            alert("Removed from squad");
        }, 100);
    }
    allStudents[index].squad = false;
}

// TODO not done
function hackBloodStatus() {
    allStudents.forEach((student) => {
        if(student.bloodType === "") {
            student.bloodType = "";
        } else if (student.bloodType === "") {
            student.bloodType = "";
        } else {
            let bloodRandomNum = Math.floor(Math.random() * 3);
            if (bloodRandomNum == 0) {
                student.bloodType = "";
            } else if (bloodRandomNum == 1) {
                student.bloodType = "";
            } else {
                student.bloodType = "";
            }
        }
    })
}

// PREFECTS
// TODO toggle so the prefect can be cancelled
function prefectSlytherin(student) {
    const slytherinPrefects = allStudents.filter(student => {       
        if (student.prefect && student.house === "Slytherin") {
            return true; 
        } else {
            return false;
        }    
    })
    const modal = document.querySelector(".modalBackground");
    console.log("Slytherin Prefects");
            console.log(slytherinPrefects);
            let isPersonPrefect = checkHouse(slytherinPrefects);
            console.log(isPersonPrefect);

            if  (student.prefect == true ) {
                console.log("student prefect");
                console.log(student);
                student.prefect = false;
                slytherinPrefects = slytherinPrefects.filter(isPrefect);
                // modal.querySelector(".prefectIndicator").classList.add("modalPrefectDisplay");
            } else if (isPersonPrefect == true) {
                student.prefect = true ;
                console.log("student prefect");
                console.log(student);
                slytherinPrefects.unshift(student);
                // modal.querySelector(".prefectIndicator").classList.remove("modalPrefectDisplay");

            } else if (isPersonPrefect == false) {
                // TODO make a modal instead
                alert ("You can't become prefect!")
            } 
}

function prefectGryffindor(student) {
    const gryffindorPrefects = allStudents.filter(student => {       
        if (student.prefect && student.house === "Gryffindor") {
            return true; 
        } else {
            return false;
        }    
    })
    const modal = document.querySelector(".modalBackground");
    console.log("Gryffindor Prefects");
            console.log(gryffindorPrefects);
            let isPersonPrefect = checkHouse(gryffindorPrefects);
            console.log(isPersonPrefect);

            if  (student.prefect == true ) {
                console.log("student prefect");
                console.log(student);
                student.prefect = false ;
                gryffindorPrefects = gryffindorPrefects.filter(isPrefect);
                // modal.querySelector(".prefectIndicator").classList.add("modalPrefectDisplay");
            } else if (isPersonPrefect == true) {
                student.prefect = true ;
                console.log("student prefect");
                console.log(student);
                gryffindorPrefects.unshift(student);
                // modal.querySelector(".prefectIndicator").classList.remove("modalPrefectDisplay");

            } else if (isPersonPrefect == false) {
                // TODO make a modal instead
                alert ("You can't become prefect!")
            }   
}

function prefectHufflepuff(student) {
    const hufflepuffPrefects = allStudents.filter(student => {       
        if (student.prefect && student.house === "Hufflepuff") {
            return true; 
        } else {
            return false;
        }    
    })
    const modal = document.querySelector(".modalBackground");
    console.log("Hufflepuff Prefects");
            console.log(hufflepuffPrefects);
            let isPersonPrefect = checkHouse(hufflepuffPrefects);
            console.log(isPersonPrefect);

            if  (student.prefect == true ) {
                console.log("student prefect");
                console.log(student);
                student.prefect = false ;
                hufflepuffPrefects = hufflepuffPrefects.filter(isPrefect);
                // modal.querySelector(".prefectIndicator").classList.add("modalPrefectDisplay");
            } else if (isPersonPrefect == true) {
                student.prefect = true ;
                console.log("student prefect");
                console.log(student);
                hufflepuffPrefects.unshift(student);
                // modal.querySelector(".prefectIndicator").classList.remove("modalPrefectDisplay");

            } else if (isPersonPrefect == false) {
                // TODO make a modal instead
                alert ("You can't become prefect!")
            }   
}

function prefectRavenclaw(student) {
    const ravenclawPrefects = allStudents.filter(student => {       
        if (student.prefect && student.house === "Ravenclaw") {
            return true; 
        } else {
            return false;
        }    
    })
    const modal = document.querySelector(".modalBackground");
    console.log("Ravenclaw Prefects");
            console.log(ravenclawPrefects);
            let isPersonPrefect = checkHouse(ravenclawPrefects);
            console.log(isPersonPrefect);

            if  (student.prefect == true ) {
                console.log("student prefect");
                console.log(student);
                student.prefect = false ;
                ravenclawPrefects = ravenclawPrefects.filter(isPrefect);
                // modal.querySelector(".prefectIndicator").classList.add("modalPrefectDisplay");
            } else if (isPersonPrefect == true) {
                student.prefect = true ;
                console.log("student prefect");
                console.log(student);
                ravenclawPrefects.unshift(student);
                // modal.querySelector(".prefectIndicator").classList.remove("modalPrefectDisplay");

            } else if (isPersonPrefect == false) {
                // TODO make a modal instead
                alert ("You can't become prefect!")
            }   
}

function checkHouse (theList) {
    console.log("checkHouse");

    if (theList.length == 0){
        console.log("Counting for 0");
        return true
    } else if (theList.length == 1) {
        console.log("Counting  for 1");
        return true
    } else if (theList.length == 2) {
        return false
    } else {
        return false
        
    }

}

// SORT & FILTER
function sortFirstName() {
    allStudentsFiltered.sort(compareFirstName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);

}

function sortLastName() {
    allStudentsFiltered.sort(compareLastName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);

}

function sortHouseName() {
    allStudentsFiltered.sort(compareHouseName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);
}

function compareFirstName(a,b) {
    if ( a.firstName < b.firstName ) {
        return -1;
    } else {
        return 1 ; 
    }
} 

function compareLastName(a,b) {
    if ( a.lastName < b.lastName ) {
        return -1;
    } else {
        return 1 ; 
    }
} 

function compareHouseName (a,b) {
    if ( a.house < b.house ) {
        return -1;
    } else {
        return 1 ; 
    }
}

function expelling(student) {
    console.log("expelling");
    if (student.expelled == true) {
        return false;
    } else {
        return true;
    }
}

function displayListFiltered(filtered) {
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    filtered.forEach(displayStudent);
}

// buttons
function slytherinButton() {
    const onlySlytherin = allStudents.filter(isSlytherin);
    allStudentsFiltered = onlySlytherin;
    displayListFiltered(onlySlytherin);
}

function isSlytherin(student) {
    if (student.house === "Slytherin") {
        return true;
    } else {
        return false;
    }
}

function ravenclawButton() {
    const onlyRavenclaw = allStudents.filter(isRavenclaw);
    allStudentsFiltered = onlyRavenclaw;
    displayListFiltered(onlyRavenclaw);
}

function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
        return true;
    } else {
        return false;
    }
}
  
function hufflepuffButton() {
    const onlyHufflepuff = allStudents.filter(isHufflepuff);
    allStudentsFiltered = onlyHufflepuff;
    displayListFiltered(onlyHufflepuff);
}

function isHufflepuff(student) {
    if (student.house === "Hufflepuff") {
        return true;
    } else {
        return false;
    }
}
   
function gryffindorButton() {
    const onlyGryffindor = allStudents.filter(isGryffindor);
    allStudentsFiltered = onlyGryffindor;
    displayListFiltered(onlyGryffindor);
}

function isGryffindor(student) {
    if (student.house === "Gryffindor") {
        return true;
    } else {
        return false;
    }
}

function bloodTypeButton() {
    const onlyBloodType = allStudents.filter(isBloodType);
    allStudentsFiltered = onlyBloodType;
    displayListFiltered(onlyBloodType);
}

function isBloodType(student) {
    if (student.bloodType === "BloodType") {
        return true;
    } else {
        return false;
    }
}

function prefectButton() {
    console.log("prefectButton");
    const onlyPrefect = allStudents.filter(isPrefect);
    allStudentsFiltered = onlyPrefect;
    displayListFiltered(onlyPrefect);
}

function isPrefect(student) {
    if (student.prefect == true) {
        return true;
    } else {
        return false;
    }
}

function expelledButton() {
    // const onlyExpelled = allStudents.filter(isExpelled);
    console.log("expelledButton");
    const onlyExpelled = allStudentsExpelled;
    allStudentsFiltered = onlyExpelled;
    displayListFiltered(onlyExpelled);
}

function isExpelled(student) {
    if (student.expelled === "Expelled") {
        return true;
    } else {
        return false;
    }
}

// TODO have members be displayed
function squadButton() {
    console.log("squadButton");
    const onlySquad = allStudents.filter(isSquad);
    // const onlySquad = allStudentsSquad;
    allStudentsFiltered = onlySquad;
    displayListFiltered(onlySquad);
}

function isSquad(student) {
    if (student.squad === "Squad") {
        return true;
    } else {
        return false;
    }
}

function allButton() {
    const onlyAll = allStudents.filter(isAll);
    displayList(loadJSON);
    displayList(onlyAll);
}

function isAll(student) {
    if (student.all === "all") {
        return true;
    } else {
        return false;
    }
}




