class Session{
    constructor(name){
        this.name = name;
        this.student=[];
    }

    addSession(studentName, goal, stimuli){
        this.student.push(new Student(studentName, goal, stimuli))

    }
}

class Student{
    constructor(studentName, goal, stimuli){
        this.studentName = studentName;
        this.goal = goal;
        this.stimuli = stimuli;
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
            url: this.url + `/${session.id}`, 
            dataType: `json`,
            data: JSON.stringify(session),
            contentType: `application/json`,
            type: `PUT`
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
    static render(sessions) {
        this.sessions = sessions;
        $('#app').empty();
        for (let session of sessions) {
            $('#app').prepend(
                `<div id="${session.id}" class="card">
                    <div class = "card-header">
                        <h2>${session.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHouse(${session.id})">
                    </div>
         
                `
            );
        } 
    }
}

DOMManager.getAllSessions(); 

