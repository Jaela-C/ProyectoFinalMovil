import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { PublicationsService } from '../services/publications.service';

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-update-publication',
  templateUrl: './update-publication.page.html',
  styleUrls: ['./update-publication.page.scss'],
})
export class UpdatePublicationPage implements OnInit {

  editForm: FormGroup;
  validations_form: FormGroup;
  dataPublication: FormGroup
  id: any;
  imageURL: string

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
    private publicationService: PublicationsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.publicationService.getPublicationID(this.id).subscribe((data) => {
      console.log('datos publiact', data)
      this.validations_form = this.formBuilder.group({
        date_ex: data['date_ex'],
        description: data['description'],
        image_user: data['image_user'],
        last_name: data['last_name'],
        name: data['name'],
        phone: data['phone'],
        title: data['title'],
        id_user: data['id_user'], 
        image: data['image'],
      })
    });

  }

  ngOnInit() {

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
      {type: 'pattern', message: 'Por favor ingrese un número de teléfono válido, el número no debe incluir cero'}
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
    console.log('datos actu', this.editForm)
    this.dataPublication = this.formBuilder.group({
      date_ex: value.date_ex,
      description: value.description,
      image_user: value.image_user,
      last_name: value.last_name,
      name: value.name,
      phone: value.phone,
      title: value.title,
      id_user: value.id_user,
      image: this.imageURL,
    })
    this.publicationService.update(this.id, this.dataPublication.value)
    .then(() => {
      this.dataPublication.reset();
    })
    .catch((error) => {
      console.log(error)
    })
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

    // Storage path for publications
    const fileStoragePath = `publications/${file.name}--${new Date}`;

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
