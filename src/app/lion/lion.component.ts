import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import { Lion } from './lion';
import { fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { Fan } from './fan';

@Component({
  selector: 'app-lion',
  templateUrl: './lion.component.html',
  styleUrls: ['./lion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LionComponent implements AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private lion!: Lion;
  private fan!: Fan;
  private renderer!: WebGLRenderer;

  private mousePos = {x: 0, y: 0};
  private isBlowing = false;

  private destroyStream$ = new Subject<void>();

  ngAfterViewInit() {
    this.createSceneAndCamera();
    this.createLights();
    this.createLion();
    this.createFan();
    this.addMouseEventListener();
    this.startRenderingLoop();
  }

  ngOnDestroy() {
    this.destroyStream$.next();
  }

  private createSceneAndCamera() {
    const fieldOfView = 60;
    const nearClippingPlane = 1;
    const farClippingPlane = 2000;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearClippingPlane,
      farClippingPlane
    )

    this.camera.position.z = 800;
    this.camera.position.y = 0;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    const container = document.getElementById('world');
    container?.appendChild(this.renderer.domElement);

    const render = () => {
      const xTarget = (this.mousePos.x - window.innerWidth / 2);
      const yTarget = (this.mousePos.y - window.innerHeight / 2);

      if (this.isBlowing) {
        this.fan.turnOn();
      } else {
        this.fan.turnOff();
      }

      this.fan.update(xTarget, yTarget);

      if (this.isBlowing) {
        this.lion.cool(xTarget, yTarget);
      } else {
        this.lion.look(xTarget, yTarget);
      }

      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);
    };

    render();
  }

  private createLights() {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

    const shadowLight = new THREE.SpotLight(0xffffff, .8);
    shadowLight.position.set(200, 200, 200);
    shadowLight.castShadow = true;

    const backLight = new THREE.DirectionalLight(0xffffff, .4);
    backLight.position.set(-100, 200, 50);
    backLight.castShadow = true;

    this.scene.add(backLight);
    this.scene.add(light);
    this.scene.add(shadowLight);
  }

  private createLion() {
    this.lion = new Lion();
    this.scene.add(this.lion.threeGroup);
  }

  private createFan() {
    this.fan = new Fan();
    this.fan.threeGroup.position.z = 350;
    this.scene.add(this.fan.threeGroup);
  }

  private getAspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  private handleMouseMove(event: MouseEvent) {
    this.mousePos = {x: event.clientX, y: event.clientY};
  }

  private handleMouseDown(event: MouseEvent) {
    this.isBlowing = true;
  }

  private handleMouseUp(event: MouseEvent) {
    this.isBlowing = false;
  }

  private handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) {
      event.preventDefault();
      this.mousePos = {x: event.touches[0].pageX, y: event.touches[0].pageY};
      this.isBlowing = true;
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    this.isBlowing = false;
  }

  private handleTouchMove(event: TouchEvent) {
    if (event.touches.length == 1) {
      event.preventDefault();
      this.mousePos = {x: event.touches[0].pageX, y: event.touches[0].pageY};
      this.isBlowing = true;
    }
  }

  private addMouseEventListener() {
    const mouseEventListener$ = fromEvent(document, 'mousemove') as Observable<MouseEvent>;
    mouseEventListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: MouseEvent) => {
        this.handleMouseMove(event);
      });

    const mouseUpListener$ = fromEvent(document, 'mouseup') as Observable<MouseEvent>;
    mouseUpListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: MouseEvent) => {
        this.handleMouseUp(event);
      });

    const mouseDownListener$ = fromEvent(document, 'mousedown') as Observable<MouseEvent>;
    mouseDownListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: MouseEvent) => {
        this.handleMouseDown(event);
      });

    const touchEndListener$ = fromEvent(document, 'touchend') as Observable<TouchEvent>;
    touchEndListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: TouchEvent) => {
        this.handleTouchEnd(event);
      });

    const touchStartListener$ = fromEvent(document, 'touchstart') as Observable<TouchEvent>;
    touchStartListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: TouchEvent) => {
        this.handleTouchStart(event);
      });

    const touchMoveListener$ = fromEvent(document, 'touchmove') as Observable<TouchEvent>;
    touchMoveListener$
      .pipe(takeUntil(this.destroyStream$))
      .subscribe((event: TouchEvent) => {
        this.handleTouchMove(event);
      });
  }
}
