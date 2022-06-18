import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  ngAfterViewInit() {
    this.createScene();
    this.addCube();
    this.startRenderingLoop();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private animateMesh(mesh: THREE.Mesh) {
    const rotationSpeedX = 0.05;
    const rotationSpeedY = 0.01;

    mesh.rotation.x += rotationSpeedX;
    mesh.rotation.y += rotationSpeedY;
  }

  private createScene() {
    const fieldOfView = 1;
    const nearClippingPlane = 5;
    const farClippingPlane = 1000;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4d4d8)

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearClippingPlane,
      farClippingPlane
    )

    this.camera.position.z = 400;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    const renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);


    const render = () => {
      requestAnimationFrame(render);
      this.animateMesh(this.cube);
      renderer.render(this.scene, this.camera);
    };

    render();
  }

  private addCube() {
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({map: loader.load('/assets/texture.jpeg')});
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    this.cube = new THREE.Mesh(geometry, material)

    this.scene.add(this.cube);
  }
}
