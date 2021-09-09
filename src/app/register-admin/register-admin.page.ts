/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services/authentication.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.page.html',
  styleUrls: ['./register-admin.page.scss'],
})
export class RegisterAdminPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';
  imageURL: string;
  FormToSend: FormGroup;

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
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
  ) {

  }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z]+')
      ])),
      name_foundation:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z]+')
      ])),
      email:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
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
    'name_foundation':[
      {type: 'required', message: 'El nombre de la fundación es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un nombre válido'}
    ],
    // eslint-disable-next-line quote-props
    'email':[
      {type: 'required', message: 'El email es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un correo válido'}
    ],
    // eslint-disable-next-line quote-props
    'password':[
      {type: 'required', message: 'La contraseña es requerida'},
      {type: 'pattern', message: 'La contraseña debe tener como mínimo 8 caracteres'}
    ]
  };

  registerFoundation(value){
    console.log('fundaci', value)
    this.FormToSend = this.formBuilder.group({
      name: value.name,
      last_name: value.last_name,
      email: value.email,
      image: "",
      role: "REQUEST",
      name_foundation: value.name_foundation,
      file: this.imageURL
    })
    this.authService.registerFoundation(this.FormToSend.value, value)
    .then((res) => {
      console.log('registro fundación', res);
      this.errorMessage='';
      this.navCtrl.navigateForward('/publications');
    }, err => {
      this.errorMessage = err.message;
    }
    );
  }

  // Files
  uploadImage(event: FileList) {
    const file = event.item(0);

    // File validation
    if (file.type.split('/')[0] !== 'application') {
      console.log(file.type.split('/')[0])
      console.log('File type is not supported!');
      return;
    }

    this.isFileUploading = true;
    this.isFileUploaded = false;
    this.imgName = file.name;

    // // Storage path for user profile
    // const fileStoragePathProfile = `publications/${this.uid}_${file.name}`;

    // Storage path for publications
    const fileStoragePath = `request/${file.name}--${new Date}`;

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
  
  storeFilesFirebase(image) {
    this.imageURL = image;
    console.log('imagen', this.imageURL)
  }

  goToLoginPage(){
    this.navCtrl.navigateForward('/login');
  }

}
