/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      last_name:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-ZñÁÉÍÓÚ]+[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+')
      ])),
      email:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^[a-zA-Z0-9ñÁÉÍÓÚ]+[0-9A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ-ñÁÉÍÓÚ]+'),
        Validators.required
      ])),
    });
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
    'email':[
      {type: 'required', message: 'El email es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un correo válido'}
    ],
    // eslint-disable-next-line quote-props
    'password':[
      {type: 'required', message: 'La contraseña es requerida'},
      {type: 'minLength', message: 'La contraseña debe tener como mínimo 8 caracteres'},
      {type: 'pattern', message: 'La contraseña sólo puede contener números y letras'}
    ]
  };

  registerUser(value){
    this.authService.registerUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage='';
      this.navCtrl.navigateForward('/publications');
    }, err => {
      this.errorMessage = err.message;
    }
    );
  }

  goToLoginPage(){
    this.navCtrl.navigateForward('/login');
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
