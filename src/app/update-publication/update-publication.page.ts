/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
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
  dataPublication: FormGroup;
  id: any;
  imageURL: string;
  publicationData: any;

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
    public alertController: AlertController,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.publicationService.getPublicationID(this.id).subscribe((data) => {
      this.publicationData = data;
      this.validations_form = this.formBuilder.group({
        title:new FormControl(data['title'], Validators.compose([
          Validators.pattern('^[a-zA-ZñÁÉÍÓÚ][ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñ0-9ÁÉÍÓÚ]+')
        ])),
        id_user: data['id_user'],
        name:new FormControl(data['name'], Validators.compose([
          Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
        ])),
        last_name:new FormControl(data['last_name'], Validators.compose([
          Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
        ])),
        phone:new FormControl(data['phone'], Validators.compose([
          Validators.pattern('^[1-9]{1}[0-9]{8}')
        ])),
        // image: new FormControl('', Validators.compose([
        //   Validators.required
        // ])),
        description: new FormControl(data['description'], Validators.compose([
          Validators.pattern('^[a-zA-ZñÁÉÍÓÚ][ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñ0-9ÁÉÍÓÚ]+')
        ])),
        date_ex: new FormControl(data['date_ex'], Validators.compose([

        ])),
      })
    });

    this.validations_form = this.formBuilder.group({
      title:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ][ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñ0-9ÁÉÍÓÚ]+')
      ])),
      name:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      phone:new FormControl('', Validators.compose([
        Validators.pattern('^[1-9]{1}[0-9]{8}')
      ])),
      // image: new FormControl('', Validators.compose([
      //   Validators.required
      // ])),
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ][ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñ0-9ÁÉÍÓÚ]+')
      ])),
      date_ex: new FormControl('', Validators.compose([
      ])),
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  validation_messages={
    // eslint-disable-next-line quote-props
    'title':[
      {type: 'pattern', message: 'El título sólo puede contener letras'}
    ],
    // eslint-disable-next-line quote-props
    'name':[
      {type: 'pattern', message: 'Por favor ingrese un nombre válido'}
    ],
    // eslint-disable-next-line quote-props
    'last_name':[
      {type: 'pattern', message: 'Por favor ingrese un apellido válido'}
    ],
    // eslint-disable-next-line quote-props
    'phone':[
      {type: 'pattern', message: 'Por favor ingrese un número de teléfono válido, el número no debe incluir cero'}
    ],
    // eslint-disable-next-line quote-props
    'description':[
      {type: 'pattern', message: 'La descripción sólo puede contener letras'}
    ],
    // eslint-disable-next-line quote-props
    'date_ex':[
      {type: 'pattern', message: 'El título sólo puede contener letras'}
    ]
  };

  async presentToastUpdate() {
    const toast = await this.toastController.create({
      message: 'La publicación ha sido actualizada',
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

  async presentAlert(value) {
    const alert = await this.alertController.create({
      header: 'Actualizar publicación',
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
          this.router.navigate(['/publications']);
          this.presentToastCancel();
        }
      }]
    });

    await alert.present();
  }

  onSubmit(value) {
    if(this.imageURL === undefined && value.date_ex === 'Invalid date'){
      console.log('fecha', value.date_ex);
      this.dataPublication = this.formBuilder.group({
        date_ex: this.publicationData.date_ex,
        description: value.description,
        image_user: value.image_user,
        last_name: value.last_name,
        name: value.name,
        phone: value.phone,
        title: value.title,
        id_user: value.id_user,
        image: this.publicationData.image,
      });
    }
    if(this.imageURL === undefined && value.date_ex !== 'Invalid date'){
      console.log('fecha', value.date_ex);
      this.dataPublication = this.formBuilder.group({
        date_ex: moment(value.date_ex).format('YYYY-MM-DD'),
        description: value.description,
        image_user: value.image_user,
        last_name: value.last_name,
        name: value.name,
        phone: value.phone,
        title: value.title,
        id_user: value.id_user,
        image: this.publicationData.image,
      });
    }
    if(this.imageURL !== undefined && value.date_ex !== 'Invalid date'){
      this.dataPublication = this.formBuilder.group({
        date_ex: moment(value.date_ex).format('YYYY-MM-DD'),
        description: value.description,
        image_user: value.image_user,
        last_name: value.last_name,
        name: value.name,
        phone: value.phone,
        title: value.title,
        id_user: value.id_user,
        image: this.imageURL,
      });
    }
    if(this.imageURL !== undefined && value.date_ex === 'Invalid date'){
      this.dataPublication = this.formBuilder.group({
        date_ex: this.publicationData.date_ex,
        description: value.description,
        image_user: value.image_user,
        last_name: value.last_name,
        name: value.name,
        phone: value.phone,
        title: value.title,
        id_user: value.id_user,
        image: this.imageURL,
      });
    }
    this.publicationService.update(this.id, this.dataPublication.value)
    .then(() => {
      this.dataPublication.reset();
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

    // Storage path for publications
    const fileStoragePath = `publications/${file.name}--${new Date()}`;

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
