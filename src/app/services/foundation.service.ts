import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FoundationInterface } from '../models/foundation';

@Injectable({
  providedIn: 'root'
})
export class FoundationService {

  constructor(
    private ngFirestore: AngularFirestore, 
    private router: Router,
  ) {}

  foundation: FoundationInterface = {
    uid: '',
    name: '',
    last_name: '',
    name_foundation: '',
    email: '',
    photo: '',
    rol: '',
  };

  getUser(id) {
    return this.ngFirestore.collection('foundations').doc(id).valueChanges();
  }

  update(id, updateFoundation: FoundationInterface) {
    firebase.default.auth().currentUser.updateEmail(updateFoundation.email).then( () => {
      this.ngFirestore
      .collection('foundations')
      .doc(id)
      .update(updateFoundation)
      .then(() => {
        this.router.navigate(['/profile-admin']);
      })
      .catch((error) => console.log(error));
    });
  }

  delete(id: string) {
    this.ngFirestore.doc('foundations/' + id).delete();
  }
}
