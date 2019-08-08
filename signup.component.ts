import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConnectionState, ConnectionService } from '../connection.service';
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  currentState: ConnectionState;
  genderselecte = '';
  workstatus = '';
  progressHide = false
  username: any;
  email: any;
  experienced = true;
  fresher = false
  currentLoginUser: string;
  password: any;
  // buttondisable = true
  checkbox = false;
  freshers = false;
  experience = true;
  cnfpassword: any;
  mobile: any;
  fresher1: any
  constructor(public router: Router, public firebaseAuth: AngularFireAuth, private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe((currentState: ConnectionState) => {
      // console.log(currentState);
      this.currentState = currentState;
    });
  }

  ngOnInit() {

  }


  // fresherClick(e) {
  //   console.log(e)
  //   this.freshers = e
  //   this.experienced = false;
  //   this.fresher = true;
  // }
  // experienceClick(e) {
  //   this.experience = e
  //   console.log(this.experience)

  //   this.fresher = false
  //   this.experienced = true;
  // }

  SignUp() {
    if (this.password != this.cnfpassword) {
      alert("password not mach please check it once !")
      this.password = "";
      this.cnfpassword = ""
      this.progressHide = false
      
    }else if(this.password == this.cnfpassword){
      var data = {
        "userName": this.username,
        // "password": this.password,
        // 'cnfpassword': this.cnfpassword,
        "email": this.email,
        "gender": this.genderselecte,
        "workStatus" : this.workstatus,
        "T&C": this.checkbox,
        "mobile" : this.mobile
      }
    console.log(data)
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {
      if (firebase.auth().currentUser !== null)
        this.currentLoginUser = firebase.auth().currentUser.uid
      console.log("user id: ", this.currentLoginUser);
      // ...

      setTimeout(() => {
        if (this.currentLoginUser) {
          console.log(this.currentLoginUser)
          // localStorage.setItem("currentUserId", JSON.stringify(this.currentLoginUser))
          firebase.firestore().collection("userLoginData").doc(this.currentLoginUser).set(data).then(docRef => {
            alert('SignUp Successfully')
            this.router.navigate([''])
            this.progressHide = false
            this.username = "";
            this.email = "";
            this.password = "";
            this.cnfpassword = ""

          })
        }
      }, 1000)
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorMessage) {
        alert(error.message);
        this.email = "";
        this.progressHide = false
      }
    });
  }
}


  login() {
    this.router.navigate([''])
  }

}
