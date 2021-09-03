import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-update-publication',
  templateUrl: './update-publication.page.html',
  styleUrls: ['./update-publication.page.scss'],
})
export class UpdatePublicationPage implements OnInit {

  editForm: FormGroup;
  id: any;

  constructor(
    private publicationService: PublicationsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.publicationService.getPublicationID(this.id).subscribe((data) => {
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
    this.publicationService.update(this.id, this.editForm.value)
  }

}
