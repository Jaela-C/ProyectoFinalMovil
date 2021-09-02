import { Component, OnInit } from '@angular/core';
import { FoundationInterface } from '../models/foundation';
import { FormGroup } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.page.html',
  styleUrls: ['./profile-admin.page.scss'],
})
export class ProfileAdminPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';
  infoFoundation: any;

  foundation: FoundationInterface = {
    uid: '',
    name: '',
    last_name: '',
    name_foundation: '',
    email: '',
    photo: '',
    rol: '',
  };

  constructor(
    private authService: AuthenticateService,
    private db: AngularFirestore,
    public actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    // public firestoreService: FirestoreService,
  ) {

  }
  ngOnInit() {
    this.profileUser()
  }

  profileUser(){
    this.authService.userDetails().subscribe(user => {
      if(user != null){
        this.db.collection('foundations').doc(user.uid).valueChanges().subscribe( foundationData => {
          this.infoFoundation = foundationData;
          if(this.infoFoundation != undefined){
            const foundationinfo : FoundationInterface = {
              uid: user.uid,
              name: this.infoFoundation.name,
              last_name: this.infoFoundation.last_name,
              name_foundation: this.infoFoundation.name_foundation,
              email: this.infoFoundation.email,
              photo: 'img.png',
              rol: 'Administrador'
            }
            this.foundation = foundationinfo;
          }
        })
      }
    });
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
          this.profileUser();
        }
      }, {
        text: 'Ver publicaciones',
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

  goToUpdateProfile(){
    this.navCtrl.navigateForward('/update-foundation');
  }
}
