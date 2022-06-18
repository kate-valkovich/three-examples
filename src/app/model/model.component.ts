import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from "three";
import { WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private addLight() {
    const ambientLight = new THREE.AmbientLight(0x00000, 100);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const light1 = new THREE.PointLight(0x4b371c, 10);
    light1.position.set(0, 200, 400);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0x4b371c, 10);
    light2.position.set(500, 100, 0);
    this.scene.add(light2);

    const light3 = new THREE.PointLight(0x4b371c, 10);
    light3.position.set(0, 100, -500);
    this.scene.add(light3);

    const light4 = new THREE.PointLight(0x4b371c, 10);
    light4.position.set(-500, 300, 500);
    this.scene.add(light4);
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)

    this.camera = new THREE.PerspectiveCamera(
      0.5,
      this.getAspectRatio(),
      5,
      1000
    )

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }


  private onCanvasResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    const render = () => {
      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    };

    render()
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load('/assets/canon/scene.gltf',
      gltf => {
        this.scene.add(gltf.scene);
      },
      error => {
        console.error(error)
      })
  }

  private addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 30;
  }

  ngAfterViewInit() {
    this.createScene();
    this.loadModel();
    this.addLight();
    this.addControls();
    this.startRenderingLoop();

    const resizeObservable$ = fromEvent(this.canvasRef.nativeElement, 'resize');
    resizeObservable$.subscribe(this.onCanvasResize);
  }
}
