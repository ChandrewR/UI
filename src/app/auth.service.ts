import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn : boolean = false;
  role : String;
  token : string;
  ID : String;
  private authStatusListener = new Subject<boolean>();
  private authRoleListener = new Subject<String>();
  private authIDListener = new Subject<String>();
  private tokenTimer : any;

  constructor(private http : HttpClient,private router : Router) { }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthRoleListener() {
    return this.authRoleListener.asObservable();
  }

  getIDListener() {
    return this.authIDListener.asObservable();
  }

  getLoginStatus() {
    return this.loggedIn;
  }

  setLoginStatus(status:boolean) {
    this.loggedIn = status;
  }

  setRole(role : String) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  setToken(token : string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  getID() {
    return this.ID;
  }

  setID(ID : String) {
    this.ID = ID;
  }

  async authenticate(associateID : String, password : String) {
    console.log("==========1");
    await this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result :{success : boolean,role : String, token : string, expiresIn : number}}>
      ('http://172.18.4.50:51806/authapi/v1/authenticate',{associateID,password}).toPromise()
    .then(data => {
      console.log("==========2");
      console.log(data)
      if(data.statusCode == 200) {

        if(data.result.token) {
        const expiresIn = data.result.expiresIn;
        this.setAuthTimer(expiresIn);
        this.setRole(data.result.role);
        this.setToken(data.result.token);
        this.setLoginStatus(true);
        this.setID(associateID);
        this.authStatusListener.next(true);
        this.authRoleListener.next(data.result.role);
        this.authIDListener.next(associateID);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveToken(data.result.token,expirationDate);
        console.log("==========3True");
        return new Promise<Number>(resolve => {
          resolve(1);
        });
        }
        
      } else {
        console.log("==========3False");
        this.setLoginStatus(false);
        return 0;
      }
    });
  }

  private setAuthTimer(duration : number) {
    this.tokenTimer = setTimeout(() => {
      this.clearToken();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getLocalAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.setLoginStatus(true);
      this.setAuthTimer(expiresIn /1000);
      this.authStatusListener.next(true);
    }
  }

  private getLocalAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }

    return {
      token : token,
      expirationDate : new Date(expirationDate)
    }
  }

  clearToken() {
    this.setToken(null);
    this.setLoginStatus(false);
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearSavedToken();
    this.router.navigate(['']);
  }

  private saveToken(token : string, expirationDate : Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());

  }

  private clearSavedToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  
}
