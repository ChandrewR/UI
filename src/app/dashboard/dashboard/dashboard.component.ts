import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ReportsService } from '../../reports/reports.service'
import { Router} from '@angular/router';
import Chart from 'chart.js';
import { DashboardService } from '../dashboard.service'
import { Subscription,Subject } from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormControl, Validators, NgForm} from '@angular/forms';
import { SwUpdate } from '@angular/service-worker'

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

export interface TopContributors {
    id: string;
    name: string;
    hours: string;
    frequency : string
  }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public updates : SwUpdate,private reportsService : ReportsService, public authService : AuthService, public router : Router, public dashboardService : DashboardService) { 
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    })

  }

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvas1') canvas1: ElementRef;
  @ViewChild('canvas2') canvas2: ElementRef;
  public context: CanvasRenderingContext2D;
  public context1: CanvasRenderingContext2D;
  public context2: CanvasRenderingContext2D;
  buchart = [];
  locationchart = [];
  projectchart = [];
  location : Number = 0;
  private locationSub : Subscription;
  volunteers : Number = 0;
  private volunteersSub : Subscription;
  volunteeringhrs : Number = 0;
  private volunteeringhrsSub : Subscription;
  bus : Number = 0;
  private busSub : Subscription;
  buChart : BU[] = [];
  buChartLabel : String[] = [];
  buChartValue : Number[] = [];
  locationChart : Location[] = [];
  locationChartLabel : String[] = [];
  locationChartValue : Number[] = [];
  projectChart : Project[] = [];
  projectChartLabel : String[] = [];
  projectChartValue : Number[] = [];
  id : String;
  role : String;
  dashboardtitle : String = "Cognizant Outreach Program";
  dashboardsubtitle : String = "Making a difference in people's lives means active involvement in the larger community. Your involvements so far..."
  _uniquevolunteers : String = "Unique Volunteers";
  _volunteeringhours : String = "Volunteering Hours";
  _businessunits : String = "Business Units";
  _locations : String = "Locations";
  _businessunitpeople : String = "Business Units-People";
  _locationevents : String = "Locations-Events";
  _projectevents : String = "Projects-Events";
  topContributors : TopContributors[] = [];
  private topContributorsSub : Subscription;
  displayedColumns: string[] = ['id', 'name', 'hours', 'frequency'];
  dataSource: MatTableDataSource<TopContributors>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  getIDandRole() {
    this.id = this.authService.getID();
    this.role = this.authService.getRole(); 
    console.log(">>>>>>>>2222.5"+this.id);
    console.log(">>>>>>>>2222.5"+this.role);
  }

  async ngOnInit() {

    await this.getIDandRole();
    console.log(this.id+""+this.role);
    this.dashboardService.getVolunteers(this.id,this.role);
    this.volunteersSub = this.dashboardService.getVolunteersUpdateListener().subscribe(
        (volunteers : Number) => {
          this.volunteers = volunteers;
    });

    this.dashboardService.getLocation(this.id,this.role);
    this.locationSub = this.dashboardService.getLocationUpdateListener().subscribe(
          (location : Number) => {
            this.location = location;
    });

    this.dashboardService.getVolunteeringHrs(this.id,this.role);
    this.volunteeringhrsSub = this.dashboardService.getVolunteeringHrsUpdateListener().subscribe(
          (volunteeringhrs : Number) => {
            this.volunteeringhrs = volunteeringhrs;
    });

    this.dashboardService.getBUs(this.id,this.role);
    this.busSub = this.dashboardService.getbusUpdateListener().subscribe(
          (bus : Number) => {
            this.bus = bus;
    });

    this.reportsService.getTopContributors(this.id,this.role);
    this.topContributorsSub = this.reportsService.gettopcontributorsUpdateListener().subscribe(
      (topContributors : TopContributors[]) => {
        this.topContributors = topContributors;
        console.log('File------>'+this.topContributors);
        this.dataSource = new MatTableDataSource(this.topContributors);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }); 

    this.dashboardService.getbusChartUpdateListener().subscribe((buChart : BU[]) => {
        this.buChart = buChart
        for(let i =0; i< this.buChart.length; i++ ) {
            this.buChartLabel.push(this.buChart[i]._id+" - "+this.buChart[i].total);
            this.buChartValue.push(this.buChart[i].total);
        }

        this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
            this.buchart = new Chart(this.context, {
            type: 'doughnut',
            data: {
            labels: this.buChartLabel,
            datasets: [{
              label: '',
              data: this.buChartValue,
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
    })

    this.dashboardService.getlocationChartUpdateListener().subscribe((locationChart : BU[]) => {
        this.locationChart = locationChart
          for(let i =0; i< this.locationChart.length; i++ ) {
            this.locationChartLabel.push(this.locationChart[i]._id+" - "+this.locationChart[i].total);
            this.locationChartValue.push(this.locationChart[i].total);
        }
        this.context1 = (<HTMLCanvasElement>this.canvas1.nativeElement).getContext('2d');
        this.locationchart = new Chart(this.context1, {
        type: 'pie',
        data: {
        labels: this.locationChartLabel,
        datasets: [{
            label: '',
            data: this.locationChartValue,
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
    })

    console.log(this.id+""+this.role);

    this.dashboardService.getProjects(this.id,this.role);
    
    this.dashboardService.getprojectChartUpdateListener().subscribe((projectChart : Project[]) => {
        this.projectChart = projectChart
          for(let i =0; i< this.projectChart.length; i++ ) {
            this.projectChartLabel.push(this.projectChart[i]._id+" - "+this.projectChart[i].total);
            this.projectChartValue.push(this.projectChart[i].total);
        } 
        this.context2 = (<HTMLCanvasElement>this.canvas2.nativeElement).getContext('2d');
        this.projectchart = new Chart(this.context2, {
        type: 'doughnut',
        data: {
        labels: this.projectChartLabel,
        datasets: [{
          label: '# of Votes',
          data: this.projectChartValue,
          backgroundColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
          ]
           ,borderWidth: 0
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
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
