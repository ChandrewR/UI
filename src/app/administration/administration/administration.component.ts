import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AdministrationService } from '../administration.service';
import { Router} from '@angular/router';
import { Userrole } from "../userrole.model";
//import { FileStatus } from '../filestatus.model';
import { Subscription,Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as XLSX from 'xlsx';

export interface FileStatus {
  _id: String,
  filename: String,
  processedby: String,
  processedon: Date,
  status: String
}

export interface Role {
  name: string;
}

type AOA = any[][];

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy {
  private _success = new Subject<string>();
  successMessage: string;
  private _danger = new Subject<string>();
  dangerMessage: string;
  status : boolean;
  fileName : String;
  ID : String;
  statusCheck : Boolean;

  data: AOA = [ [1, 2], [3, 4] ];
	//wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
	//fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      this._danger.next(`Multiple files selection not allowed. Select one file to process at a time`);
      //throw new Error('Cannot use multiple files');
    } else {
      this.fileName = target.files[0].name;
      console.log('check..'+target.files[0].name.search('.zip')+(target.files[0].name.search('.zip') > -1));
      if ((target.files[0].name.search('.zip') > -1)) {
        console.log('check..1');
        this.fileselected.reset();
        this.fileName = null;
        this._danger.next(`Select Excel or CSV file..`);
        
      } else {
        if((target.files[0].name.search('.xlsx') > -1) || (target.files[0].name.search('.xls') > -1) || (target.files[0].name.search('.csv') > -1)) {
        
          const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary',cellDates:true});
  
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws));
        console.log(this.data);
      };
      reader.readAsBinaryString(target.files[0]);
        } else {
          this.fileselected.reset();
          this.fileName = null;
          this._danger.next(`Select Excel or CSV file..`);
        }
      }
    }
    
	}

  userrole : Userrole[] = [];
  private userroleSub : Subscription;

  filestatus : FileStatus[] = [];
  private filestatusSub : Subscription;
  
  displayedColumns: string[] = ['associateID', 'role', 'action'];
  dataSource: MatTableDataSource<Userrole>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filestatusdisplayedColumns: string[] = ['filename', 'processedby', 'processedon', 'status'];
  filestatusdataSource: MatTableDataSource<FileStatus>;

  @ViewChild(MatPaginator) filestatuspaginator: MatPaginator;
  @ViewChild(MatSort) filestatussort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filestatusapplyFilter(filterValue: string) {
    this.filestatusdataSource.filter = filterValue.trim().toLowerCase();

    if (this.filestatusdataSource.paginator) {
      this.filestatusdataSource.paginator.firstPage();
    }
  }

  constructor(public authService : AuthService, public router : Router, public administrationService : AdministrationService ) { 

  }

  associateid = new FormControl('', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]);
  roleControl = new FormControl('', [Validators.required]);
  fileselected = new FormControl(null, {validators : [Validators.required]});
  toemail = new FormControl('', [Validators.required, Validators.email]);
  subject = new FormControl('', [Validators.required]);
  mailbody = new FormControl('', [Validators.required]);
  
  roles: Role[] = [
    {name: 'Admin'},
    {name: 'PMO'},
    {name: 'POC'}
  ];

  getToEmailMessage() {
    return this.associateid.hasError('required') ? 'You must enter email address in correct format' : '';
  }

  getSubjectMessage() {
    return this.associateid.hasError('required') ? 'You must enter subject of mail' : '';
  }

  getMailMessage() {
    return this.associateid.hasError('required') ? 'You must enter the message' : '';
  }

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

  sendEmail(form : NgForm) {
    //console.log(this.roleControl.value.name);
    this.administrationService.sendEmail(this.toemail.value,this.subject.value,this.mailbody.value);
    form.reset();
    this._success.next(`Sent mail successfully.`);

  }

  deleteUser(_id : String) {
    this.administrationService.deleteUser(_id);
    this._success.next(`User successfully deleted.`);
  }

  processfile(form : NgForm) {
    //console.log(this.roleControl.value.name);
    console.log('filename'+this.fileName);
    if (this.administrationService.processFile(this.data,this.fileName,this.ID)) {
      form.reset();
      this.fileselected.reset();
      this.fileName = null;
      this._success.next(`File has been successfully sent for processing..Check the status please`);
    } else {
      form.reset();
      this.fileselected.reset();
      this.fileName = null;
      this._danger.next(`File format seems to be wrong!. Try uploading a correct file..`);
    }
  }
  
  ngOnInit() {
    console.log("Administration check---->1");

    /* console.log(this.authService.getLoginStatus())
    
    if (this.authService.getLoginStatus() == false) {
      console.log("Administration check---->2");
      this.router.navigate(['']);
    } else { */
    console.log("Administration check---->3");
    this.ID = 'ADMIN1'
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = null);
    
    this._danger.subscribe((message) => this.dangerMessage = message);
    this._danger.pipe(
      debounceTime(3000)
    ).subscribe(() => this.dangerMessage = null);

    this.administrationService.getUsers();
    this.userroleSub = this.administrationService.getUserroleUpdateListener().subscribe(
      (userrole : Userrole[]) => {
        this.userrole = userrole;
        console.log('Test------>'+this.userrole);
        this.dataSource = new MatTableDataSource(this.userrole);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });

     this.administrationService.getFileStatus();
    this.filestatusSub = this.administrationService.getFileStatusUpdateListener().subscribe(
      (filestatus : FileStatus[]) => {
        this.filestatus = filestatus;
        console.log('File------>'+this.filestatus);
        this.filestatusdataSource = new MatTableDataSource(this.filestatus);
        this.filestatusdataSource.paginator = this.filestatuspaginator;
        this.filestatusdataSource.sort = this.filestatussort;
    }); 
    
  }

  ngOnDestroy() {
    /* if(this.userroleSub.unsubscribe)
    this.userroleSub.unsubscribe(); */
  }

}