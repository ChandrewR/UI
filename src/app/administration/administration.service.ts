import { Injectable } from '@angular/core';
//import { FileStatus } from "./filestatus.model";
import { Userrole } from "./userrole.model";
import { EventDetails } from './eventdetails.model';
import { EventSummary } from './eventsummary.model';
import { EventPOCDetails } from './eventpocdetails.model';
import { AssociateDetails } from './associatedetails.model';
import { HttpClient} from '@angular/common/http';
import { Subscription,Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface FileStatus {
  _id: String,
  filename: String,
  processedby: String,
  processedon: Date,
  status: String
}


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  /* private _success = new Subject<string>();
  successMessage: string;
  private _danger = new Subject<string>();
  dangerMessage: string; */

  private userrole : Userrole[] = [];
  private filestatus : FileStatus[] = [];
  private userroleUpdated = new Subject<Userrole[]>();
  private filestatusUpdated = new Subject<FileStatus[]>();

  constructor(private http: HttpClient) { 

    /* this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = null);
    
    this._danger.subscribe((message) => this.dangerMessage = message);
    this._danger.pipe(
      debounceTime(3000)
    ).subscribe(() => this.dangerMessage = null); */

  }

  getUsers() {
    this.http.get<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : {message : String, userrole : Userrole[]}}>('http://172.18.4.50:3500/administrationapi/v1/getusers')
    .subscribe( 
      (data) => {
        if (data.statusCode == 200) {
          this.userrole = data.result.userrole;
          this.userroleUpdated.next([...this.userrole]);
          return true;
        } else {
          return false;
        }
      });
  }

   getFileStatus() {

    this.http.get<
    { statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result : [{_id : String,
        filename : String,
        processedby : String,
        processedon : Date,
        status : String}] }>('http://172.18.4.50:64886/processfileapis/v1/getfilestatus')
        .subscribe(data => {
          if(data.statusCode == 200) {
            this.filestatus = data.result;
          console.log(data.result);
          console.log(this.filestatus);
          this.filestatusUpdated.next([...this.filestatus]);
          return true
          } else {
            return false;
          }
     

    });
  } 

  getUserroleUpdateListener() {
    return this.userroleUpdated.asObservable();
  }

  getFileStatusUpdateListener() {
    return this.filestatusUpdated.asObservable();
  }

  addUser(associateID : String, role : String) {
    const userrole : Userrole = { _id :  null, associateID : associateID, role : role};
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result :{success : boolean,message : String, _id : String}}>('http://172.18.4.50:3500/administrationapi/v1/adduser',userrole)
    .subscribe(data => {
      if(data.statusCode == 200) {
        const returnedId = data.result._id;
        userrole._id = returnedId;
        this.userrole.push(userrole);
        this.userroleUpdated.next([...this.userrole]);
        return true;
      } else {
        return false;
      }
    });
  }

  sendEmail(toemail : String, subject : String, mailbody :String) {
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result :{success : boolean,message : String}}>('http://172.18.4.50:3500/administrationapi/v1/sendemail',
      { toemail : toemail, subject : subject, mailbody : mailbody}).
    subscribe(data => {
      if(data.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    });
  }

  addAuthUser(associateID : String, role : String, callback) {
    const userrole : Userrole = { _id :  null, associateID : associateID, role : role};
    this.http.post<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result :{success : boolean,message : String, _id : String}}>('http://172.18.4.50:51806/authapi/v1/adduser',userrole)
    .subscribe(data => {
      if(data.statusCode == 200) {
        callback(true, false);
      } else {
        callback(false, true);
      }
    });
  }

  deleteUser(_id : String) {
    this.http.delete<{ statusCode : Number,
      statusMessage : String, 
      statusDescription : String, 
      result :{sucess : boolean, _id : String}}>('http://172.18.4.50:3500/administrationapi/v1/deleteuser?_id='+_id)
    .subscribe((data) => {
      if(data.statusCode == 200) {
      const removeDeletedUser = this.userrole.filter(user => user._id != _id);
      this.userrole = removeDeletedUser;
      this.userroleUpdated.next([...this.userrole]);
      return true;
      } else {
        return false;
      }
    });
  }

  processFile(data : any[][],fileName : String, ID : String) {
    var eventdetails : EventDetails[] = [];
    var eventsummary : EventSummary[] = [];
    var eventpocdetails : EventPOCDetails[] = [];
    var associatedetails : AssociateDetails[] = [];
    var fileType : string = null;

    if ( data[0]["Event ID"] != undefined && data[0]["Base Location"] != undefined &&
         data[0]["Council Name"] != undefined && data[0]["Event Name"] != undefined && 
         data[0]["Event Description"] != undefined && data[0]["Event Date"] != undefined &&
         data[0]["Employee ID"] != undefined && data[0]["Employee Name"] != undefined &&
         data[0]["Volunteer Hours"] != undefined && data[0]["Travel Hours"] != undefined &&
         data[0]["Lives Impacted"] != undefined && data[0]["Business unit"] != undefined &&
         data[0]["Status"] != undefined && data[0]["IIEP Category"] != undefined) {

          for(var i = 0; i < data.length; i++) {
            eventdetails.push({
              _id : null,
              eventid : data[i]["Event ID"],
              /* baseLocation : data[i]["Base Location"],
              councilName : data[i]["Council Name"],
              eventName : data[i]["Event Name"],
              eventDesc : data[i]["Event Description"], */
              eventdate : data[i]["Event Date"],
              employeeid : data[i]["Employee ID"],
              employeename : data[i]["Employee Name"],
              volunteerhours : data[i]["Volunteer Hours"],
              travelhours : data[i]["Travel Hours"],
              /* livesImpacted : data[i]["Lives Impacted"], */
              businessunit : data[i]["Business unit"],
              status : data[i]["Status"],
              iiepcategory : data[i]["IIEP Category"]
            });
          }

          console.log(eventdetails);
          //this._success.next(`File has been successfully sent for processing..Check the status please`);
          fileType = 'EventDetails';

          this.http.post<
          {statusCode : Number,
          statusMessage : String, 
          statusDescription : String, 
          result: {_id : String, date : Date, status : String}
          }>('http://172.18.4.50:64886/processfileapis/v1/processfile',{eventdetails,fileName,fileType,ID})
              .subscribe(data => {
              console.log(data);
              const returnedId = data.result._id;
              this.filestatus.push({_id: returnedId,
                filename: fileName,
                processedby: ID,
                processedon: data.result.date,
                status: data.result.status});
              this.filestatusUpdated.next([...this.filestatus]); 
              if(data.statusCode == 200) {
              return true;
              } else {
              return false;
              }
    });

          return true;

    } else if ( data[0]["Event ID"] != undefined && data[0]["Month"] != undefined && data[0]["Base Location"] != undefined &&
         data[0]["Beneficiary Name"] != undefined && data[0]["Venue Address"] != undefined && 
         data[0]["Council Name"] != undefined && data[0]["Project"] != undefined &&
         data[0]["Category"] != undefined && data[0]["Event Name"] != undefined &&
         data[0]["Event Description"] != undefined && data[0]["Event Date"] != undefined &&
         data[0]["Total no. of Volunteers"] != undefined && data[0]["Total Volunteer Hours"] != undefined &&
         data[0]["Total Travel Hours"] != undefined && data[0]["Overall Volunteering Hours"] != undefined &&
         data[0]["Lives Impacted"] != undefined && data[0]["Activity Type"] != undefined &&
         data[0]["Status"] != undefined && data[0]["POC ID"] != undefined &&
         data[0]["POC Name"] != undefined && data[0]["POC Contact Number"] != undefined ) {
          

          for(var i = 0; i < data.length; i++) {
            eventsummary.push({
              _id : null,
              eventid : data[i]["Event ID"],
              month : data[i]["Month"],
              baselocation : data[i]["Base Location"],
              beneficiaryname : data[i]["Beneficiary Name"],
              venueaddress : data[i]["Venue Address"],
              councilname : data[i]["Council Name"],
              project : data[i]["Project"],
              category : data[i]["Category"],
              eventname : data[i]["Event Name"],
              eventdesc : data[i]["Event Description"],
              eventdate : data[i]["Event Date"],
              totalnoofvolunteers : data[i]["Total no. of Volunteers"],
              totalnoofvolunteerhours : data[i]["Total Volunteer Hours"],
              totalnooftravelhours : data[i]["Total Travel Hours"],
              overallvolunteeringhrs :data[i]["Overall Volunteering Hours"],
              livesimpacted : data[i]["Lives Impacted"],
              activitytype : data[i]["Activity Type"],
              status : data[i]["Status"],
              pocid : data[i]["POC ID"],
              pocname : data[i]["POC Name"],
              poccontactnumber : data[i]["POC Contact Number"]
              
            });

            eventpocdetails.push({
              _id : null,
              eventid : data[i]["Event ID"],
              pocid : data[i]["POC ID"],
              pocname : data[i]["POC Name"],
              poccontactnumber : data[i]["POC Contact Number"]
            });
          }

          fileType = 'EventSummary';

          this.http.post<
          {statusCode : Number,
          statusMessage : String, 
          statusDescription : String, 
          result: {_id : String, date : Date, status : String}
          }>('http://172.18.4.50:64886/processfileapis/v1/processfile',{eventsummary,eventpocdetails,fileName,fileType,ID})
              .subscribe(data => {
              console.log(data);
              const returnedId = data.result._id;
              this.filestatus.push({_id: returnedId,
                filename: fileName,
                processedby: ID,
                processedon: data.result.date,
                status: data.result.status});
              this.filestatusUpdated.next([...this.filestatus]); 
              if(data.statusCode == 200) {
              return true;
              } else {
              return false;
              }
          });
          return true;
         }

     else if ( data[0]["Associate ID"] != undefined && data[0]["Name"] != undefined && data[0]["Designation"] != undefined &&
    data[0]["Location"] != undefined && data[0]["BU"] != undefined ) {

      for(var i = 0; i < data.length; i++) {
      associatedetails.push({
        _id : null,
        associateid : data[i]["Associate ID"],
        name : data[i]["Name"],
        designation : data[i]["Designation"],
        location : data[i]["LOcation"],
        bu : data[i]["BU"]
      });
    }
    fileType = 'AssociateDetails';

          this.http.post<
          {statusCode : Number,
          statusMessage : String, 
          statusDescription : String, 
          result: {_id : String, date : Date, status : String}
          }>('http://172.18.4.50:64886/processfileapis/v1/processfile',{associatedetails,fileName,fileType,ID})
              .subscribe(data => {
              console.log(data);
              const returnedId = data.result._id;
              this.filestatus.push({_id: returnedId,
                filename: fileName,
                processedby: ID,
                processedon: data.result.date,
                status: data.result.status});
              this.filestatusUpdated.next([...this.filestatus]); 
              if(data.statusCode == 200) {
              return true;
              } else {
                
              return false;
              }
          });
          
    } else {
      return false;
    }
    return true;

  }


}
