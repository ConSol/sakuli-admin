import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {AssetItemType, getItemType} from "./asset-item-type.enum";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {NavigateToTestSuiteAssets} from "../state/test-navitation.actions";


@Component({
  selector: 'sa-assest-items',

  template: `    
    <ng-container 
      *ngFor="let file of items" 
      [ngSwitch]="getItemType(file)">
      <asset-item-folder 
        *ngSwitchCase="itemTypes.Folder"
        [item]="file"
        (click)="onSelectFolder(file)"
        (delete)="onDelete(file)"
      ></asset-item-folder>
      <asset-item-image 
        *ngSwitchCase="itemTypes.Image"
        [item]="file"
        [basePath]="basePath"
        (click)="onSelect(file)"
        (delete)="onDelete(file)"
      ></asset-item-image>
      <asset-item-text
        *ngSwitchCase="itemTypes.Text"
        [item]="file"
        [basePath]="basePath"
        (click)="onSelect(file)"
        (delete)="onDelete(file)"
        (pinFile)="onPin(file)"
      ></asset-item-text>
      <div *ngSwitchDefault="">
        <br />
      </div>
    </ng-container>
    <div *ngIf="!hasDisplayableItems" class="jumbotron col-12 text-center text-muted">
      <h3 class="display-3">No content in this folder</h3>
      <p>Add content by drag and drop, upload or past some image data</p>
      <p>
        <sc-icon icon="fa-upload" [size]="5"></sc-icon>
      </p>
    </div>
    <ng-template #confirm let-c="close" let-d="dismiss">
      <div class="modal-body">
        <strong>Confirm deletion</strong>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" (click)="d()">Cancel</button>
        <button class="btn btn-success" (click)="c('ok')">Ok</button>
      </div>
    </ng-template>
  `,
  styles: [`    
    input[type="file"] {
      display: none;
    }
  `]
})
export class SaAssetItemsComponent {

  @Input() items: FileResponse[];
  @Input() basePath;

  @Output() select = new EventEmitter<FileResponse>();
  @Output() delete = new EventEmitter<FileResponse>();

  @Output() pin = new EventEmitter<FileResponse>();

  @HostBinding('class')
  get cssClass() {
    return 'row'
  }

  itemTypes = AssetItemType;

  constructor(
    readonly router: Router,
    readonly store: Store<any>
  ) {}

  onSelect(file: FileResponse) {
    this.select.next(file);
  }

  onPin(file: FileResponse) {
    this.pin.next(file);
  }

  onDelete(file: FileResponse) {
    this.delete.next(file);
  }

  get hasDisplayableItems() {
    return this.items
      .map(f => this.getItemType(f))
      .map(t => (t === AssetItemType.Image || t === AssetItemType.Folder || t === AssetItemType.Text) ? 1 : 0)
      .reduce((sum, i) => sum + i, 0) > 0;
  }

  getItemType(file: FileResponse): AssetItemType {
    return getItemType(file)
  }

  async onSelectFolder(file: FileResponse) {
    this.store.dispatch(new NavigateToTestSuiteAssets(this.basePath, [file.path, file.name].filter(f => !!f).join('/')));
  }
}
