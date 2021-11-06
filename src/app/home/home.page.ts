import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  arrayInfo: {
    image: string;
  }[];
  constructor() {
    this.arrayInfo=[
      {
        'image': '../../assets/Inicio.png'
      },
      {
        'image': '../../assets/BrindarAyuda.png'
      },
      {
        'image': '../../assets/ComunicarseFundacion.png'
      },
      {
        'image': '../../assets/Publicaciones.png'
      },
      {
        'image': '../../assets/PerfilesUsuario.png'
      },
      {
        'image': '../../assets/PerfilUsuario.png'
      },
      {
        'image': '../../assets/PerfilAdministrador.png'
      }
    ]
  }

}
