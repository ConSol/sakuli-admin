import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScLayoutComponent} from './components/layout/sc-layout.component';
import {ScHeadingComponent, ScHxComponent} from './components/presentation/text/sc-heading.component';
import {ScSidebarComponent} from './components/layout/sc-sidebar.component';
import {ScHeaderComponent} from './components/layout/sc-header.component';
import {ScContentComponent} from './components/layout/sc-content.component';
import {ScLinkComponent} from './components/layout/sc-link.component';
import {ScCircleIndicatorComponent} from './components/presentation/circle-indicator/sc-circle-indicator.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PrimaryContextDirective} from './components/common/context-states.directive';
import {ScCounterComponent} from './components/presentation/counter/sc-counter.component';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScTreeComponent} from './components/presentation/tree/sc-tree.component';
import {ScTreeItemComponent} from './components/presentation/tree/sc-tree-item.component';
import {ScTableComponent} from "./components/presentation/table/table.component";
import {FormsModule} from "@angular/forms";
import {ScToastModule} from "./components/presentation/toast/toast.module";
import {AbsPathPipe, FileNamePipe, PathPipe} from "./components/common/file.pipes";
import {ScLogComponent} from "./components/presentation/log/log.component";
import {ScAccessModule} from "./services/access/access.module";
import {ScModalModule} from "./components/presentation/modal/sc-modal.module";
import {ScIconModule} from "./components/presentation/icon/sc-icon.module";
import {ScValuePickerModule} from "./components/presentation/value-picker/sc-value-picker.module";
import {UrlComponentPipe} from "./components/common/url-component.pipe";
import {ConcatPipe, NumberPipe, SafeHtmlPipe, SplitPipe} from "./components/common/util.pipes";
import {ScLoadingModule} from "./components/presentation/loading/sc-loading.module";
import {ScEntrySetPipe} from "./components/common/entry-set.pipe";
import {AnsiColorPipe} from "./components/presentation/log/ansi-color.pipe";
import {ScCollapseComponent} from "./components/common/sc-collapse.component";
import {DateDiffPipe, MomentPipe} from "./components/common/date-util.pipes";
import {ScMenuModule} from "./components/layout/menu/menu.module";
import {ScRouterModule} from "./services/router/router.module";
import {PreventRoutingGuardService} from "./components/forms/prevent-routing-guard.service";
import {ScFormsModule} from "./components/forms/sc-forms.module";
import {ScOpenFileModule} from "./components/presentation/open-file/sc-open-file.module";
import {ScFileSelectorModule} from "./components/presentation/file-selector/sc-file-selector.module";
import {RouterModule} from "@angular/router";
import {ScResultTableComponent} from "./components/layout/sc-result-table.component";
import {ThumbnailModule} from "./components/presentation/thumbnail/thumbnail.module";
import {ScrollDownDirective} from "./components/layout/scroll-down.directive";


export const SweetestComponentsAndDirectives  = [
  ScLayoutComponent,
  ScHeadingComponent,
  ScSidebarComponent,
  ScHeaderComponent,
  ScContentComponent,
  ScLinkComponent,
  ScCircleIndicatorComponent,
  ScResultTableComponent,
  ScHxComponent,
  PrimaryContextDirective,
  ScCounterComponent,
  ScTreeComponent,
  ScTreeItemComponent,

  ScTableComponent,

  FileNamePipe,
  PathPipe,
  UrlComponentPipe,
  AbsPathPipe,
  SplitPipe,
  ConcatPipe,
  SafeHtmlPipe,
  AnsiColorPipe,

  ScEntrySetPipe,
  ScLogComponent,

  ScCollapseComponent,

  DateDiffPipe,
  NumberPipe,
  MomentPipe,

  ScrollDownDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ScAccessModule,
    ScToastModule,
    ScModalModule,
    ScValuePickerModule,
    ScIconModule,
    ScLoadingModule,
    ScMenuModule,
    ScRouterModule,
    ScFormsModule,
    ScOpenFileModule,
    ScFileSelectorModule,
    ThumbnailModule
  ],
  declarations: [
    ...(SweetestComponentsAndDirectives)
  ],
  providers: [
    PreventRoutingGuardService,
  ],
  exports: [
    ...(SweetestComponentsAndDirectives),
    NgbModule,
    FormsModule,
    ScAccessModule,
    ScToastModule,
    ScModalModule,
    ScValuePickerModule,
    ScIconModule,
    ScLoadingModule,
    ScRouterModule,
    ScFormsModule,
    ThumbnailModule
  ],
})
export class SweetestComponentsModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SweetestComponentsModule,
    };
  }
}
