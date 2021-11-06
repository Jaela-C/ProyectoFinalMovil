import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';


export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  validations_form: FormGroup;
  dataUser: FormGroup;
  id: any;
  uid: string;
  imageURL: string;
  userData: any;

  //Files
  fileUploadTask: AngularFireUploadTask;

  // Upload progress
  percentageVal: Observable<number>;

  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;

  // Uploaded File URL
  UploadedImageURL: Observable<string>;

  // Uploaded image collection
  files: Observable<imgFile[]>;

  // Image specifications
  imgName: string;
  imgSize: number;

  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthenticateService,
    public alertController: AlertController,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.authService.userDetails().subscribe(
      (user) => {
        if (user !== null) {
          this.uid = user.uid;
        } else {
          this.navCtrl.navigateBack('');
        }
      },
      (err) => {
        console.log('err', err);
      }
    );


    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUser(this.id).subscribe((data) => {
      this.userData = data;
      this.validations_form = this.formBuilder.group({
        role: data['role'],
        name:new FormControl(data['name'], Validators.compose([
          Validators.pattern('^[a-zA-Z]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
        ])),
        last_name:new FormControl(data['last_name'], Validators.compose([
          Validators.pattern('^[a-zA-Z]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
        ])),
        email:new FormControl(data['email'], Validators.compose([
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z]+$')
        ]))
      });
    });

    this.validations_form = this.formBuilder.group({
      name:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      email:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z]+$')
      ]))
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  validation_messages={
    // eslint-disable-next-line quote-props
    'name':[
      {type: 'required', message: 'El nombre es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un nombre válido'}
    ],
    // eslint-disable-next-line quote-props
    'last_name':[
      {type: 'required', message: 'El apellido es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un apellido válido'}
    ],
    // eslint-disable-next-line quote-props
    'email':[
      {type: 'required', message: 'El email es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un correo válido'}
    ],
  };

  // Image files
  uploadImage(event: FileList) {
    const file = event.item(0);

    // Image validation
    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!');
      return;
    }

    this.isFileUploading = true;
    this.isFileUploaded = false;
    this.imgName = file.name;

    // Storage path for profile
    const fileStoragePath = `usersimage/${this.uid}`;

    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);

    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
          (resp) => {
            this.storeFilesFirebase(resp);
            this.isFileUploading = false;
            this.isFileUploaded = true;
          },
          (error) => {
            console.log(error);
          }
        );
      }),
      tap((snap) => {
        this.imgSize = snap.totalBytes;
      })
    );
  }

  async presentToastUpdate() {
    const toast = await this.toastController.create({
      message: 'La información ha sido actualizada',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentToastCancel() {
    const toast = await this.toastController.create({
      message: 'Los cambios no fueron guardados',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentToastMessage() {
    const toast = await this.toastController.create({
      message: 'Para actualizar la información es necesario volver a iniciar sesión',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentAlert(value) {
    const alert = await this.alertController.create({
      header: 'Actualizar perfil',
      message: '¿Desea guardar los cambios?',
      buttons: [{
        text: 'Sí',
        handler: () => {
          this.onSubmit(value);
          this.presentToastUpdate();
        }
      }, {
        text: 'No',
        handler: () => {
          this.router.navigate(['/profile-user']);
          this.presentToastCancel();
        }
      }]
    });

    await alert.present();
  }

  storeFilesFirebase(image) {
    this.imageURL = image;
  }

  onSubmit(value) {
    if(this.imageURL === undefined){
      this.dataUser = this.formBuilder.group({
        last_name: value.last_name,
        name: value.name,
        email: value.email,
        image: this.userData.image,
      });
    }
    if(this.imageURL !== undefined){
      this.dataUser = this.formBuilder.group({
        last_name: value.last_name,
        name: value.name,
        email: value.email,
        image: this.imageURL,
      });
    }
    this.userService.update(this.id, this.dataUser.value)
    .then(() => {
      this.dataUser.reset();
    })
    .catch((error) => {
      if(error.code === 'auth/requires-recent-login'){
        this.presentToastMessage();
      }
      console.log(error);
    });
  }
}
