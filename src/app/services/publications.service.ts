import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { comments } from '../models/comments';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { PublicationInterface } from '../models/publication';


@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  data: any;

  constructor(
    private ngFirestore: AngularFirestore, 
    private router: Router,
  ) {}

  publication: PublicationInterface = {
    date_ex: '',
    description: '',
    // image_user: '',
    last_name: '',
    name: '',
    phone: 0,
    title: '',
    id: '',
    id_user: 'Revisar',
    // image: '',
    role_user: '',
    role_admin: '',
  };

  create(newpublication: PublicationInterface) {
    console.log('adadsasd', this.data)
    //return this.ngFirestore.collection('publications').add(newpublication);
  }

  getPublicationID(id) {
    return this.ngFirestore.collection('publications').doc(id).valueChanges();
  }

  update(id, updatePublication: PublicationInterface) {
      this.ngFirestore
      .collection('publications')
      .doc(id)
      .update(updatePublication)
      .then(() => {
        this.router.navigate(['/publications']);
      })
      .catch((error) => console.log(error));
  }

  delete(id: string) {
    this.ngFirestore.doc('publications/' + id).delete();
  }

  getPublicationsFoundation(id){
    console.log(id)
    return this.ngFirestore.collection('publications', ref => ref.where('id_user', "==", id)).snapshotChanges().pipe(map( publications => {
      return publications.map( doc => {
        const data = doc.payload.doc.data() as PublicationInterface;
        data.id = doc.payload.doc.id;
        data.role_admin = "ADMIN";
        return data;
      })
    }))
  }

  getPublicationsUser(id){
    console.log(id)
    return this.ngFirestore.collection('publications').snapshotChanges().pipe(map( publications => {
      return publications.map( doc => {
        const data = doc.payload.doc.data() as PublicationInterface;
        data.id = doc.payload.doc.id;
        data.role_user = "USER";
        return data;
      })
    }))
  }

  getPublication(comment_id : string){
    return this.ngFirestore.collection('publications').doc(comment_id).valueChanges()
  }

  getPublicationFoundation(comment_id : string){
    return this.ngFirestore.collection('publications').doc(comment_id).valueChanges()
  }

  sendComment(comment: comments, publication_id: string){
    this.ngFirestore.collection('publications').doc(publication_id).update({
      comments: firebase.default.firestore.FieldValue.arrayUnion(comment),
    })
  }

}
