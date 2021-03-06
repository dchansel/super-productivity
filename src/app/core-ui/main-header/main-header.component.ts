import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ProjectService} from '../../features/project/project.service';
import {LayoutService} from '../layout/layout.service';
import {BookmarkService} from '../../features/bookmark/bookmark.service';
import {TaskService} from '../../features/tasks/task.service';
import {PomodoroService} from '../../features/pomodoro/pomodoro.service';
import {T} from '../../t.const';
import {fadeAnimation} from '../../ui/animations/fade.ani';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {WorkContextService} from '../../features/work-context/work-context.service';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation]
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  T = T;
  progressCircleRadius = 10;
  circumference = this.progressCircleRadius * Math.PI * 2;

  @ViewChild('circleSvg', {static: true}) circleSvg: ElementRef;

  // isShowTaskTitle$: Observable<boolean> = combineLatest([
  //   this._router.events.pipe(
  //     filter(event => event instanceof NavigationEnd),
  //   ),
  //   this.taskService.currentTaskId$,
  // ]).pipe(
  //   map(([{urlAfterRedirects}, currentTaskId]: [NavigationEnd, string]): boolean => {
  //     return !!currentTaskId && !urlAfterRedirects.match(/tasks$/);
  //   })
  // );

  isShowTaskTitle$: Observable<boolean> = this.taskService.currentTaskId$.pipe(
    map((currentTaskId): boolean => !!currentTaskId),
  );

  private _subs = new Subscription();

  constructor(
    public readonly projectService: ProjectService,
    public readonly workContextService: WorkContextService,
    public readonly bookmarkService: BookmarkService,
    public readonly taskService: TaskService,
    public readonly pomodoroService: PomodoroService,
    public readonly layoutService: LayoutService,
    private readonly _router: Router,
    private readonly _renderer: Renderer2,
    private readonly _cd: ChangeDetectorRef,
  ) {
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  ngOnInit() {
    this.taskService.currentTaskProgress$.subscribe((progressIN) => {
      let progress = progressIN || 1;
      if (progress > 1) {
        progress = 1;
      }
      const dashOffset = this.circumference * -1 * progress;
      this._renderer.setStyle(this.circleSvg.nativeElement, 'stroke-dashoffset', dashOffset);
    });
  }
}
