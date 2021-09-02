import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoundationService } from '../services/foundation.service';

@Component({
  selector: 'app-update-foundation',
  templateUrl: './update-foundation.page.html',
  styleUrls: ['./update-foundation.page.scss'],
})
export class UpdateFoundationPage implements OnInit {

  editForm: FormGroup;
  id: any;

  constructor(
    private foundationService: FoundationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

  onSubmit() {
    this.foundationService.update(this.id, this.editForm.value)
  }

}
