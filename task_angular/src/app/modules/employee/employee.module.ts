import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DemoAngularMaterialModule } from '../../DemoAngularMaterialModule';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewTaskComponent } from './components/view-task/view-task.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ViewTaskComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DemoAngularMaterialModule
  ]
})
export class EmployeeModule { }
