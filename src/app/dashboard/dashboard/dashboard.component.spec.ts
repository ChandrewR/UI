import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { ServiceWorkerModule } from '@angular/service-worker';
/* import { SwUpdate } from '@angular/service-worker' */

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports : [
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
        FormsModule, ReactiveFormsModule,
        MatDatepickerModule,
        MatButtonModule,
        MatNativeDateModule,
        MatCardModule,HttpClientModule,HttpClientTestingModule,RouterModule.forRoot([]),
        ServiceWorkerModule.register('ngsw-worker.js', { })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title as 'Cognizant Outreach Program'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.dashboardtitle).toEqual("Cognizant Outreach Program");
  });

  it(`should have as subtitle as Making a difference in peoples lives means active involvement in the larger community. Your involvements so far...`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.dashboardsubtitle).toEqual("Making a difference in people's lives means active involvement in the larger community. Your involvements so far...");
  });

  it(`should have as location initialized to '0'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.location).toEqual(0);
  });

  it(`should have as BUs initialized to '0'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.bus).toEqual(0);
  });

  it(`should have as volunteers initialized to '0'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.volunteers).toEqual(0);
  });

  it(`should have as volunteeringhrs initialized to '0'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.volunteeringhrs).toEqual(0);
  });

  it(`should have as Unique Volunteers as 'Unique Volunteers'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._uniquevolunteers).toEqual("Unique Volunteers");
  });

  it(`should have as Volunteering Hours as 'Volunteering Hours'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._volunteeringhours).toEqual("Volunteering Hours");
  });

  it(`should have as Business Units as 'Business Units'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._businessunits).toEqual("Business Units");
  });

  it(`should have as Locations as 'Locations'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._locations).toEqual("Locations");
  });

  it(`should have as Business Units-People as 'Business Units-People'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._businessunitpeople).toEqual("Business Units-People");
  });

  it(`should have as Locations-Events as 'Locations-Events'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._locationevents).toEqual("Locations-Events");
  });

  it(`should have as Projects-Events as 'Projects-Events'`, () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app._projectevents).toEqual("Projects-Events");
  });

  /* it('should render title in a h5 tag', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain('Cognizant Outreach');
  }); */





});
