import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewTaskComponent } from './components/view-task/view-task.component';

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "task-details/:id", component: ViewTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
