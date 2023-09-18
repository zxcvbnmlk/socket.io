import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { environment } from '@env/environment';
import {fromEvent, pairwise, Subject} from "rxjs";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {ApiService} from "@app/_service/api.service";

@Component({
  selector: 'app-search',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('myCanvas',{static:true})
  myCanvas: ElementRef = {} as ElementRef;
  version: string | null = environment.version;
  gitUsers: any = [];
  err: string | null = null
  private destroy$: Subject<void> = new Subject<void>();
  range: number = 2;
  color: string = '#c22d2d';
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.canvasGo();
  }
  ngAfterViewInit(): void {

  }

  canvasGo() {
    const canvas = this.myCanvas.nativeElement
    const ctx = canvas.getContext('2d')
    const rest = canvas.getBoundingClientRect()
    const scale = window.devicePixelRatio

    canvas.width = rest.width * scale
    canvas.height = rest.height * scale
    ctx.scale(scale,scale)

    const mousemove$ = fromEvent(canvas, 'mousemove')
    const mousedown$ = fromEvent(canvas, 'mousedown')
    const mouseup$ = fromEvent(canvas, 'mouseup')
    const mouseout$ = fromEvent(canvas, 'mouseout')

    mousedown$.pipe(
      switchMap( e => mousemove$.pipe(
        map( (e:any) => ({
            x: e.offsetX,
            y: e.offsetY,
          })
        ),
        pairwise(),
        takeUntil(mouseup$),
        takeUntil(mouseout$)
      )),
      takeUntil(this.destroy$)
    ).subscribe( ([from,to]) => {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.range;
      ctx.beginPath(); // Начинает новый путь
      ctx.moveTo(from.x, from.y); // Передвигает перо в точку
      ctx.lineTo(to.x, to.y); // Рисует линию до точки
      ctx.stroke(); // Отображает путь
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
