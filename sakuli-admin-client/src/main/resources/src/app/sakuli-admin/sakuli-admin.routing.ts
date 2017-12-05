import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dasboard.component';
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TestComponent} from "./test/test.component";
import {SakuliProjectGuardService} from "./sakuli-project-guard.service";
import {SaAssetsConnectedComponent} from "./test/sa-assets/sa-assests-connected.component";
import {TestDetailConnectedComponent} from "./test/test-detail/test-detail-connected.component";
import {SaConfigurationComponent} from "./test/configuration/sa-configuration.component";
import {SaReportComponent} from "./test/report/sa-report.component";
import {AppLogComponent} from "./app-log/app-log.component";
import {PreventRoutingGuardService} from "../sweetest-components/components/forms/prevent-routing-guard.service";
import {DashboardConnectedComponent} from "./dashboard/dashboard-connected.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'reports',
    component: SaReportComponent,
    canActivate: [
      SakuliProjectGuardService
    ]
  },
  {
    path: 'dashboard',
    component: DashboardConnectedComponent,
    canActivate: [
      SakuliProjectGuardService
    ]
  },
  {
    path: 'testsuite',
    canActivate: [
      SakuliProjectGuardService
    ],
    children: [
      {path: ':suite', component: TestComponent},
      {
        path: ':suite/sources',
        children: [
          {
            path: '',
            component: TestDetailConnectedComponent
          },
          {
            path: ':file',
            component: TestDetailConnectedComponent,
            canDeactivate: [PreventRoutingGuardService]
          },
        ]
      },
      {
        path: ':suite/assets',
        children: [
          {
            path: '',
            component: SaAssetsConnectedComponent
          },
          {
            path: ':file',
            component: SaAssetsConnectedComponent,
          },
        ]
      },
      {
        path: ':suite/configuration',
        component: SaConfigurationComponent,
        canDeactivate: [PreventRoutingGuardService]
      },
    ]
  },
  {
    path: 'app-log',
    component: AppLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ]
})
export class SakuliAdminRoutingModule {
}
