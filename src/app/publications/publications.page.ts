import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { PublicationsService } from '../services/publications.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { PublicationComponent } from '../component/publication/publication.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.page.html',
  styleUrls: ['./publications.page.scss'],
})
export class PublicationsPage implements OnInit {

  public publicationsList :any = [];
  public infoUser: any;
  public infoFoundation: any;
  private router: Router;
  public userProfile: boolean;

  constructor(
    public authService: AuthenticateService,
    public publicationService: PublicationsService,
    private modal: ModalController,
    public actionSheetController: ActionSheetController,
    private db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.authService.userDetails().subscribe(user => {
      if(user != null){
        this.infoUser = this.db.collection('users').doc(user.uid).get().subscribe( userInfo => {
          if(userInfo.data() == undefined){
              this.publicationService.getPublicationsFoundation(user.uid).subscribe( publications => {
                this.publicationsList = publications
              })
              this.userProfile = false;
          }
          else{
            this.publicationService.getPublicationsUser(user.uid).subscribe( publications => {
              this.publicationsList = publications
            })
            this.userProfile = true;
          }
        }); 
      }
      else {
        console.log("sin sesión")
      }
    })
  }
  openPublication(publication){
    this.modal.create({
      component: PublicationComponent,
      componentProps : {
        publication: publication
      }
    }).then( (modal) => modal.present()
    )
  }

  logoutUser(){
    this.authService.logoutUser();
  }

  delete(id: string){
    this.publicationService.delete(id)
  }

  profileUser(){
    this.authService.profileUser();
  }

  profileFoundation(){
    this.authService.profileFoudantion();
  }

  registerPublication(){
    this.authService.registerPublication();
  }

  viewPublication(){
    this.authService.viewPublication();
  }

  async presentActionSheet() {
    if (this.userProfile == false) {
      const actionSheet = await this.actionSheetController.create({
        cssClass: 'my-custom-class',
        buttons: [ {
          text: 'Ver perfil',
          icon: 'person',
          handler: () => {
            console.log('por', this.userProfile)
            if(this.userProfile == true){
              this.profileUser()
            }
            if(this.userProfile == false){
              this.profileFoundation()
            }
          }
        }, {
          text: 'Agregar publicaciones',
          icon: 'add-circle',
          handler: () => {
            this.registerPublication()
          }
        }, {
          text: 'Ver publicaciones',
          icon: 'eye-outline',
          handler: () => {
            this.viewPublication()
          }
        }, {
          text: 'Cerrar sesión',
          icon: 'log-out',
          handler: () => {
            this.logoutUser()
          }
        },]
      });
      await actionSheet.present();
    }
    if (this.userProfile == true) {
      const actionSheet = await this.actionSheetController.create({
        cssClass: 'my-custom-class',
        buttons: [ {
          text: 'Ver perfil',
          icon: 'person',
          handler: () => {
            console.log('por', this.userProfile)
            if(this.userProfile == true){
              this.profileUser()
            }
            if(this.userProfile == false){
              this.profileFoundation()
            }
          }
        }, {
          text: 'Ver publicaciones',
          icon: 'eye-outline',
          handler: () => {
            this.viewPublication()
          }
        }, {
          text: 'Cerrar sesión',
          icon: 'log-out',
          handler: () => {
            this.logoutUser()
          }
        },]
      });
      await actionSheet.present();
    }
  }
}
