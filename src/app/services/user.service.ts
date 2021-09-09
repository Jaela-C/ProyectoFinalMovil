import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserInterface } from '../models/user';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private ngFirestore: AngularFirestore, 
    private router: Router,
    private afAuth: AngularFireAuth,
  ) {}

  user: UserInterface = {
    uid: '',
    name: '',
    last_name: '',
    email: '',
    image: '',
    rol: '',
  };

  getUser(id) {
    return this.ngFirestore.collection('users').doc(id).valueChanges();
  }

  update(id, updateUser: UserInterface) {
    return firebase.default.auth().currentUser.updateEmail(updateUser.email).then( () => {
      this.ngFirestore
      .collection('users')
      .doc(id)
      .update(updateUser)
      .then(() => {
        this.router.navigate(['/profile-user']);
      })
      .catch((error) => console.log(error));
    });
  }

  delete(id: string) {
    this.ngFirestore.doc('users/' + id).delete();
  }
}
