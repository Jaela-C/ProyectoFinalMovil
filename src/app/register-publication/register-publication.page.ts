import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { PublicationsService } from '../services/publications.service';

@Component({
  selector: 'app-register-publication',
  templateUrl: './register-publication.page.html',
  styleUrls: ['./register-publication.page.scss'],
})
export class RegisterPublicationPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';

  constructor(
    private navCtrl: NavController,
    private publicationService: PublicationsService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      
      title:new FormControl('', Validators.compose([
        Validators.required
      ])),
      name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z]+')
      ])),
      phone:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+')
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
      {type: 'pattern', message: 'Por favor ingrese un número de teléfono válido'}
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
  
  registerPublication(value){
    this.publicationService.registerPublication(value)
    .then(res => {
      console.log(res);
      this.errorMessage='';
      this.navCtrl.navigateForward('/publications');
    }, err => {
      this.errorMessage = err.message;
    }
    );
  }

}
