class Session{
    constructor(name){
        this.name = name;
        this.students=[];
    }

    addStudent(studentName, goal){
        this.students.push(new Student(studentName, goal))

    }
}

class Student{
    constructor(studentName, goal){
        this.studentName = studentName;
        this.goal = goal;
    }
}

class SessionService {
    static url = "https://635062943e9fa1244e458406.mockapi.io/sessions";
    
    static getAllSessions(){
        return $.get(this.url);
    }
    static getSession(id){
        return $.get(this.url + `/${id}`);
    }
    static createSession(session) {
        return $.post(this.url, session);
    }
    static updateSession(session){
        return $.ajax({
            url: this.url + `/${session._id}`, 
            dataType: `json`,
            data: JSON.stringify(session),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deleteSession(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

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
            if(session._id == id){
                session.students.push(new Student($(`#${student._id}-student-name`).val(), $(`#${session._id}-goal`).val()));
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
            if(session._id == sessionID) {
                for(let student of session.students){
                    if(student._id == studentID){
                        session.students.splice(session.students.indexOf(student),1);
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

    static render(sessions) {
        this.sessions = sessions;
        $('#app').empty();
        for (let session of sessions) {
            $('#app').prepend(
                `<div id="${session._id}" class="card">
                    <div class = "card-header">
                        <h2>${session.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteSession('${session._id}')">Delete</button>
                    </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                            <input type= "text" id="${session._id}-student-name" class = "form-control" placeholder= "Student Name">
                            </div>
                            <div class="col-sm">
                            <input type= "text" id="${session._id}-goal" class = "form-control" placeholder= "Session Goal">
                            </div>
                            </div>
                            <button id="${session._id}-new-student" onclick="DOMManager.addStudent('${session._id}')" class = "btn btn-primary form-control">Add Student</button>
                            </div>
                        </div>
                    </div><br>`
            );

            for (let student of session.students) {
                 $(`#${session._id}`).find('card-body').append(
                    `<p>
                        <span id="name-${student._id}"><strong>Name: </strong> ${student.studentName}</span>
                        <span id="goal-${student._id}"><strong>Session Goal: </strong> ${student.goal}</span>
                        <button class= "btn btn-danger" onclick="DOMManager.deleteStudent('${session._id}', '${student._id}')">Delete Student</button>
                    `
                 );
            }
        }
    }
}

$('#create-new-session').click(() =>{
    DOMManager.createSession($('#new-session').val());
    $('#new-session').val('');
});

DOMManager.getAllSessions(); 

