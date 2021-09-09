import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { PublicationsService } from '../../services/publications.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticateService } from '../../services/authentication.service';
import { commentsfoundations } from 'src/app/models/commentsfoundations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-publicationsadmin',
  templateUrl: './publicationsadmin.component.html',
  styleUrls: ['./publicationsadmin.component.scss'],
})

export class PublicationsadminComponent implements OnInit {

  public publicationsadmin: any;

  public commentsList = [];
  public infoFoundation: any;
  public msg: string;
  public name_user: string;
  public id_user: string;
  public last_name: string;
  validations_form: FormGroup;

  public room: any;
  FormToSend: FormGroup;

  constructor(
    private navparamsfoundation: NavParams,
    private navCtrl: NavController,
    private modal: ModalController,
    private PublicationsService: PublicationsService,
    private authService: AuthenticateService,
    private db: AngularFirestore,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.authService.userDetails().subscribe(
      (user) => {
        if (user !== null) {
          this.PublicationsService.getPublicationFoundation(this.publicationsadmin.id).subscribe( roomFoundation => {
            this.room = roomFoundation;
          })
          this.publicationsadmin = this.navparamsfoundation.get('publicationsadmin')
        } else {
          this.navCtrl.navigateBack('');
        }
      },
      (err) => {
        console.log('err', err);
      }
    );

    this.validations_form = this.formBuilder.group({
      content:new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  closePublication(){
    this.modal.dismiss()
  }

  sendCommentFoundation(value){
    console.log('dadad', value)
    this.authService.userDetails().subscribe(user => {
      if(user != null){
          this.db.collection('foundations').doc(user.uid).get().subscribe( foundationInfo => {
            this.infoFoundation = foundationInfo.data()
              this.FormToSend = this.formBuilder.group({
                content: value.content,
                date: new Date(),
                id_user: user.uid,
                name_user: this.infoFoundation.name,
                last_name_user: this.infoFoundation.last_name,
              })
              this.PublicationsService.sendComment(this.FormToSend.value, this.publicationsadmin.id).then(() => {
                this.msg = '';
                this.FormToSend.reset();
              })
        });
      }
      else {
        console.log("sin sesión")
      }
    })
  }

}
