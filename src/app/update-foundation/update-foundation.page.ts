import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoundationService } from '../services/foundation.service';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';

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

  editForm: FormGroup;
  id: any;
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
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.foundationService.getUser(this.id).subscribe((data) => {
      this.editForm = this.formBuilder.group({
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
    this.editForm = this.formBuilder.group({
      name: [''],
      last_name: [''],
      email: [''],
      image: [''],
      role: [''],
      name_foundation: [''],
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

  onSubmit() {
    this.dataFoundation = this.formBuilder.group({
      last_name: this.editForm.value.last_name,
      name: this.editForm.value.name,
      email: this.editForm.value.email,
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
