import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      this.editForm = this.formBuilder.group({
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
    this.editForm = this.formBuilder.group({
      date_ex: [''],
      description: [''],
      image_user: [''],
      last_name: [''],
      name: [''],
      phone: [''],
      title: [''],
      id_user: [''],
      image: [''],
    })
  }

  onSubmit() {
    console.log('datos actu', this.editForm)
    this.dataPublication = this.formBuilder.group({
      date_ex: this.editForm.value.date_ex,
      description: this.editForm.value.description,
      image_user: this.editForm.value.image_user,
      last_name: this.editForm.value.last_name,
      name: this.editForm.value.name,
      phone: this.editForm.value.phone,
      title: this.editForm.value.title,
      id_user: this.editForm.value.id_user,
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
