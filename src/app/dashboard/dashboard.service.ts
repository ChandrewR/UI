import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service'

export interface BU {
  _id: String,
  total: Number
}

export interface Location {
  _id: String,
  total: Number
}

export interface Project {
  _id: String,
  total: Number
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private authService : AuthService) { }

  private location : Number = 0;
  private locationUpdated = new Subject<Number>();
  private locationChart : BU[] = [];
  private locationChartUpdated = new Subject<Location[]>();
  private volunteers : Number = 0;
  private volunteersUpdated = new Subject<Number>();
  private volunteeringhrs : Number = 0;
  private volunteeringhrsUpdated = new Subject<Number>();
  private bus : Number = 0;
  private busUpdated = new Subject<Number>();
  private buChart : BU[] = [];
  private buChartUpdated = new Subject<BU[]>();
  private projectChart : Project[] = [];
  private projectChartUpdated = new Subject<Project[]>();

  async getVolunteers(id: String, role : String) {
   await this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,volunteers : Number}}>
      ('http://172.18.4.50/dashboardapi/v1/getvolunteers',{id, role})
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.volunteers = data.result.volunteers;
            this.volunteersUpdated.next(this.volunteers);
          } else {
            return this.volunteers;
          }
        });;
  }

  async getLocation(id: String, role : String) {
    console.log("lllllllllllll>>>>>>"+id);
    console.log("lllllllllllll>>>>>>"+role);
    await this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,location : Number, locationChart : [{_id : String, total : Number}]}}>
      ('http://172.18.4.50/dashboardapi/v1/getlocationdata',{id, role})
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.location = data.result.location;
            this.locationUpdated.next(this.location);
            this.locationChart = data.result.locationChart;
            this.locationChartUpdated.next([...this.locationChart]);
          } else {
            return this.location;
          }
        });;
  }

  getVolunteeringHrs(id: String, role : String) {
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,overallvolunteeringhrs : [{_id : String, total : Number}]}}>
      ('http://172.18.4.50/dashboardapi/v1/getoverallvolunteeringhrs',{id, role})
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.volunteeringhrs = data.result.overallvolunteeringhrs[0].total;
            this.volunteeringhrsUpdated.next(this.volunteeringhrs);
          } else {
            return this.volunteeringhrs;
          }
        });;
  }

  getBUs(id: String, role : String) {
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,bu : Number, buChart : [{_id : String, total : Number}]}}>
      ('http://172.18.4.50/dashboardapi/v1/getbudata', {
        id, role
      })
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.bus = data.result.bu;
            this.busUpdated.next(this.bus);
            this.buChart = data.result.buChart;
            this.buChartUpdated.next([...this.buChart]);
          } else {
            return this.bus;
          }
        });;
  }

  getProjects(id: String, role : String) {
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,project : Number, projectChart : [{_id : String, total : Number}]}}>
      ('http://172.18.4.50/dashboardapi/v1/getprojectdata',{id, role})
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.projectChart = data.result.projectChart;
            console.log("=====<<<<>>>>"+this.projectChart)
            this.projectChartUpdated.next([...this.projectChart]);
          } else {
            return this.projectChart;
          }
        });;
  }

  getLocationUpdateListener() {
    return this.locationUpdated.asObservable();
  }

  getVolunteersUpdateListener() {
    return this.volunteersUpdated.asObservable();
  }

  getVolunteeringHrsUpdateListener() {
    return this.volunteeringhrsUpdated.asObservable();
  }

  getbusUpdateListener() {
    return this.busUpdated.asObservable();
  }

  getbusChartUpdateListener() {
    return this.buChartUpdated.asObservable();
  }

  getprojectChartUpdateListener() {
    return this.projectChartUpdated.asObservable();
  }

  getlocationChartUpdateListener() {
    return this.locationChartUpdated.asObservable();
  }

}