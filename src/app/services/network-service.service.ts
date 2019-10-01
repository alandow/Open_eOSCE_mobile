import { Injectable, EventEmitter, Output } from '@angular/core';
import { Config } from '../models/config.model';
import { Couchbase } from 'nativescript-couchbase-plugin';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterExtensions } from 'nativescript-angular/router';
import { Observable, throwError, of, from } from 'rxjs';
import { catchError, retry, tap, delay, timeout } from 'rxjs/operators';
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from "tns-core-modules/connectivity";
import { Assessment } from '../models/assessment.model';
import { UserService } from './user.service';
import { StatusService } from './status.service';
import { PropertyChangeData } from 'tns-core-modules/data/observable';



@Injectable({
  providedIn: 'root'
})

export class NetworkServiceService {
  config: Config;// = new Config();
  storageDatabase: Couchbase;
  access_token: string;
  // are we connected to the Internet?
  connected: boolean = true;

  // are we logged on?
  public logged_on: boolean = false;

  headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
    private routerExtensions: RouterExtensions,
    private userservice: UserService,
    private statusservice: StatusService
  ) {
    /*   this.status.on(Observable.propertyChangeEvent, function(propertyChangeData: PropertyChangeData){
        console.log(propertyChangeData.propertyName+' has been changed to '+ propertyChangeData.value)
      }); */
    this.storageDatabase = new Couchbase('storage');
    if (this.storageDatabase.getDocument("config")) {
      console.log('current config:' + JSON.stringify(this.storageDatabase.getDocument("config")));
      this.config = this.storageDatabase.getDocument("config");
    }
    // get initial network state
    const myConnectionType = getConnectionType();
    if (myConnectionType == connectionType.none) {
      this.connected = false;
      //  this.connectedChange.emit({ connected:this.connected });
      this.statusservice.announceConnectionChange(this.connected);
    }
    // start monitoring for network changes
    startMonitoring((newConnectionType) => {
      // console.log(newConnectionType)
      switch (newConnectionType) {
        case connectionType.none:
          this.connected = false;
          this.statusservice.announceConnectionChange(this.connected);
          //   this.connectedChange.emit({ connected:this.connected });
          console.log("Connection type changed to none.");

          break;
        case connectionType.wifi:
          this.connected = true;
          this.statusservice.announceConnectionChange(this.connected);
          //   this.connectedChange.emit({ connected:this.connected });
          if (this.logged_on) {
            console.log("Connection type changed to WiFi- submit delayed assessments now");
            this.submitDelayedAssessments();
          }
          break;
        case connectionType.mobile:
          this.connected = true;
          this.statusservice.announceConnectionChange(this.connected);
          //  this.connectedChange.emit({ connected:this.status.connected });
          console.log("Connection type changed to mobile.");
          if (this.logged_on) {
            this.submitDelayedAssessments();
          }
          break;
        default:
          this.connected = false;
          break;
      }
      // status.update(this.connected);
    });

    // this.connectionstatus.subscribe(arg => this.property = arg);

  }
  // login, get token
  login(username: string, password: string): Observable<object> {
    console.log('network-service.service.ts says: login() called')
    let formData = JSON.stringify({
      username: username,
      password: password,
      grant_type: 'password',
      client_id: this.config.client_id,
      client_secret: this.config.client_secret
    })
    // console.log(formData);
    return this.http.post(this.config.service_url + '/oauth/token', formData, { headers: this.headers }).pipe(
      // this catches an error, returns the error. 
      catchError(err => of(err))
    );
  }


  // logout, release token
  logout(): Observable<object> {
    console.log('network-service.service.ts says: logout() called')
    console.log('getUserDetails:');
    let theheaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.access_token
    });
    // console.log(formData);
    return this.http.post(this.config.service_url + '/api/logout', null, { headers: theheaders }).pipe(
      // this catches an error, returns the error. 
      catchError(err => of(err))
    );
  }
  // check that a configuration is correct
  checkConfig(config?: Config): Observable<any> {
    if (!config) {
      if (this.storageDatabase.getDocument("config")) {
        this.config = this.storageDatabase.getDocument("config");
      } else {
        this.routerExtensions.navigate(['config']);
      }
    }
    console.log('network-service.service.ts says: checkConfig() called')
    let formData = JSON.stringify(config);
    return this.http.post(config.service_url + '/api/check', formData, { headers: this.headers })
      .pipe(
        timeout(5000),
        // this catches an error, returns the error. 
        catchError(err => of(err))
      );
  }

  // get the logged on user details from the backend
  // @TODO offline capability- store then 
  getUserDetails(): Observable<object> {
    console.log('network-service.service.ts says: getUserDetails() called')
    let formData = JSON.stringify(this.config);
    this.headers.append('Authorization', 'Bearer ' + this.access_token)
    console.log('getUserDetails:');
    let theheaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.access_token
    });
    return this.http.post(this.config.service_url + '/api/user', formData, { headers: theheaders })
      .pipe(
        timeout(5000),
        // this catches an error, returns the error. 
        catchError(err => of(err))
      );
  }

  // get the exams assigned to this user
  // @TODO offline capability- store then get from database if not connected
  getUserAssessments(): Observable<any> {
    console.log('network-service.service.ts says: getUserAssessments() called')
    // this.headers.append('Authorization', 'Bearer ' + this.access_token)
    //console.log('Token:' + this.access_token);
    if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
      let theheaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token
      });
      return this.http.post(this.config.service_url + '/api/getassessments', null, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        catchError(err => of(err))
      );
    } else {

    }
  }


  // get a specific exam
  // gets from database if not connected
  getAssessment(id: string): Observable<any> {
    if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
      console.log('network-service.service.ts says: getAssessment() called')
      this.headers.append('Authorization', 'Bearer ' + this.access_token)
      // console.log('Token:' + this.access_token);
      let theheaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token
      });
      return this.http.post(this.config.service_url + '/api/getassessmentdetails/' + id, null, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        catchError(err => of(err))
      );
    } else {
      // return stored assessment here
      const cachedexam = this.storageDatabase.query({
        select: [], // Leave empty to query for all
        //  from: 'otherDatabaseName', // Omit or set null to use current db
        where: [
          { property: 'type', comparison: 'equalTo', value: 'cached_exam' },
          { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: id },
        ]
      });
      console.log('Getting cached examination');
      //  console.log(cachedexam[0].data)
      // return this as an observable
      // introduce a little delay to simulate a network operation, as this seems to crash if it's too quick...
      return from([JSON.parse(cachedexam[0].data)]).pipe(delay(1000));

    }
  }


  // get the students assigned to this assessment
  // gets from database if not connected
  getstudentsForAssessment(id: string): Observable<any> {
    if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
      console.log('network-service.service.ts says: getstudentsForAssessment() called')
      this.headers.append('Authorization', 'Bearer ' + this.access_token)
      //   console.log('Token:' + this.access_token);
      let theheaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token
      });
      return this.http.post(this.config.service_url + '/api/getassessmentstudents/' + id, null, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        catchError(err => of(err))
      );

    } else {
      // return stored student details here
      const cachedstudents = this.storageDatabase.query({
        select: [], // Leave empty to query for all
        //  from: 'otherDatabaseName', // Omit or set null to use current db
        where: [
          { property: 'type', comparison: 'equalTo', value: 'cached_students' },
          { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: id },
        ]
      });
      console.log('Getting cached students');
      console.log(cachedstudents[0].data)
      // return this as an observable
      return from([cachedstudents[0].data]);

    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  // Submit an assignment
  // @TODO offline capability- set to database if not connected, upload when connection detected
  submitAssessment(student_id: string, assessment: Assessment): Observable<any> {
    console.log('network-service.service.ts says: submitAssessment() called')
    // build the answer object
    let submitdata = {
      student_id: student_id,
      exam_instances_id: assessment.id,
      comments: assessment.comment,
      real_author_id: null,
      answerdata: []

    };

    // answers
    assessment.exam_instance_items.forEach(element => {
      submitdata.answerdata.push({
        id: element.id,
        value: element.selectedvalue,
        selected_id: element.selected_id,
        comment: element.comment
      })
    }
    );
    let formData = JSON.stringify(submitdata);

    // console.log('Assessment data is:' + formData);
    console.log(this.connected);
    if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
      // headers
      let theheaders = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token
      });
      // submit
      console.log('about to post')
      return this.http.post(this.config.service_url + '/api/submitassessment', formData, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        catchError(err => of(err))
      )
        ;
    } else {
      // store this in the database for later submission
      console.log('Caching results for later submission');
      submitdata.real_author_id = this.userservice.user.id;
      this.storageDatabase.createDocument({ 'type': 'cached_exam', 'submitted': 'false', 'data': submitdata });
      // simulate a success
      return of({ "status": 0 })
    }
    ;
  }


  // submit delayed assessments. @TODO work out some way of telling the world there's things ready to go
  submitDelayedAssessments() {
    console.log('Submitting delayed results');
    const results = this.storageDatabase.query({
      select: [], // Leave empty to query for all
      //  from: 'otherDatabaseName', // Omit or set null to use current db
      where: [
        { property: 'type', comparison: 'equalTo', value: 'cached_exam' },
        { logical: 'and', property: 'submitted', comparison: 'equalTo', value: 'false' }
      ]
    });

    results.forEach(element => {
      console.log('submitting delayed:' + JSON.stringify(element));
      this.submitDelayedAssessment(JSON.stringify(element.data))
        .subscribe(result => {
          console.log('submit result is:' + JSON.stringify(result));
          // delete exam from database here
          if (result.status == 0) {
            this.storageDatabase.deleteDocument(element.id);
          }
        });
    });
    return;
  }

  // perform a delayed submission
  submitDelayedAssessment(assessmentJSONString: string): Observable<any> {
    console.log('submitDelayedAssessment sending:' + assessmentJSONString);

    let theheaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.access_token
    });
    return this.http.post(this.config.service_url + '/api/submitassessment', assessmentJSONString, { headers: theheaders }).pipe(
      // this catches an error, returns the error. 
      catchError(err => of(err))
    )
  }
}
