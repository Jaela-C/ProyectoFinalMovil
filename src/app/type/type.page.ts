import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-type',
  templateUrl: './type.page.html',
  styleUrls: ['./type.page.scss'],
})
export class TypePage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  goToLoginPage(){
    this.navCtrl.navigateForward('/login');
  }
  goToRegisterPage(){
    this.navCtrl.navigateForward('/register');
  }
  goToRegisterFoundationPage(){
    this.navCtrl.navigateForward('/register-admin');
  }
}
