import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/models/user';
import { FoundationInterface } from '../models/foundation';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, ActionSheetController } from '@ionic/angular';
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
  infoFoundation: any;
  uid: string;
  name: string;
  last_name: string;
  email: string;
  photo: string;
  password: string;
  rol: string;

  user: UserInterface = {
    uid: '',
    name: '',
    last_name: '',
    email: '',
    photo: '',
    rol: '',
  };

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
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    public actionSheetController: ActionSheetController,
    // public firestoreService: FirestoreService,
  ) {

  }
  ngOnInit() {
    this.profileUser();
    console.log(this.profileUser())
  }

  profileUser(){
    this.authService.userDetails().subscribe(user => {
      this.db.collection('users').doc(user.uid).valueChanges().subscribe( userData => {
        this.infoUser = userData;
        console.log('asdads', this.infoUser)
         if(this.infoUser == undefined){
          this.db.collection('foundations').doc(user.uid).valueChanges().subscribe( foundationData => {
            this.infoFoundation = foundationData;
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
          })
         }
         else {
          const userinfo : UserInterface = {
            uid: user.uid,
            name: this.infoUser.name,
            last_name: this.infoUser.last_name,
            email: this.infoUser.email,
            photo: 'img.png',
            rol: 'Usuario'
          }
         this.user = userinfo;
         }
      })
    });
  }

  profileFoundation(){
    this.authService.userDetails().subscribe(user => {
      this.uid = user.uid;
      this.db.collection('foundations').doc(user.uid).valueChanges().subscribe( user => {
        
        this.infoUser = user;
         const userinfo : UserInterface = {
            uid: this.uid,
            name: this.infoUser.name,
            last_name: this.infoUser.last_name,
            email: this.infoUser.email,
            photo: 'img.png',
            rol: 'Administrador'
         }
         this.user = userinfo;
      })
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

}
