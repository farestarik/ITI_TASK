let addButton = document.getElementById('addBtn');
let nameError = document.getElementById('nameError');
let gradeError = document.getElementById('gradeError');
let sortList = document.getElementById("sort");
let filterList = document.getElementById("filter");

localStorage.setItem('sort', false);
localStorage.setItem('filter', false);



addButton.onclick = function() {
    let studentName = document.querySelectorAll('[name=studentName]')[0].value;
    let studentGrade = document.querySelectorAll('[name=studentGrade]')[0].value;
    addStudent(studentName, studentGrade);
};



function showStudents(studentsObj = null, sort = [false, false], filter = [false, false]) {
    let oldStudents = localStorage.getItem('students');
    let studentsTable = document.createElement('table');
    let studentsTableDiv = document.getElementById('studentsTable');
    let students;
    studentsObj == null ? students = [] : students = studentsObj;
    let markup = '';

    console.log('filter ' + filter)

    console.log('sort ' + sort)

    if (oldStudents !== null && oldStudents !== '') {
        oldStudents = JSON.parse(oldStudents);
        if (oldStudents.length > 0) {

            studentsTableDiv.innerHTML = '';
            studentsTableDiv.append(studentsTable);


            let filterType = localStorage.getItem('filter');
            let sortType = localStorage.getItem('sort');


            filterList.addEventListener('change', function() {

                if (filterType == 'false' && sortType == 'false') {
                    localStorage.setItem('filter', this.value);
                    showStudents(null, [false, false], [true, this.value]);
                } else if (filterType == 'false' && sortType !== 'false') {
                    localStorage.setItem("filter", this.value);
                    if (sortType == 'name') {
                        showStudents(sortByName(oldStudents), [true, 'name'], [true, this.value]);
                    } else if (sortType == 'grade') {
                        showStudents(sortByGrade(oldStudents), [true, 'grade'], [true, this.value]);
                    }
                } else if (filterType !== 'false' && sortType !== 'false') {
                    localStorage.setItem("filter", this.value);
                    if (sortType == 'name') {
                        showStudents(sortByName(oldStudents), [true, 'name'], [true, this.value]);
                    } else if (sortType == 'grade') {
                        showStudents(sortByGrade(oldStudents), [true, 'grade'], [true, this.value]);
                    }
                }

            });


            sortList.addEventListener('change', function() {

                if (sortType == 'false' && filterType == 'false') {
                    localStorage.setItem('sort', this.value);
                    showStudents(null, [false, false], [false, false]);
                } else if (sortType == 'false' && filterType !== 'false') {
                    localStorage.setItem("sort", this.value);
                    if (filterType == 'success') {
                        showStudents(filterBySuccess(oldStudents), [true, this.value], [true, 'success']);
                    } else if (filterType == 'fail') {
                        showStudents(filterByFail(oldStudents), [true, this.value], [true, 'fail']);
                    }
                } else if (sortType !== 'false' && filterType !== 'false') {
                    localStorage.setItem("sort", this.value);
                    if (filterType == 'success') {
                        showStudents(filterBySuccess(oldStudents), [true, this.value], [true, 'success']);
                    } else if (filterType == 'fail') {
                        showStudents(filterByFail(oldStudents), [true, this.value], [true, 'fail']);
                    }
                }

            });



            if (sort[0] === true) {
                if (sort[1] == 'name') {
                    oldStudents = sortByName(oldStudents);
                } else if (sort[1] == 'grade') {
                    oldStudents = sortByGrade(oldStudents);
                }
            }

            if (filter[0] === true) {
                if (filter[1] == 'success') {
                    oldStudents = filterBySuccess(oldStudents);
                } else if (filter[1] == 'fail') {
                    oldStudents = filterByFail(oldStudents);
                }
            }


            for (let i = 0; i < oldStudents.length; i++) {
                let student = oldStudents[i];
                markup = `
                    <tr class="student_tr">
                        <td>${student.name}</td>
                        <td>${student.grade}</td>
                        <td><button>Delete</button></td>
                    </tr>
                  `;
                studentsTable.innerHTML += markup;
            }
        }
    }
    nameError.style.visibility = 'visible';
}

showStudents();


function addStudent(name = '', grade = 0) {
    if (name == '') {
        nameError.style.visibility = 'visible';
        nameError.innerHTML = `Required!`;
    } else if (grade < 0 || grade > 100) {
        gradeError.style.visibility = 'visible';
        gradeError.innerHTML = `Grade should be between 0:100!`;
    } else {
        let oldStudents = localStorage.getItem('students');
        if (oldStudents !== null && oldStudents !== '') {
            oldStudents = JSON.parse(oldStudents);
            if (typeof oldStudents === 'object' || typeof oldStudents === 'array') {


                let old = lowerObject(oldStudents);

                let newStudent = {
                    name: name,
                    grade: grade
                };


                let exist = old.find(o => o.name === name.toLowerCase());


                if (exist) {
                    nameError.style.visibility = 'visible';
                    nameError.innerHTML = `Error: Can't Duplicate Student Name!`;
                } else {
                    oldStudents.push(newStudent);
                    let allStudents = oldStudents;
                    allStudents = capObject(allStudents);
                    let newStudents = JSON.stringify(allStudents);
                    localStorage.setItem('students', newStudents);
                    showStudents();
                }
            } else {
                directAddStudent(name, grade);
            }
        } else {
            directAddStudent(name, grade);
        } // If there's not object or array made already
    }
}


function directAddStudent(name = '', grade = 0) {
    if (name) {
        let students = [];
        students.push({
            name: name,
            grade: grade
        });
        students = JSON.stringify(students);
        localStorage.setItem('students', students);
        showStudents()
    }
}

function lowerObject(obj) {
    return obj.map(item => Object.fromEntries(Object.entries(item).map(([key, val]) => [
        key,
        (typeof val == 'string') ? val.toLowerCase() : val
    ])))
} // Make All Object (Names) in Lowercase

function capObject(obj) {
    return obj.map(item => Object.fromEntries(Object.entries(item).map(([key, val]) => [
        key,
        (typeof val == 'string') ? ucfirst(val) : val
    ])))
} // Make All Object (Names) in Capitalize

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sortByName(obj) {

    return obj.sort((a, b) => (a.name > b.name) ? 1 : -1);
}

function sortByGrade(obj) {
    return obj.sort((a, b) => (a.grade < b.grade) ? 1 : -1);
}


function filterBySuccess(obj) {
    return obj.filter(function(student) {
        return student.grade > 60;
    });
}

function filterByFail(obj) {
    return obj.filter(function(student) {
        return student.grade < 60;
    });
}