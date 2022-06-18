import * as THREE from 'three';
import { rule3 } from './utilities';

export class Fan {
  get threeGroup(): THREE.Group {
    return this.tGroup;
  }

  private tGroup: THREE.Group;

  private isBlowing = false;
  private speed = 0;
  private acc = 0;

  private redMat = new THREE.MeshLambertMaterial({
    color: 0xad3525
  });
  private greyMat = new THREE.MeshLambertMaterial({
    color: 0x653f4c
  });
  private yellowMat = new THREE.MeshLambertMaterial({
    color: 0xfdd276
  })
  private propeller!: THREE.Group;

  private tPosX = 0;
  private tPosY = 0;
  private targetSpeed = 0;

  constructor() {
    this.tGroup = new THREE.Group();
    this.tGroup.add(this.createCore());

    this.propeller = this.createPropeller()
    this.tGroup.add(this.propeller);

    this.tGroup.add(this.createSphere());
  }

  public turnOn() {
    this.isBlowing = true;
  }

  public turnOff() {
    this.isBlowing = false;
  }

  public update(xTarget: number, yTarget: number) {
    this.tGroup.lookAt(new THREE.Vector3(0, 80, 60));
    this.tPosX = rule3(xTarget, -200, 200, -250, 250);
    this.tPosY = rule3(yTarget, -200, 200, 250, -250);

    this.tGroup.position.x += (this.tPosX - this.tGroup.position.x) / 10;
    this.tGroup.position.y += (this.tPosY - this.tGroup.position.y) / 10;

    this.targetSpeed = (this.isBlowing) ? .3 : .01;
    if (this.isBlowing && this.speed < .5) {
      this.acc += .001;
      this.speed += this.acc;
    } else if (!this.isBlowing) {
      this.acc = 0;
      this.speed *= .98;
    }
    this.propeller.rotation.z += this.speed;
  }

  private createPropeller(): THREE.Group {
    const propGeom = new THREE.BoxGeometry(10, 30, 2);
    propGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 25, 0));

    const prop1 = new THREE.Mesh(propGeom, this.redMat);
    prop1.position.z = 15;
    const prop2 = prop1.clone();
    prop2.rotation.z = Math.PI / 2;
    const prop3 = prop1.clone();
    prop3.rotation.z = Math.PI;
    const prop4 = prop1.clone();
    prop4.rotation.z = -Math.PI / 2;

    const propeller = new THREE.Group();
    propeller.add(prop1);
    propeller.add(prop2);
    propeller.add(prop3);
    propeller.add(prop4);

    return propeller;
  }

  private createCore(): THREE.Mesh {
    const coreGeom = new THREE.BoxGeometry(10, 10, 20);
    const core = new THREE.Mesh(coreGeom, this.greyMat);

    return core;
  }

  private createSphere(): THREE.Mesh {
    const sphereGeom = new THREE.BoxGeometry(10, 10, 3);
    const sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
    sphere.position.z = 15;

    return sphere;
  }
}
