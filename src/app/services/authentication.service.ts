import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) { }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then( res => {
        this.db.collection('users').doc(res.user.uid).set({
          name: value.name,
          last_name: value.last_name,
          email: value.email,
          image: "",
          role: "USER"
        })
        resolve(res)
      }).catch(err => reject(err));
    });

  }

  registerFoundation(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then( res => {
        this.db.collection('foundations').doc(res.user.uid).set({
          name: value.name,
          last_name: value.last_name,
          email: value.email,
          image: "",
          role: "ADMIN",
          name_foundation: value.name_foundation,
          file: ""
        })
        resolve(res)
      }).catch(err => reject(err));
    });

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }

  logoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            console.log('Log Out');
            resolve();
            this.router.navigate(['/login'])
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  userDetails() {
    return this.afAuth.user;
  }

  profileUser () {
    this.router.navigate(['/profile-user'])
  }

  registerPublication () {
    this.router.navigate(['/register-publication'])
  }

  profileFoudantion () {
    this.router.navigate(['/profile-admin'])
  }
}
