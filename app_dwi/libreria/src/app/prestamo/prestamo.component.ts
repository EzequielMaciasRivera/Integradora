import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule ,FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from '../service/user';
import { ServiceService } from '../service/service.service';
import { IPayPalConfig,ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.css']
})
export class PrestamoComponent implements OnInit {
  id: String = "";
  libro: any = [];
  carts: any = [];
  total: any = "";
  details: any;
  fecha: any;
  public ismodelShown: boolean = false;

  public payPalConfig?: IPayPalConfig;
  

  RegistroFormGrup = this.fb.group({
    Producto: ['',[Validators.required]],
    email: ['',[Validators.required]],
    Marca: ['',[Validators.required]],
    Fecha_inicio: ['',[Validators.required]],
    Fecha_fin : ['',[Validators.required]],
    Precio : ['',[Validators.required]],
    Clave: ['',[Validators.required]],
    RutaDeImagen: ['',[Validators.required]]

  });

  constructor(private _librosService: ServiceService,private router: Router,private activatedRoute: ActivatedRoute,private _LibrosService: ServiceService,private fb: FormBuilder) {
    this.initConfig();
   }

  ngOnInit(): void {
    this.getItems();
    
  }

  get form(){return this.RegistroFormGrup.controls}


  getItems(){
    this._librosService.getCart().subscribe(res =>{
      this.carts = res.cart;
      this._librosService.getTotal().subscribe(res =>{
        this.total = res[0].total;
        console.log(res);
      })
      console.log(this.carts);
    })
  }


  fechaInicio(start: any){
    console.log(start);
    this.RegistroFormGrup.patchValue({Fecha_inicio: start})
  }
  fechaFin(End: any){
    console.log(End);
    this.RegistroFormGrup.patchValue({Fecha_fin: End})

  }
  
  AddPrestamo(){
    this.RegistroFormGrup.patchValue({Producto: this.libro.Producto})
    this.RegistroFormGrup.patchValue({Clave: this.libro.Clave})
    this.RegistroFormGrup.patchValue({Marca: this.libro.Marca})
    this.RegistroFormGrup.patchValue({Precio: this.libro.Precio})
    this.RegistroFormGrup.patchValue({RutaDeImagen: this.libro.RutaDeImagen})
    this.RegistroFormGrup.patchValue({email: this._LibrosService.getUser()})

    //console.log(JSON.stringify(this.RegistroFormGrup.value));
    console.log(JSON.stringify(this.RegistroFormGrup.value));
     if(this.RegistroFormGrup.valid){
      this._LibrosService.putPrestamo(this.RegistroFormGrup.value).subscribe(res => {
        console.log(res);
        alert('Guardado');
        this.router.navigateByUrl('/home');
      });
      this.RegistroFormGrup.reset();
    }else if(!this.RegistroFormGrup.valid){
      alert('Error');
      console.log('Error');
    } 
  }

  RegresarALibro(){
    this.router.navigate(['/info',this.id]);
  }

  home(){
    this.router.navigateByUrl('/home');
  }


  public initConfig(): void {
    this.payPalConfig = {
        currency: 'MXN',
        clientId: 'AVBPzKIIEcJqIvPp_M3xZvswzc37560x1z17XBamFgJz7Kpaq0R6n6g_XUbOQ7yAeSHYYlElklmtxyQS',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'MXN',
                    value: this.total.toString(),
                    breakdown: {
                        item_total: {
                            currency_code: 'MXN',
                            value: this.total.toString()
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'MXN',
                        value: this.total.toString(),
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            /* this.showSuccess = true; */
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            /* this.showCancel = true; */

        },
        onError: err => {
            console.log('OnError', err);
            /* this.showError = true; */
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            /* this.resetStatus(); */
        },
    };
}


}
