import { Component,OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import {FormControl, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import { SwUpdate } from '@angular/service-worker'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cognizant Outreach';
  loggedIn : boolean;

  constructor(public authService : AuthService, updates : SwUpdate) {
      updates.available.subscribe(event => {
        updates.activateUpdate().then(() => document.location.reload());
      })
  }

  ngOnInit() {
    //this.loggedIn = this.loginService.getLoginStatus();
    this.authService.autoAuthUser();
  }
  /* hide = true;
  loggedIn : boolean = false;

  constructor(private router : Router) {

  }

  username = new FormControl('', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]);
  password = new FormControl('', [Validators.required]);

  getUsernameErrorMessage() {
    return this.username.hasError('required') ? 'You must enter username' : 'Enter 6 digit ID';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter password' : '';
  }

  login() {
    if (this.username.value == 'admin1' && this.password.value == 'admin') {
      this.loggedIn = true;
      this.router.navigate(['dashboard']);
    }
  } */

}
