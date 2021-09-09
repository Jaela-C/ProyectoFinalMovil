import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoundationService } from '../services/foundation.service';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-update-foundation',
  templateUrl: './update-foundation.page.html',
  styleUrls: ['./update-foundation.page.scss'],
})
export class UpdateFoundationPage implements OnInit {

  validations_form: FormGroup;
  id: any;
  uid: string;
  imageURL: string
  dataFoundation: FormGroup;

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
    private foundationService: FoundationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private afStorage: AngularFireStorage,
    public formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthenticateService,
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.foundationService.getUser(this.id).subscribe((data) => {
      this.validations_form = this.formBuilder.group({
        name: data['name'],
        last_name: data['last_name'],
        email: data['email'],
        image: data['image'],
        role: data['role'],
        name_foundation: data['name_foundation'],
      })
    });

  }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-ñ]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-ñ]+')
      ])),
      name_foundation:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-ñ]+')
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
      name: [''],
      last_name: [''],
      email: [''],
      image: [''],
      role: [''],
      name_foundation: [''],
    })    
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
    const fileStoragePath = `foundations/${this.uid}`;

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

  onSubmit(value) {
    this.dataFoundation = this.formBuilder.group({
      last_name: value.last_name,
      name: value.name,
      email: value.email,
      image: this.imageURL,
    })
    this.foundationService.update(this.id, this.dataFoundation.value)
    .then(() => {
      this.dataFoundation.reset();
    })
    .catch((error) => {
      console.log(error)
    })
  }

}
