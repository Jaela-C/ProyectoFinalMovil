import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authentication.service';
import { PublicationsService } from '../services/publications.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { PublicationComponent } from '../component/publication/publication.component'

@Component({
  selector: 'app-publications',
  templateUrl: './publications.page.html',
  styleUrls: ['./publications.page.scss'],
})
export class PublicationsPage implements OnInit {

  public publicationsList :any = [];
  constructor(
    public authService: AuthenticateService,
    public publicationService: PublicationsService,
    private modal: ModalController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    console.log('entra')
    this.authService.userDetails().subscribe(user => {
      if(user != null){
        this.publicationService.getPublicationsFoundation(user.uid).subscribe( publications => {
          this.publicationsList = publications
        })
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [ {
        text: 'Ver perfil',
        icon: 'person',
        handler: () => {
          console.log('Ver perfil')
        }
      }, {
        text: 'Agregar publicaciones',
        icon: 'add-circle',
        handler: () => {
          console.log('Agregar publicaciones')
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
