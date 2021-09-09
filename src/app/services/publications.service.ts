import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { comments } from '../models/comments';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { PublicationInterface } from '../models/publication';
import { AuthenticateService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  data: any;
  infoUser: any;

  constructor(
    private ngFirestore: AngularFirestore,
    public authService: AuthenticateService,
    private router: Router,
  ) {}

  registerPublication(value) {
    console.log('registro de publicación', value)
    return this.ngFirestore.collection('publications').add(value);
  }

  getPublicationID(id) {
    return this.ngFirestore.collection('publications').doc(id).valueChanges();
  }

  update(id, updatePublication: PublicationInterface) {
      return this.ngFirestore
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
    console.log('userFoundation',id)
    return this.ngFirestore.collection('publications', ref => ref.where('id_user', "==", id)).snapshotChanges().pipe(map( publications => {
      console.log('pub', publications)
      return publications.map( doc => {
        console.log('doc', doc)
        const data = doc.payload.doc.data() as PublicationInterface;
        data.id = doc.payload.doc.id;
        data.role_admin = "ADMIN";
        console.log('dadta', data)
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
    }).then(() => {
      <comments> {}
    })
  }

}
