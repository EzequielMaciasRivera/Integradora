import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libro-card',
  templateUrl: './libro-card.component.html',
  styleUrls: ['./libro-card.component.css']
})
export class LibroCardComponent implements OnInit {

  @Input() libro: any = {};
  @Input() index: number = 0;
  
  @Output() libroSeleccionado: EventEmitter<number>;

  public imagen: string = "../../assets/images/wp3797698.jpg";
  constructor(private router: Router) {
    this.libroSeleccionado = new EventEmitter();
   }

  ngOnInit(): void {
  }

  verLibro(){
    this.router.navigate(['/info',this.libro._id]);
  }


  limitador (str: string){


    const fin = str.substring(0, 20);
    
    if (str.length > 20){
      return fin + "..."
    }else
    {
      return fin
    }
    
  }

  a(){
    console.log("Funcion agregar al carro")
  }

}
