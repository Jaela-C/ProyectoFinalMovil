import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { map } from 'rxjs/operators';
import { comments } from '../models/comments';
import firebase from 'firebase/app';

export interface publicationData {
  id: string
  date_ex: Date
  description: string
  id_user: string
  image: string
  last_name: string
  name: string
  phone: number
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(
    private db: AngularFirestore,
  ) { }

  getPublicationsFoundation(id){
    console.log(id)
    return this.db.collection('publications', ref => ref.where('id_user', "==", id)).snapshotChanges().pipe(map( publications => {
      return publications.map( doc => {
        const data = doc.payload.doc.data() as publicationData;
        data.id = doc.payload.doc.id;
        return data;
      })
    }))
  }

  getPublicationsUser(id){
    console.log(id)
    return this.db.collection('publications').snapshotChanges().pipe(map( publications => {
      return publications.map( doc => {
        const data = doc.payload.doc.data() as publicationData;
        data.id = doc.payload.doc.id;
        return data;
      })
    }))
  }

  getPublication(comment_id : string){
    return this.db.collection('publications').doc(comment_id).valueChanges()
  }

  sendComment(comment: comments, publication_id: string){
    this.db.collection('publications').doc(publication_id).update({
      comments: firebase.firestore.FieldValue.arrayUnion(comment),
    })
  }
}
