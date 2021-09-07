import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { comments } from '../../models/comments';
import { PublicationsService } from '../../services/publications.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticateService } from '../../services/authentication.service';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
})
export class PublicationComponent implements OnInit {

  public publication: any;

  public commentsList = [];
  public infoUser: any;
  public msg: string;
  public name_user: string;
  public id_user: string;
  public last_name: string

  public room: any;

  constructor(
    private navparams: NavParams,
    private modal: ModalController,
    private PublicationsService: PublicationsService,
    private authService: AuthenticateService,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.PublicationsService.getPublication(this.publication.id).subscribe( room => {
      console.log(room)
      this.room = room;
    })
    this.publication = this.navparams.get('publication')
  }

  closePublication(){
    this.modal.dismiss()
  }

  sendComment(){
    this.authService.userDetails().subscribe(user => {
      if(user != null){
        this.db.collection('users').doc(user.uid).get().subscribe( userInfo => {
          this.infoUser = userInfo.data()
          if(this.infoUser != undefined){
            const comentario : comments = {
              content : this.msg,
              date: new Date(),
              id_user: user.uid,
              name_user: this.infoUser.name,
              last_name_user: this.infoUser.last_name,
            }
            this.PublicationsService.sendComment(comentario, this.publication.id)
          }
        });
      }
      else {
        console.log("sin sesión")
      }
    })
  }
}
