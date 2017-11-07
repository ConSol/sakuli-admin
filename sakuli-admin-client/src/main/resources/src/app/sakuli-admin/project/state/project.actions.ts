import {Action} from "@ngrx/store";
import {FileResponse} from "../../../sweetest-components/services/access/model/file-response.interface";
import {Tree, TreeItem} from "../../../sweetest-components/components/presentation/tree/tree.interface";
import {ProjectModel} from "../../../sweetest-components/services/access/model/project.model";
import {uniqueName} from "../../../core/redux.util";

export const LOAD_PATH = '[project] loadpath';
export class LoadPath implements Action {
  readonly type = LOAD_PATH;
  constructor(
    public path: string
  ) {}
}

export const APPEND_CHILDREN = uniqueName('[project] appendchildren');
export class AppendChildren implements Action {
  readonly type = APPEND_CHILDREN;
  constructor(
    public path: string,
    public children: FileResponse[]
  ) {}
}

export const TOGGLE_OPEN = uniqueName('[project] toggleopen');
export class ToggleOpen implements Action {
  readonly type = TOGGLE_OPEN;
  constructor(
    public item: Tree<FileResponse>
  ) {}
}

export const SELECT_FILE = uniqueName('[project] selectfile');
export class SelectFile implements Action {
  readonly type = SELECT_FILE;
  constructor(
    readonly file?: Tree<FileResponse>
  ) {}
}

export const OPEN = uniqueName('[project] open');
export class Open implements Action {
  readonly type = OPEN;
  constructor(
    readonly file: FileResponse
  ) {}
}

export const SET_PROJECT = uniqueName('[project] setproject');
export class SetProject implements Action {
  readonly type = SET_PROJECT;
  constructor(
    public project: ProjectModel
  ) {}
}

export const REFRESH_PROJECT = uniqueName('[project] REFRESH_PROJECT');
export class RefreshProject implements Action {
  readonly type = REFRESH_PROJECT;
  constructor() {}
}

export type All = LoadPath | AppendChildren | ToggleOpen | SelectFile | SetProject;
