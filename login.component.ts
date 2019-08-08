import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConnectionState, ConnectionService } from '../connection.service';
import * as CryptoJS from 'crypto-js';
import { HttpClient} from '@angular/common/http';
import {Http, Headers,} from "@angular/http";

declare var $: any;
declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentState: ConnectionState;
  username: any;
  password: any;
  cnfpassword: any;
  email: any;
  currentLoginUser: string;
  userData: any;
  progressHide = false;
  buttonHide = false
  ConnectionState1: any;
  userName: any;


  name: string;
  city: string;
  state: string;
  code: string;
  public getData = []
  images = []
  constructor(private http: HttpClient, public router: Router, public route: ActivatedRoute, public firebaseAuth: AngularFireAuth, private connectionService: ConnectionService,) {
    this.connectionService.monitor().subscribe((currentState: ConnectionState) => {
      console.log(currentState);
      this.currentState = currentState;
    });
  }

  ngOnInit() {

  }

  //encrypt & Decrypt

  save(e) {
    // var data = [{
    //   'name': this.name,
    //   // "city" : this.city,
    //   // "state" : this.state,
    //   // "code" : this.code,
    // }]
    // console.log(data)
    this.http.get('https://api.github.com/search/users?q=+"e"+').subscribe((data) => {
      console.log(data)
      this.getData.push(data) 
      // for(var i =0;i<this.getData.length;i++){
      //   this.images.push(this.getData[i].items)
      //   console.log(this.images)

      //}
    })


  }

  getata(userId){
    
    this.http.get('https://api.github.com/users/'+userId+'/repos').subscribe((data)=>{
      let getRepository = data
    })

  }
  //   let conversionOutput = CryptoJS.AES.encrypt(this.name, this.state, this.city, this.code).toString();
  //   console.log(conversionOutput)
  //   localStorage.setItem('encrypt', (conversionOutput))
  //   let getData = localStorage.getItem("encrypt")
  //   console.log('get data', getData)


  //   var newString = getData.substr(0, getData.length - 1);

  //   console.log(newString)
  //   if(newString){
  //   // let conversionData = CryptoJS.AES.decrypt(newString).toString(CryptoJS.enc.Utf8);
  //   console.log('newstring',newString)
  //   let conversionData = CryptoJS.AES.decrypt(newString).toString(CryptoJS.enc.Utf8);
  //     console.log(conversionData)
  //   }

  //   // key = CryptoJS.AES.decrypt(privKey, userLogin.password, {
  //   //   mode: CryptoJS.mode.ECB
  //   // }).toString(CryptoJS.enc.Utf8);

  // }











  // user login

  login() {
    if (this.email && this.password) {
      this.progressHide = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
        if (firebase.auth().currentUser !== null)
          this.currentLoginUser = firebase.auth().currentUser.uid
        this.getName()

        console.log("user id: ", this.currentLoginUser);
        localStorage.setItem("currentUserId", JSON.stringify(this.currentLoginUser))
        firebase.firestore().collection('userData').doc(this.currentLoginUser).get().then(doc => {
          setTimeout(() => {
            if (doc.data()) {
              console.log('home')
              this.router.navigate(['/chat'], { queryParams: { data: (this.currentLoginUser) } })
              this.progressHide = false;
            } else {
              this.router.navigate(['/chat'], { queryParams: { data: (this.currentLoginUser) } })
              console.log('info')
              this.progressHide = false;
            }
          }, 1000)
        })

      }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorMessage) {
          alert(error.message);
          this.progressHide = false
        }
      });
    }
  }

  getName() {
    firebase.firestore().collection('userLoginData').doc(this.currentLoginUser).get().then(doc => {
      console.log(doc.data().userName)
      this.userName = doc.data().userName
      localStorage.setItem('userName', doc.data().userName)
    })
  }


  signup() {
    this.router.navigate(['/signup'])
  }


  forgotPswd() {
    if (this.email) {
      firebase.auth().sendPasswordResetEmail(this.email).then(() => {
        alert('Sent password to you are email.! Reset Email!')
      }).catch((error) => {
        alert(error)
      })
    } else {
      alert('please fill the email')
    }
  }
}
