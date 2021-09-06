import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  arrayInfo: {
    image: string
    text: string
  }[];
  constructor() {
    this.arrayInfo=[
      {
        "image": "../../assets/logonav.png",
        "text": ""
      },
      {
        "image": "../../assets/Comuni.png",
        "text": "Las fundaciones de la ciudad de Quito necesitan la colaboración de todos los ciudadanos para seguir brindando ayuda a las personas de bajos recursos."
      },
      {
        "image": "../../assets/ChatUsers.png",
        "text": "Si decides ayudar a una fundación, puedes realizar comentarios para pedir información o comunicarte directamente."
      },
      {
        "image": "../../assets/ViewPublication.png",
        "text": "Las fundaciones publican sus principales necesidades, las cuales pueden ser atendidaspor cualquier persona en todo momento."
      },
      {
        "image": "../../assets/Profile2.png",
        "text": "Los usuarios pueden registrarse directamente en el sitio, para esto es necesario escoger el tipo de perfil al que pertenecen."
      },
      {
        "image": "../../assets/Profile.png",
        "text": "El perfil de usuario permite visualizar todas las publicaciones registradas para posteriormente brindar ayuda."
      },
      {
        "image": "../../assets/Coment.png",
        "text": "El perfil de administrador permite que las fundaciones registren sus principales necesidades."
      }
    ]
  }

}
