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
    return new Promise<any>((resolve, reject) => {
      this.authService.userDetails().subscribe(user => {
        if(user != null){
          this.infoUser = this.ngFirestore.collection('foundations').doc(user.uid).get().subscribe( userInfo => {
            //if(userInfo.data() !== undefined){
              this.ngFirestore.collection('publications').doc().set({
                date_ex: value.date_ex,
                description: value.description,
                image_user: 'image.png',
                last_name: value.last_name,
                name: value.name,
                phone: value.phone,
                title: value.title,
                id_user: user.uid,
                image: 'image.png',
                comments: []
              }).then((res) => {
                resolve(res)
                //value=[];
              }).catch(err => reject(err));
           // }
          })
        }
      })
    });
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
    console.log('userFoundation',id)
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
