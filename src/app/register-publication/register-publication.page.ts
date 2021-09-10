import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PublicationsService } from '../services/publications.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticateService } from '../services/authentication.service';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
export interface PublicationInterface{
  date_ex: string;
  description: string;
  // image_user: string;
  last_name: string;
  name: any;
  phone: number;
  title: string;
  id_user: string;
  image: string;
}

@Component({
  selector: 'app-register-publication',
  templateUrl: './register-publication.page.html',
  styleUrls: ['./register-publication.page.scss'],
})
export class RegisterPublicationPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';
  uid: string;
  name: string;
  FormToSend: FormGroup;
  imageURL: string;

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
    private publicationService: PublicationsService,
    private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
    private authService: AuthenticateService,
    private db: AngularFirestore,
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;

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

    this.validations_form = this.formBuilder.group({
      
      title:new FormControl('', Validators.compose([
        Validators.required
      ])),
      name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-ñ]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-ñ]+')
      ])),
      phone:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[1-9]{1}[0-9]{8}')
      ])),
      // image: new FormControl('', Validators.compose([
      //   Validators.required
      // ])),
      description: new FormControl('', Validators.compose([
        Validators.required
      ])),
      date_ex: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  validation_messages={
    // eslint-disable-next-line quote-props
    'title':[
      {type: 'required', message: 'El título es requerido'},
    ],
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
    'phone':[
      {type: 'required', message: 'El número de teléfono es requerido'},
      //{type: 'pattern', message: 'Por favor ingrese un número de teléfono válido, el número no debe incluir cero'}
    ],
    // eslint-disable-next-line quote-props
    'description':[
      {type: 'required', message: 'La descripción es requerida'},
    ],
    // eslint-disable-next-line quote-props
    'date_ex':[
      {type: 'required', message: 'La fecha es requerida'},
    ]
  };

  onSubmit(value) {
    console.log('image', this.imageURL)
    console.log('uid', this.uid)
      console.log('registro', value)
      this.FormToSend = this.formBuilder.group({
        date_ex: value.date_ex,
        description: value.description,
        // image_user: string;
        last_name: value.last_name,
        name: value.name,
        phone: value.phone,
        title: value.title,
        id_user: this.uid,
        image: this.imageURL,
        comments: [new Array]
      });
      this.publicationService
        .registerPublication(this.FormToSend.value)
        .then(() => {
          this.FormToSend.reset();
          this.navCtrl.navigateForward('/publications');
        })
        .catch((error) => {
          console.log(error);
        });
  }
  
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

    // // Storage path for user profile
    // const fileStoragePathProfile = `publications/${this.uid}_${file.name}`;

    // Storage path for publications
    const fileStoragePath = `publications/${file.name}`;

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
  }

}
