/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticateService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage ='';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastController: ToastController,
  ) {

  }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_.+-]+.[a-zA-Z]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ])),
    });
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  validation_messages={
    // eslint-disable-next-line quote-props
    'email':[
      {type: 'required', message: 'El email es requerido'},
      {type: 'pattern', message: 'Por favor ingrese un correo válido'}
    ],
    // eslint-disable-next-line quote-props
    'password':[
      {type: 'required', message: 'La contraseña es requerida'},
      {type: 'pattern', message: 'La contraseña debe tener como mínimo 8 caracteres'}
    ]
  };

  loginUser(value){
    this.authService.loginUser(value)
    .then(res => {
      console.log(res);
      this.errorMessage='';
      this.navCtrl.navigateForward('/publications');
    }, err => {
      if(err.code === 'auth/wrong-password'){
        this.errorMessage = 'La contraseña es incorrecta';
      }
      if(err.code === 'auth/invalid-email'){
        this.errorMessage = 'El correo electrónico es incorrecto';
      }
      if(err.code === 'auth/user-not-found'){
        this.errorMessage = 'Usuario no encontrado o eliminado';
      }
    }
    );
  }

  goToTypePage(){
    this.navCtrl.navigateForward('/type');
  }
}
