import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard/dashboard.service'

export interface Designation {
  _id: String,
  total: Number
}

export interface TopContributors {
  id: string;
  name: string;
  hours: string;
  frequency : string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  headcount : Number = 0;
  uniquevolunteers : Number = 0;
  totalvolunteeringhours : Number = 0;
  totalvolunteers : Number = 0;
  coverage : Number = 0;
  avgfrequencypervolunteer : Number = 0;
  avghoursperassociate : Number = 0;
  avghourspervolunteer : Number = 0;
  events : Number = 0;
  avghoursperevent : Number = 0;
  avgnoofvolunteersattendedperevent : Number = 0;
  topcontributors : TopContributors[] = [];
  private topcontributorsUpdated = new Subject<TopContributors[]>();

  private designations : Number = 0;
  private designationsUpdated = new Subject<Number>();
  private designationsChart : Designation[] = [];
  private designationsChartUpdated = new Subject<Designation[]>();

  getHeadCount() {
    return this.headcount;
  }

  constructor(private http: HttpClient, private dashboardService : DashboardService) { }

  async getDesignations(id: String, role : String) {
    await this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String,designations : Number, designationsChart : [{_id : String, total : Number}]}}>
      ('http://172.18.4.50:4000/reportsapi/v1/getdesignations', {
        id, role
      })
      .subscribe( 
        (data: any) => {
          if (data.statusCode == 200) {
            this.designations = data.result.designations;
            this.designationsUpdated.next(this.designations);
            this.designationsChart = data.result.designationsChart;
            this.designationsChartUpdated.next([...this.designationsChart]);
          } else {
            return this.designations;
          }
        });;
  }

  gettopcontributorsUpdateListener() {
    return this.topcontributorsUpdated.asObservable();
  }

  async getTopContributors(id: String, role : String) {

    await this.http.post<
    { statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : 
        { message : String,
          data : [
          {
          _id : {name : string, id :string}
          ,total : string,
          frequency : string
          }] 
          }
      }>('http://172.18.4.50/dashboardapi/v1/gettopcontributors',{id,role})
        .subscribe(data => {
          if(data.statusCode == 200) {
            //this.filestatus = data.result;

            console.log(data.result.data.length);
            this.topcontributors = [];
           for (var i =0 ; i< data.result.data.length; i++) {
            this.topcontributors.push(
              {
                id: data.result.data[i]._id.id,
                name: data.result.data[i]._id.name,
                hours: data.result.data[i].total,
                frequency : data.result.data[i].frequency
              }
            );
          }
          this.topcontributorsUpdated.next([...this.topcontributors]);
          return true
          } else {
            return false;
          }
    });
  } 


  async getParticipationMetrics(id: String, role : String) {
    await this.http.post<{ statusCode : Number,
       statusMessage : String, 
       statusDescription : String, 
       result : {message : String,
                headcount : Number,
                uniquevolunteers : Number,
                totalvolunteeringhours : Number,
                avgfrequencypervolunteer : Number,
                avghoursperassociate : Number,
                avghourspervolunteer : Number,
                events : Number,
                avghoursperevent : Number,
                avgnoofvolunteersattendedperevent : Number,
                coverage : Number}}>
       ('http://172.18.4.50:4000/reportsapi/v1/getparticipationmetrics',{id, role})
       .toPromise().then( 
         (data: any) => {
           if (data.statusCode == 200) {
             this.headcount = data.result.headcount;
             this.uniquevolunteers = data.result.uniquevolunteers;
             this.totalvolunteeringhours = data.result.totalvolunteeringhours;
             this.avgfrequencypervolunteer = data.result.avgfrequencypervolunteer;
             this.avghoursperassociate = data.result.avghoursperassociate;
             this.avghourspervolunteer = data.result.avghourspervolunteer;
             this.events = data.result.events;
             this.avghoursperevent = data.result.avghoursperevent;
             this.avgnoofvolunteersattendedperevent = data.result.avgnoofvolunteersattendedperevent;
             this.coverage = data.result.coverage;
             console.log("In report service===>>>"+this.headcount);
             new Promise<Number>(resolve => {
              resolve(1);
            });

           } else {
             return false;
           }
         });;
   }
}
