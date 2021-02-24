"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
let allStudentsFiltered = [];

const Student = {
    firstName: "",
    lastName: "",
    middleName: "unknown",
    nickName: "unknown",
    gender: "",
    house: "",
    image: "unknown"
};


function init() {
    console.log("init");
    loadJSON();
    document.querySelector("[data-filter=Slytherin]").addEventListener("click", slytherinButton);
    document.querySelector("[data-filter=Ravenclaw]").addEventListener("click", ravenclawButton);
    document.querySelector("[data-filter=Hufflepuff]").addEventListener("click", hufflepuffButton);
    document.querySelector("[data-filter=Gryffindor]").addEventListener("click", gryffindorButton);
    document.querySelector("[data-filter=bloodType]").addEventListener("click", bloodTypeButton);
    document.querySelector("[data-filter=prefect]").addEventListener("click", prefectButton);
    // document.querySelector("[data-filter=expelled]").addEventListener("click", expelledButton);
    document.querySelector("[data-filter=all]").addEventListener("click", allButton);
    document.querySelector("[data-filter=firstNameSort]").addEventListener("click" , sortFirstName);

}
// blood family
// https://petlatkea.dk/2021/hogwarts/families.json 

function loadJSON() {
    console.log("loadJSON");
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(r => r.json())
    .then (jsonData => {
        // loaded --> prepare objects
        prepareObjects(jsonData);
    });
}

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

        if (hyphen == -1) {
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

        allStudents.unshift(student);
    });
    allStudentsFiltered = allStudents ;
    displayList();
}

function displayList() {
    console.log("displayList");
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
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

function showModal(student) {
    console.log(student);
    const modal = document.querySelector(".modalBackground");
    modal.querySelector(".modalStudentName").textContent = student.firstName + " " + student.lastName;
    modal.querySelector(".modalHouse").textContent = student.house;
    modal.querySelector(".modalGender").textContent = student.gender;
    modal.querySelector(".modalImage").src = `images/${student.image}`;
    // modal.querySelector(".modalEmblem").src = `emblems/${student.house}`;
    modal.querySelector(".modalEmblem").src = `emblems/hogwarts.png`;
    modal.querySelector(".modalPrefect").textContent = "is/not prefect";
    modal.querySelector(".modalContent").setAttribute("class", student.house);



    // modal.querySelector("[data-field=firstName]").textContent = student.firstName;
    // modal.querySelector("[data-field=lastName]").textContent = student.lastName;
    // modal.querySelector("[data-field=middleName]").textContent = student.middleName;
    // modal.querySelector("[data-field=nickName]").textContent = student.nickName;
// modal.querySelector("[data-field=house]").src = `images/${student.image}`;

  //...
    modal.classList.remove("hide");
}

function sortFirstName () {
    allStudentsFiltered.sort(compareFirstName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);

}

function compareFirstName (a,b) {
    if ( a.firstName < b.firstName ) {
        return -1;
    } else {
        return 1 ; 
    }
} 

function displayListFiltered (filtered) {
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    filtered.forEach(displayStudent);
}

// buttons
function slytherinButton() {
    const onlySlytherin = allStudents.filter(isSlytherin);
    allStudentsFiltered = onlySlytherin ;
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
    allStudentsFiltered = onlyRavenclaw ;
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
    allStudentsFiltered = onlyHufflepuff ;
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
    allStudentsFiltered = onlyGryffindor ;
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
    displayList(onlyBloodType);
}

function isBloodType(student) {
    if (student.bloodType === "BloodType") {
        return true;
    } else {
        return false;
    }
}

function prefectButton() {
    const onlyPrefect = allStudents.filter(isPrefect);
    displayList(onlyPrefect);
}

function isPrefect(student) {
    if (student.prefect === "Prefect") {
        return true;
    } else {
        return false;
    }
}

function expelledButton() {
    const onlyExpelled = allStudents.filter(isExpelled);
    displayList(onlyExpelled);
}

function isExpelled(student) {
    if (student.expelled === "Expelled") {
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






// fullName gender house
// function dataRecieved(data) {
//     console.log(data);

// }

// clean up 
// function cleanUpData() {
//     // remove first the space
//     // student
//     const firstSpace = student.indexOf(" ");
//     const lastSpace = student.lastIndexOf(" ");
//     const slash = student.includes(" \")

//     const firstName = student.fullname.substring(0,firstSpace);
//     const middleName = student.fullname.substring(firstSpace, lastSpace);
//     const lastName = student.fullname.substring(lastSpace);
//     // nickname has / 
//     const nickName = student.fullname;
//     console.log(firstName);
//     console.log(middleName);
//     console.log(lastName);


//     // remove space infront
//     // first character big
//     // rest small 
//     // nickname ?? where

// }

// function cleanUpFullName() {}

// function cleanUpHouse() {}