import { Component, OnInit } from '@angular/core';
import {FormControl, Validators,NgForm} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription,Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { AdministrationService } from '../administration/administration.service';
import { Router} from '@angular/router';
import { Userrole } from "../administration/userrole.model";

export interface Role {
  name: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _success = new Subject<string>();
  successMessage: string;
  private _danger = new Subject<string>();
  dangerMessage: string;
  //result : Boolean = true;
  hide = true;

  constructor(private router : Router, public authService : AuthService,public administrationService : AdministrationService) {

  }

  username = new FormControl('', [Validators.required,Validators.maxLength(6), Validators.minLength(6)]);
  password = new FormControl('', [Validators.required]);

  getUsernameErrorMessage() {
    return this.username.hasError('required') ? 'You must enter username' : 'Enter 6 digit ID';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter password' : '';
  }

  async login() {
    
    await this.authService.authenticate(this.username.value, this.password.value).then(result => {

      if (this.authService.getLoginStatus) {
        this.router.navigate(['dashboard']);
      } else {
        this._danger.next(`Login failed - Invalid user credentials.`);
      }
      
    });
    //console.log("---->Result:"+result);
   /*  if(this.authService.authenticate(this.username.value,this.password.value)) {
      console.log("==========4");
      this.authService.setLoginStatus(true);
      this.router.navigate(['dashboard']);
    } else {
      this._danger.next(`Login failed - Invalid user credentials.`);
    } */
      
/*     if (this.username.value == 'admin1' && this.password.value == 'admin') {
      this.authService.setLoginStatus(true);
      this.router.navigate(['dashboard']);
    } else {
      this._danger.next(`Login failed - Invalid user credentials.`);
    } */
  }

  associateid = new FormControl('', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]);
  roleControl = new FormControl('', [Validators.required]);
  fileselected = new FormControl(null, {validators : [Validators.required]});
  
  roles: Role[] = [
    {name: 'Admin'},
    {name: 'PMO'},
    {name: 'POC'}
  ];

  getAssociateIDErrorMessage() {
    return this.associateid.hasError('required') ? 'You must enter associate ID' : 'Enter 6 digit ID';
  }

  addUser(form : NgForm) {
    console.log(this.roleControl.value.name);
    this.administrationService.addUser(this.associateid.value,this.roleControl.value.name);

    this.administrationService.addAuthUser(this.associateid.value,this.roleControl.value.name,function(status, err) {

    });

    form.reset();
    this.roleControl.reset();
    this._success.next(`User successfully added.`);

  }

  ngOnInit() {

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = null);

    this._danger.subscribe((message) => this.dangerMessage = message);
    this._danger.pipe(
      debounceTime(2000)
    ).subscribe(() => this.dangerMessage = null);

    }
}
