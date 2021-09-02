import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  editForm: FormGroup;
  id: any;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUser(this.id).subscribe((data) => {
      this.editForm = this.formBuilder.group({
        name: data['name'],
        last_name: data['last_name'],
        email: data['email'],
        image: data['image'],
        role: data['role'],
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
    })    
  }

  onSubmit() {
    this.userService.update(this.id, this.editForm.value)
  }
}
