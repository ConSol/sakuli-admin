import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TestService} from "../../../sweetest-components/services/access/test.service";
import {
  DockerPullCompleted,
  DockerPullProgress,
  DockerPullProgressBatch,
  DockerPullStarted,
  DockerPullStream,
  LOAD_TESTRESULTS,
  LOAD_TESTRESULTS_SUCCESS,
  LoadTestResults,
  LoadTestResultsSuccess,
  STOP_TEST_EXECUTION,
  StopTestExecution,
} from "./test.actions";
import {SET_PROJECT, SetProject} from "../../workspace/state/project.actions";

import {Observable} from "rxjs/Observable";
import {ScLoadingService} from "../../../sweetest-components/components/presentation/loading/sc-loading.service";
import {CreateToast, ErrorMessage,} from "../../../sweetest-components/components/presentation/toast/toast.actions";
import {AppState} from "../../appstate.interface";
import {Store} from "@ngrx/store";
import {LoadTestsuiteSuccess, testSuiteSelectors} from "./testsuite.state";
import {DangerToast, SuccessToast} from "../../../sweetest-components/components/presentation/toast/toast.model";
import {workspaceSelectors} from "../../workspace/state/project.interface";
import {TestSuiteResult} from "../../../sweetest-components/services/access/model/test-result.interface";
import {
  RUN_TEST,
  RUN_TEST_ERROR,
  RunTest,
  RunTestError,
  SET_TEST_RUN_INFO,
  SetTestRunInfo,
  TEST_EXECUTION_COMPLETED,
  TEST_EXECUTION_STOPPED,
  TestExecutionCompleted,
  TestExecutionSetVncReady,
  TestExecutionStarted,
  TestExecutionStopped
} from "./testexecution.state";
import {APPEND_TEST_RUN_INFO_LOG, AppendTestRunInfoLog} from "./test-execution-log.state";

@Injectable()
export class TestEffects {

  @Effect() runTest$ = this.actions$.ofType(RUN_TEST)
    .withLatestFrom(this.store.select(workspaceSelectors.workspace))
    .mergeMap(([rt, workspace]: [RunTest, string]) => this
      .testService
      .run(rt.testSuite, workspace)
      .map(tri => new SetTestRunInfo(tri, rt.testSuite))
      .catch(ErrorMessage(`Cannot run ${rt.testSuite.id}`, new RunTestError()))
    );

  @Effect() runTestLoading$ = this.loading.registerLoadingActions(
    'runTest',
    RUN_TEST,
    [SET_TEST_RUN_INFO, RUN_TEST_ERROR]
  );

  @Effect() vncReady$ = this.actions$.ofType(APPEND_TEST_RUN_INFO_LOG)
    .filter((a: AppendTestRunInfoLog) => {
      return a.testExecutionEvent.message.includes('noVNC HTML client started')
    })
    .map((a: AppendTestRunInfoLog) => new TestExecutionSetVncReady(
      a.testExecutionEvent.processId,
      true)
    );

  @Effect() fetchLogs$ = this.actions$.ofType(SET_TEST_RUN_INFO)
    .mergeMap((tri: SetTestRunInfo) => this.testService.testRunLogs(tri.testRunInfo.executionId))
    .groupBy(tee => tee.type)
    .mergeMap(gtee$ => {
      const noop = () => Observable.of({type: '_', 'debugKey': gtee$.key});
      return (({
        'test.log': () => gtee$.map(se => new AppendTestRunInfoLog(se)),
        'test.lifecycle.started': () => gtee$.map(se => new TestExecutionStarted(se)),
        'test.lifecycle.completed': () => gtee$.map(({processId}) => new TestExecutionCompleted(processId)),
        'test.lifecycle.stop': () => gtee$.map(({processId}) => new TestExecutionStopped(processId)),
        'docker.pull.started': () => gtee$.map(({processId}) => new DockerPullStarted(processId)),
        'docker.pull.progress': () => Observable.merge(
          gtee$.map(se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
            .filter(dpg => !!dpg.info.id && !!dpg.info.status)
            .bufferTime(350)
            .map((actions: DockerPullProgress[]) => new DockerPullProgressBatch(actions))
          ,
          gtee$.map(se => new DockerPullProgress(se.processId, JSON.parse(se.message)))
            .filter(dpg => !!dpg.info.stream)
            .map(dpg => new DockerPullStream(dpg.id, dpg.info))),
        'test.pull.completed': () => ({processId}) => new DockerPullCompleted(processId),
        'error': () => gtee$.mergeMap((se: any) =>  [
          new CreateToast(new DangerToast(se.message, se.stacktrace)),
          new RunTestError()
        ])
      })[gtee$.key] || noop)();
    })
    .catch(ErrorMessage('Unable to proceed server event'));

  @Effect() fetchLogFinish$ = this.actions$.ofType(TEST_EXECUTION_COMPLETED)
    .mergeMap(_ => [
      new CreateToast(new SuccessToast('Finished test execution')),
      new LoadTestResults()
    ]);

  @Effect() testExecutionStopped$ = this.actions$.ofType(TEST_EXECUTION_STOPPED)
    .map(_ => new CreateToast(new SuccessToast('Test execution stopped')));

  @Effect() projectOpen = this.actions$.ofType(SET_PROJECT)
    .map((sp: SetProject) => new LoadTestsuiteSuccess(sp.project.testSuite));


  @Effect() loadTestResults = this.actions$.ofType(LOAD_TESTRESULTS)
    .mergeMap(_ => this.store.select(
      testSuiteSelectors.selectAll
    ).map(all => all || []))
    .mergeMap((suites) => Observable.forkJoin(
      ...suites.map(ts => this.testService.testResults(ts.root))
    ))
    .map((r: TestSuiteResult[][]) => r.reduce((flat, tsa) => [...flat, ...tsa]), [])
    .map(r => new LoadTestResultsSuccess(r))
    .catch(ErrorMessage('Unable to load test results'));

  @Effect() loadingTestResult = this.loading.registerLoadingActions(
    "loadingTestResults",
    LOAD_TESTRESULTS,
    LOAD_TESTRESULTS_SUCCESS
  );

  @Effect({dispatch: false}) stopTestExecution$ = this.actions$.ofType(STOP_TEST_EXECUTION)
    .do((ste: StopTestExecution) => {
      this.testService.stop(ste.containerId)
    });


  constructor(readonly testService: TestService,
              readonly store: Store<AppState>,
              readonly actions$: Actions,
              readonly loading: ScLoadingService) {
  }

}
