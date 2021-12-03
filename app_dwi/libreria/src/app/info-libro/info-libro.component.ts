import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule ,FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {

  id: String = "";
  libro: any = [];
  public ismodelShown: boolean = false;
  constructor(private router: Router,private activatedRoute: ActivatedRoute,public _LibrosService: ServiceService,private fb: FormBuilder) { }

  RegistroFormGrup = this.fb.group({
    Producto: [''],
    Marca: [''],
    Precio: [''],
    Clave : [''],
    Cantidad : [''],
    email : ['']
  });


  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.id = params['id'];
      console.log(this.id)
      this._LibrosService.getLibro(this.id).subscribe(book => {
        this.libro = book;
        console.log(this.libro);
      },
      error => {

      });
      
    });
  }

  AddCart(){
    this.RegistroFormGrup.patchValue({Producto: this.libro.Producto})
    this.RegistroFormGrup.patchValue({Clave: this.libro.Clave})
    this.RegistroFormGrup.patchValue({Marca: this.libro.Marca})
    this.RegistroFormGrup.patchValue({Precio: this.libro.Precio})
    this.RegistroFormGrup.patchValue({Cantidad: this.libro.UnidadesDisponibles})
    this.RegistroFormGrup.patchValue({email: this._LibrosService.getUser()})

    //console.log(JSON.stringify(this.RegistroFormGrup.value));
    console.log(JSON.stringify(this.RegistroFormGrup.value));
     if(this.RegistroFormGrup.valid){
      this._LibrosService.putAddCart(this.RegistroFormGrup.value).subscribe(res => {
        console.log(res);
        alert('Guardado');
      });
      this.RegistroFormGrup.reset();
    }else if(!this.RegistroFormGrup.valid){
      alert('Error');
      console.log('Error');
    } 
  }

  home(){
      this.router.navigateByUrl("/home")
  }

  confirmar(){
    this.ismodelShown = false;
  }

  eliminarLibro(){
    console.log("eliminar libro");
    this._LibrosService.borrarLibro(this.id).subscribe(res => {
      this.router.navigate(['/home']);
    }, (err) => {
      console.log(err);
    })
  }

  cerrarModal(configuracion:boolean){
    this.ismodelShown = false;
    if(configuracion){
      console.log('Eliminar' + this.ismodelShown);
      this.eliminarLibro();
    }else{
      console.log('No elimar' + this.ismodelShown);
    }
  }
  Edit(){
    this.router.navigate(['/editar',this.id]);
  }
 Prestamo(){
    this.router.navigate(['/prestamo',this.id]);
  }
}

