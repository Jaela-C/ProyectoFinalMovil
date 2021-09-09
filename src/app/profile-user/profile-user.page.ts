import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/models/user';
import { FormGroup } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
// import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
})
export class ProfileUserPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';
  infoUser: any;
  uid: string;

  user: UserInterface = {
    uid: '',
    name: '',
    last_name: '',
    email: '',
    image: '',
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
    this.profileUser();
  }

  profileUser(){
    this.authService.userDetails().subscribe(user => {
      if(user != null){
        this.db.collection('users').doc(user.uid).valueChanges().subscribe( userData => {
          this.infoUser = userData;
          if(this.infoUser != undefined){
            const userinfo : UserInterface = {
              uid: user.uid,
              name: this.infoUser.name,
              last_name: this.infoUser.last_name,
              email: this.infoUser.email,
              image: this.infoUser.image,
              rol: 'Usuario',
            }
            this.user = userinfo;
          }
        });
      }
    });
  }

  logoutUser(){
    this.authService.logoutUser();
  }

  viewPublication(){
    this.authService.viewPublication();
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

  goToUpdateProfile(){
    this.navCtrl.navigateForward('/update-user');
  }
}
