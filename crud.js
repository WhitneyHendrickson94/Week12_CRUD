//blueprint of what a session will be made up of
class Session{
    constructor(name){
        this.name = name;
        this.students=[];
    }

    addStudent(studentName, goal){
        this.students.push(new Student(studentName, goal))

    }
}
//blueprint of information a student will hold
class Student{
    constructor(studentName, goal){
        this.studentName = studentName;
        this.goal = goal;
    }
}

//this is the blueprint of how the api will be set up
// it holds functions for for all actions requested of the API
// This is the section where you make specfic requests for the API - CRUD
class SessionService {
    static url = "https://635062943e9fa1244e458406.mockapi.io/sessions"; //send request to this specific API referenced by the URL
   
    static getAllSessions(){
        return $.get(this.url); //R - in CRUD "Read"
    }
    static getSession(id){
        return $.get(this.url + `/${id}`); //R - in CRUD "Read"
    }
    static createSession(session) {
        return $.post(this.url, session); //C - in CRUD "create"
    }
    static updateSession(session){
        return $.ajax({
            url: this.url + `/${session.id}`, 
            dataType: `json`,
            data: JSON.stringify(session),
            contentType: 'application/json',
            type: 'PUT'                 //U - in CRUD "update"
        });                 
    }
    static deleteSession(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'              //D- in CRUD "delete"
        });
    }
}

//this is the blueprint of how the information sent to the API will be organized on the DOM after it is "served" back 
//in this class - functions in the Session Service are called and will now be able to be performed. 
class DOMManager {
    static sessions;
    
    static getAllSessions() {
        SessionService.getAllSessions().then(sessions => this.render(sessions));
    }

    static createSession(name) {
        SessionService.createSession(new Session(name))
        .then(() => {
            return SessionService.getAllSessions();
        })
        .then((sessions) => this.render(sessions));
    }

    static deleteSession(id) {
        SessionService.deleteSession(id)
            .then(() => {
                return SessionService.getAllSessions();
            })
            .then((sessions) => this.render(sessions));
    }

     static addStudent(id) {
        for (let session of this.sessions) {
            if(session.id == id){
                session.students.push(new Student($(`#${session.id}-student-name`).val(), $(`#${session.id}-goal`).val()));
                SessionService.updateSession(session) 
                    .then(() => {
                        return SessionService.getAllSessions();
                    })
                    .then((sessions) => this.render(sessions));
            }
        }
    }
    static deleteStudent(sessionID, studentID) {
        for (let session of this.sessions) {
            if(session.id = sessionID) {
                for(let student of session.students){
                    if(this.studentName = studentID){
                        session.students.splice(session.students.indexOf(student,1));
                        SessionService.updateSession(session)
                        .then(() => {
                            return SessionService.getAllSessions();
                        })
                        .then((sessions) => this.render(sessions));
                    }
                } 
            }
        }
    }
//Adding new sessions and student information too the empy DIV with id of app 
    static render(sessions) {
        this.sessions = sessions;
        $('#app').empty();
        for (let session of sessions) {
            $('#app').append(
                `<div id="${session.id}" class="card">
                    <div class = "card-header">
                        <h2>${session.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteSession('${session.id}')">Delete</button>
                    </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                            <input type= "text" id="${session.id}-student-name" class = "form-control" placeholder= "Student Name">
                            </div>
                            <div class="col-sm">
                            <input type= "text" id="${session.id}-goal" class = "form-control" placeholder= "Session Goal">
                            </div>
                            </div>
                            <button id="${session.id}-new-student" onclick="DOMManager.addStudent('${session.id}')" class = "btn btn-primary form-control">Add Student</button>
                            </div>
                        </div>
                    </div><br>`
            );

            for (let student of session.students) {
                 $(`#${session.id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${student.id}"><strong>Name: </strong> ${student.studentName}</span>
                        <span id="goal-${student.id}"><strong>Session Goal: </strong> ${student.goal}</span>
                        <button class= "btn btn-danger" onclick="DOMManager.deleteStudent('${session.id}', '${student.id}')">Delete Student</button>
                    
                    </p>`
                 );
            }
        }
    } 
}

//this is the event listener that will add a new session once the Create a Session button is clicked
$('#create-new-session').click(() =>{
    DOMManager.createSession($('#new-session').val());
    $('#new-session').val('');
});

//this calls the function of getting sessions in the DOM Manager where other funcrions can then be performed on 
//the information entered into the app
DOMManager.getAllSessions(); 

