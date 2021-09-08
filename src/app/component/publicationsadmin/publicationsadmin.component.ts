import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { PublicationsService } from '../../services/publications.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticateService } from '../../services/authentication.service';
import { commentsfoundations } from 'src/app/models/commentsfoundations';

@Component({
  selector: 'app-publicationsadmin',
  templateUrl: './publicationsadmin.component.html',
  styleUrls: ['./publicationsadmin.component.scss'],
})

export class PublicationsadminComponent implements OnInit {

  public publicationsadmin: any;

  public commentsList = [];
  public infoFoundation: any;
  public msg: string;
  public name_user: string;
  public id_user: string;
  public last_name: string

  public room: any;

  constructor(
    private navparamsfoundation: NavParams,
    private modal: ModalController,
    private PublicationsService: PublicationsService,
    private authService: AuthenticateService,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.PublicationsService.getPublicationFoundation(this.publicationsadmin.id).subscribe( roomFoundation => {
      this.room = roomFoundation;
    })
    this.publicationsadmin = this.navparamsfoundation.get('publicationsadmin')
  }

  closePublication(){
    this.modal.dismiss()
  }

  sendCommentFoundation(){
    this.authService.userDetails().subscribe(user => {
      if(user != null){
          this.db.collection('foundations').doc(user.uid).get().subscribe( foundationInfo => {
            this.infoFoundation = foundationInfo.data()
              const comentario : commentsfoundations = {
                content : this.msg,
                date: new Date(),
                id_user: user.uid,
                name_user: this.infoFoundation.name,
                last_name_user: this.infoFoundation.last_name,
              }
              this.PublicationsService.sendComment(comentario, this.publicationsadmin.id)
              // .then(() => {
              //   <commentsfoundations> {}
              // })
        });
      }
      else {
        console.log("sin sesión")
      }
    })
  }

}
