import {Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { AuthService } from '../../auth.service';
import { ReportsService } from '../reports.service';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import Chart from 'chart.js';
import { Subscription,Subject } from 'rxjs';
import { DashboardService } from '../../dashboard/dashboard.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { debounceTime } from 'rxjs/operators';

export interface BU {
  name: string;
}

export interface Location {
  name: string;
}

export interface BUChart {
  _id: String,
  total: Number
}

export interface LocationChart {
  _id: String,
  total: Number
}

export interface Month {
  name: string;
}

export interface TopContributors {
  id: string;
  name: string;
  hours: string;
  frequency : string
}

/** Constants used to fill up our data base. */
const COLORS: string[] = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES: string[] = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  private _success = new Subject<string>();
  successMessage: string;
  private _danger = new Subject<string>();
  dangerMessage: string;

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
  id : String;
  role : String;
  dashbaordbus : Number = 0;
  private busSub : Subscription;
  buchart = [];
  location : Number = 0;
  private locationSub : Subscription;
  locationchart = [];
  buChart : BUChart[] = [];
  buChartLabel : String[] = [];
  buChartValue : Number[] = [];
  locationChart : LocationChart[] = [];
  locationChartLabel : String[] = [];
  locationChartValue : Number[] = [];

  topContributors : TopContributors[] = [];
  private topContributorsSub : Subscription;
  

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvas1') canvas1: ElementRef;
  @ViewChild('canvas2') canvas2: ElementRef;
  public context: CanvasRenderingContext2D;
  public context1: CanvasRenderingContext2D;
  public context2: CanvasRenderingContext2D;
  chart = [];
  chart1 = [];
  designationchart = [];

  displayedColumns: string[] = ['id', 'name', 'hours', 'frequency'];
  dataSource: MatTableDataSource<TopContributors>;
  panelOpenState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  minDate = new Date(2015, 0, 1);
  maxDate = new Date();

  eventid = new FormControl('', [Validators.required, Validators.minLength(12),Validators.maxLength(12)]);
  buControl = new FormControl('', [Validators.required]);
  locationControl = new FormControl('', [Validators.required]);
  monthControl = new FormControl('', [Validators.required]);

  public generatePDF()  
  {  
    var data = document.getElementById('pdf');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 200;   
      var pageHeight = 350;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 15;
      pdf.setFontSize(20);
      pdf.text('Cognizant Outreach Report',50, 10 );
      console.log("Heiiiiighhhtttt"+imgHeight);
      pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight)  
      pdf.save('outreach-report.pdf'); // Generated PDF   
    });  
  }  
  
  bus: BU[] = [
    {name: 'PACE'},
    {name: 'AVM'},
    {name: 'Insurance'},
    {name: 'HR'},
    {name: 'CIS'},
    {name: 'BU'}
  ];

  locations: Location[] = [
    {name: 'Chennai'},
    {name: 'Coimbatore'},
    {name: 'Pune'},
    {name: 'London'},
    {name: 'Singapore'},
    {name: 'Hong kong'}
  ];
  

  months: Month[] = [
    {name: 'January'},
    {name: 'February'},
    {name: 'March'},
    {name: 'April'},
    {name: 'May'},
    {name: 'June'},
    {name: 'July'},
    {name: 'August'},
    {name: 'September'},
    {name: 'October'},
    {name: 'November'},
    {name: 'December'},
  ];

  getEventIDErrorMessage() {
    return this.eventid.hasError('required') ? 'You must enter event ID' : 'Enter 12 characters ID';
  }


  constructor( public dashboardService: DashboardService,public authService : AuthService, public reportService : ReportsService, public router : Router ) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    
  }

  previewReport(form : NgForm) {
    this._danger.next(`Error occured in backend services.`);
  }

  getIDandRole() {
    this.id = this.authService.getID();
    this.role = this.authService.getRole(); 
    console.log(">>>>>>>>2222.5"+this.id);
    console.log(">>>>>>>>2222.5"+this.role);
  }

  async getParticipationMetrics() {
    console.log(">>>>>>>>>4444");
    await this.reportService.getParticipationMetrics(this.id, this.role);
    console.log(">>>>>>>>55555");
  }

  async ngOnInit() {

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(3000)
    ).subscribe(() => this.successMessage = null);

    this._danger.subscribe((message) => this.dangerMessage = message);
    this._danger.pipe(
      debounceTime(2000)
    ).subscribe(() => this.dangerMessage = null);

    console.log(">>>>>>>>>111");
    await this.getIDandRole();
    console.log(">>>>>>>>>333");
    console.log(this.id+""+this.role);
    //await this.reportService.getParticipationMetrics(this.id, this.role);
    await this.getParticipationMetrics();
    console.log(">>>>>>>>>66666");

    this.headcount = this.reportService.headcount;
    this.uniquevolunteers = this.reportService.uniquevolunteers;
    this.totalvolunteeringhours = this.reportService.totalvolunteeringhours;
    this.avgfrequencypervolunteer = this.reportService.avgfrequencypervolunteer;
    this.avghoursperassociate = this.reportService.avghoursperassociate;
    this.avghourspervolunteer = this.reportService.avghourspervolunteer;
    this.events = this.reportService.events;
    this.avghoursperevent = this.reportService.avghoursperevent;
    this.avgnoofvolunteersattendedperevent = this.reportService.avgnoofvolunteersattendedperevent;
    this.coverage = this.reportService.coverage;

    console.log("MyCheck----=======>>>>>"+this.headcount);

    this.reportService.getTopContributors(this.id,this.role);
    this.topContributorsSub = this.reportService.gettopcontributorsUpdateListener().subscribe(
      (topContributors : TopContributors[]) => {
        this.topContributors = topContributors;
        console.log('File------>'+this.topContributors);
        this.dataSource = new MatTableDataSource(this.topContributors);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }); 


  

    this.dashboardService.getBUs(this.id,this.role);
    this.busSub = this.dashboardService.getbusUpdateListener().subscribe(
          (bus : Number) => {
            this.dashbaordbus = bus;
    });

    this.dashboardService.getbusChartUpdateListener().subscribe((buChart : BUChart[]) => {
      this.buChart = buChart
      for(let i =0; i< this.buChart.length; i++ ) {
          this.buChartLabel.push(this.buChart[i]._id+" - "+this.buChart[i].total);
          console.log("BUChartlogger:"+this.buChart[i]._id);
          this.buChartValue.push(this.buChart[i].total);
      }

      this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
          this.buchart = new Chart(this.context, {
          type: 'doughnut',
          data: {
          //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          labels: this.buChartLabel,
          datasets: [{
            label: '',
            //data: [12, 19, 3, 5, 2, 3],
            data: this.buChartValue,
            // borderColor: [
            //     'rgba(255, 99, 132, 0.2)',
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            // ],
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 0
          }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                              }
                          }]
                      }
                  }
          });
  });

  this.dashboardService.getLocation(this.id,this.role);
    this.locationSub = this.dashboardService.getLocationUpdateListener().subscribe(
          (location : Number) => {
            this.location = location;
    });

    this.dashboardService.getlocationChartUpdateListener().subscribe((locationChart : LocationChart[]) => {
      this.locationChart = locationChart
        for(let i =0; i< this.locationChart.length; i++ ) {
          this.locationChartLabel.push(this.locationChart[i]._id+" - "+this.locationChart[i].total);
          this.locationChartValue.push(this.locationChart[i].total);
      }
      this.context1 = (<HTMLCanvasElement>this.canvas1.nativeElement).getContext('2d');
      this.locationchart = new Chart(this.context1, {
      type: 'pie',
      data: {
      //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      labels: this.locationChartLabel,
      datasets: [{
          label: '',
          //data: [12, 19, 3, 5, 2, 3],
          data: this.locationChartValue,
          // borderColor: [
          //     'rgba(255, 99, 132, 0.2)',
          //     'rgba(54, 162, 235, 0.2)',
          //     'rgba(255, 206, 86, 0.2)',
          //     'rgba(75, 192, 192, 0.2)',
          //     'rgba(153, 102, 255, 0.2)',
          //     'rgba(255, 159, 64, 0.2)'
          // ],
          backgroundColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255,99,132,1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 0
      }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
  });

 

    this.context2 = (<HTMLCanvasElement>this.canvas2.nativeElement).getContext('2d');
    this.designationchart = new Chart(this.context2, {
      type: 'bar',
      data: {
          labels: ["PA", "A", "SA", "M","SM", "D", "SD"],
          datasets: [{
              label: '# of associates partcipated',
              data: [6, 8, 4, 5, 4, 3, 2], 
              // borderColor: [
              //     'rgba(255, 99, 132, 0.2)',
              //     'rgba(54, 162, 235, 0.2)',
              //     'rgba(255, 206, 86, 0.2)',
              //     'rgba(75, 192, 192, 0.2)',
              //     'rgba(153, 102, 255, 0.2)',
              //     'rgba(255, 159, 64, 0.2)'
              // ],
              backgroundColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 0
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });

  /* this.context1 = (<HTMLCanvasElement>this.canvas1.nativeElement).getContext('2d');
  this.chart1 = new Chart(this.context1, {
    type: 'doughnut',
    data: {
        labels: ["PACE", "Insurance", "HR", "QA", "AVM", "CDM"],
        datasets: [{
            label: '% contibuted',
            data: [12, 19, 3, 5, 2, 3],
            // borderColor: [
            //     'rgba(255, 99, 132, 0.2)',
            //     'rgba(54, 162, 235, 0.2)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            // ],
            backgroundColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
}); */

    //}
  }
   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/* function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
} 
 */