import * as THREE from 'three';
import { rule3 } from './utilities';

export class Lion {
  get threeGroup(): THREE.Group {
    return this.tGroup;
  }

  private bodyInitPositions: Array<{
    x: number,
    y: number,
    z: number
  }> = [];

  private yellowMat = new THREE.MeshStandardMaterial({
    color: 0xfdd276,
  });

  private redMat = new THREE.MeshLambertMaterial({
    color: 0xad3525,
  });

  private whiteMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });

  private purpleMat = new THREE.MeshLambertMaterial({
    color: 0x451954,
  });

  private greyMat = new THREE.MeshLambertMaterial({
    color: 0x653f4c,
  });

  private blackMat = new THREE.MeshLambertMaterial({
    color: 0x302925,
  });

  private tGroup = new THREE.Group();
  private head!: THREE.Group;
  private smile!: THREE.Mesh;
  private mouth!: THREE.Mesh;
  private lips!: THREE.Mesh

  private rightKnee: THREE.Mesh;
  private leftKnee!: THREE.Mesh;

  private rightEar!: THREE.Mesh;
  private leftEar!: THREE.Mesh;

  private leftEye!: THREE.Mesh;
  private rightEye!: THREE.Mesh;

  private leftIris!: THREE.Mesh;
  private rightIris!: THREE.Mesh;

  private body!: THREE.Mesh;
  private mane!: THREE.Group;
  private mustaches!: Array<THREE.Mesh>;

  private windTime = 0;
  private tHeadRotY = 0;
  private tHeadRotX = 0;
  private tHeadPosX = 0;
  private tHeadPosY = 0;
  private tHeadPosZ = 0;
  private tEyeScale = 1;
  private tIrisYScale = 1;
  private tIrisZScale = 1;
  private tIrisPosY = 0;
  private tLeftIrisPosZ = 0;
  private tRightIrisPosZ = 0;
  private tRightKneeRotZ = 0;
  private tLeftKneeRotZ = 0;
  private bodyVertices = [0, 1, 2, 3, 4];
  private maneParts: Array<any> = [];

  private tSmilePosX = 0;
  private tMouthPosZ = 0;
  private tSmilePosZ = 0;
  private tSmilePosY = 0;
  private tSmileRotZ = 0;
  private tLipsPosX = 0;
  private tLipsPosY = 0;

  constructor() {
    this.body = this.createBody();
    this.tGroup.add(this.body);

    this.head = this.createHead();
    this.tGroup.add(this.head);

    [this.rightKnee, this.leftKnee] = this.createKnees();
    this.tGroup.add(this.rightKnee, this.leftKnee);

    this.tGroup.add(...this.createFeet());

    this.addShadows();
  }


  public updateBody(speed: number): void {
    this.head.rotation.y += (this.tHeadRotY - this.head.rotation.y) / speed;
    this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;

    this.head.position.x += (this.tHeadPosX - this.head.position.x) / speed;
    this.head.position.y += (this.tHeadPosY - this.head.position.y) / speed;
    this.head.position.z += (this.tHeadPosZ - this.head.position.z) / speed;

    this.leftEye.scale.y += (this.tEyeScale - this.leftEye.scale.y) / (speed * 2);
    this.rightEye.scale.y = this.leftEye.scale.y;

    this.leftIris.scale.y += (this.tIrisYScale - this.leftIris.scale.y) / (speed * 2);
    this.leftIris.scale.z += (this.tIrisZScale - this.leftIris.scale.z) / (speed * 2);

    this.leftIris.position.y += (this.tIrisPosY - this.leftIris.position.y) / speed;
    this.leftIris.position.z += (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;

    this.rightIris.scale.y = this.leftIris.scale.y;
    this.rightIris.scale.z = this.leftIris.scale.z;

    this.rightIris.position.y = this.leftIris.position.y;
    this.rightIris.position.z += (this.tRightIrisPosZ - this.rightIris.position.z) / speed;

    this.rightKnee.rotation.z += (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
    this.leftKnee.rotation.z += (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;

    this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
    this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;

    this.smile.position.x += (this.tSmilePosX - this.smile.position.x) / speed;;
    this.smile.position.z += (this.tSmilePosZ - this.smile.position.z) / speed;
    this.smile.position.y += (this.tSmilePosY - this.smile.position.y) / speed;
    this.smile.rotation.z += (this.tSmileRotZ - this.smile.rotation.z) / speed;

    this.mouth.position.z += (this.tMouthPosZ - this.mouth.position.z) / speed
  }

  public look(xTarget: number, yTarget: number) {
    this.tHeadRotY = rule3(xTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
    this.tHeadRotX = rule3(yTarget, -200, 200, -Math.PI / 4, Math.PI / 4);

    this.tHeadPosX = rule3(xTarget, -200, 200, 70, -70);
    this.tHeadPosY = rule3(yTarget, -140, 260, 20, 100);
    this.tHeadPosZ = 0;

    this.tEyeScale = 1;
    this.tIrisYScale = 1;
    this.tIrisZScale = 1;
    this.tIrisPosY = rule3(yTarget, -200, 200, 35, 15);
    this.tLeftIrisPosZ = rule3(xTarget, -200, 200, 130, 110);
    this.tRightIrisPosZ = rule3(xTarget, -200, 200, 110, 130);

    this.tLipsPosX = 0;
    this.tLipsPosY = -45;

    this.tSmilePosX = 0;
    this.tSmilePosZ = 173;
    this.tSmilePosY = -15;
    this.tSmileRotZ = -Math.PI;

    this.tMouthPosZ = 174;

    this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3 - Math.PI / 8, .3 + Math.PI / 8);
    this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3 - Math.PI / 8, -.3 + Math.PI / 8)

    this.updateBody(10);

    this.mane.rotation.y = 0;
    this.mane.rotation.x = 0;

    this.maneParts.forEach(part=> {
      part.mesh.position.z = 0;
      part.mesh.rotation.y = 0;
    })

    this.mustaches.forEach((mustache) => {
      mustache.rotation.y = 0;
    })

    this.updateBodyVertices();
    this.body.geometry.attributes['position'].needsUpdate = true;
  }

  public cool(xTarget: number, yTarget: number) {
    this.tHeadRotY = rule3(xTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
    this.tHeadRotX = rule3(yTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
    this.tHeadPosX = rule3(xTarget, -200, 200, -70, 70);
    this.tHeadPosY = rule3(yTarget, -140, 260, 100, 20);
    this.tHeadPosZ = 100;

    this.tEyeScale = 0.1;

    this.tIrisYScale = 0.1;
    this.tIrisZScale = 3;
    this.tIrisPosY = 20;
    this.tLeftIrisPosZ = 120;
    this.tRightIrisPosZ = 120;

    this.tLipsPosX = rule3(xTarget, -200, 200, -15, 15);
    this.tLipsPosY = rule3(yTarget, -200, 200, -45, -40);

    this.tMouthPosZ = 168;

    this.tSmilePosX = rule3(xTarget, -200, 200, -15, 15);
    this.tSmilePosY = rule3(yTarget, -200, 200, -20, -8);
    this.tSmilePosZ = 176;
    this.tSmileRotZ = rule3(xTarget, -200, 200, -Math.PI - .3, -Math.PI + .3);

    this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3 + Math.PI / 8, .3 - Math.PI / 8);
    this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3 + Math.PI / 8, -.3 - Math.PI / 8);

    this.updateBody(10);

    let dt = 20000 / (xTarget * xTarget + yTarget * yTarget);
    dt = Math.max(Math.min(dt, 1), .5);
    this.windTime += dt;

    this.leftEar.rotation.x = Math.cos(this.windTime) * Math.PI / 16 * dt;
    this.rightEar.rotation.x = -Math.cos(this.windTime) * Math.PI / 16 * dt;

    this.mane.rotation.y = -.8 * this.head.rotation.y;
    this.mane.rotation.x = -.8 * this.head.rotation.x;

    this.maneParts.forEach(part => {
      part.mesh.position.z = part.zOffset + Math.sin(this.windTime + part.periodOffset) * part.amp * dt * 2;
    });

    this.mustaches.forEach((mustache, i) => {
      const amp = (i < 3) ? -Math.PI / 8 : Math.PI / 8;
      mustache.rotation.y = amp + Math.cos(this.windTime + i) * dt * amp;
    })

    this.updateBodyVertices();

    this.body.geometry.attributes['position'].needsUpdate = true;
  }

  private createBody(): THREE.Mesh {
    const bodyGeom = new THREE.CylinderGeometry(30, 80, 140, 4);

    const body = new THREE.Mesh(bodyGeom, this.yellowMat);
    body.position.z = -60;
    body.position.y = -30;

    this.bodyVertices.forEach((vertice, i) => {
      const tv = body.geometry.getAttribute('position');
      tv.setZ(this.bodyVertices[i], 70);
      this.bodyInitPositions.push({x: tv.getX(i), y: tv.getY(i), z: tv.getZ(i)});
    })

    return body;
  }

  private createKnees(): Array<THREE.Mesh> {
    const kneeGeom = new THREE.BoxGeometry(25, 80, 80);
    kneeGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 50, 0));

    const rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
    rightKnee.position.x = -65;
    rightKnee.position.z = -20;
    rightKnee.position.y = -110;
    rightKnee.rotation.z = .3;

    const leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
    leftKnee.position.x = 65;
    leftKnee.position.z = -20;
    leftKnee.position.y = -110;
    leftKnee.rotation.z = -.3;

    return [rightKnee, leftKnee];
  }

  private createFeet(): Array<THREE.Mesh> {
    const footGeom = new THREE.BoxGeometry(40, 20, 20);

    const backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
    backLeftFoot.position.z = 30;
    backLeftFoot.position.x = 75;
    backLeftFoot.position.y = -90;

    const backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
    backRightFoot.position.z = 30;
    backRightFoot.position.x = -75;
    backRightFoot.position.y = -90;

    const frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
    frontRightFoot.position.z = 40;
    frontRightFoot.position.x = -22;
    frontRightFoot.position.y = -90;

    const frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
    frontLeftFoot.position.z = 40;
    frontLeftFoot.position.x = 22;
    frontLeftFoot.position.y = -90;

    return [backLeftFoot, backRightFoot, frontRightFoot, frontLeftFoot];
  }

  private createMane(): THREE.Group {
    const maneGeom = new THREE.BoxGeometry(40, 40, 15);
    const mane = new THREE.Group();

    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        const manePart = new THREE.Mesh(maneGeom, this.redMat);

        manePart.position.x = (j * 40) - 60;
        manePart.position.y = (k * 40) - 60;

        let amp;
        let zOffset;
        let periodOffset = Math.random() * Math.PI * 2;
        let angleOffsetY, angleOffsetX;
        let angleAmpY, angleAmpX;
        let xInit;
        let yInit;


        if ((j == 0 && k == 0) || (j == 0 && k == 3) || (j == 3 && k == 0) || (j == 3 && k == 3)) {
          amp = -10 - Math.floor(Math.random() * 5);
          zOffset = -5;
        } else if (j == 0 || k == 0 || j == 3 || k == 3) {
          amp = -5 - Math.floor(Math.random() * 5);
          zOffset = 0;
        } else {
          amp = 0;
          zOffset = 0;
        }

        this.maneParts.push({
          mesh: manePart,
          amp: amp,
          zOffset: zOffset,
          periodOffset: periodOffset,
          xInit: manePart.position.x,
          yInit: manePart.position.y
        });
        mane.add(manePart);
      }
    }

    mane.position.y = -10;
    mane.position.z = 80;
    mane.rotation.z = Math.PI / 4;
    return mane;
  }

  private createFace(): THREE.Mesh {
    const faceGeom = new THREE.BoxGeometry(80, 80, 80);
    const face = new THREE.Mesh(faceGeom, this.yellowMat);
    face.position.z = 135;
    return face;
  }

  private createMustaches(): Array<THREE.Mesh> {
    const mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
    mustacheGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(15, 0, 0));

    const mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
    mustache1.position.x = 30;
    mustache1.position.y = -5;
    mustache1.position.z = 175;

    const mustache2 = mustache1.clone();
    mustache2.position.x = 35;
    mustache2.position.y = -12;

    const mustache3 = mustache1.clone();
    mustache3.position.y = -19;
    mustache3.position.x = 30;

    const mustache4 = mustache1.clone();
    mustache4.rotation.z = Math.PI;
    mustache4.position.x = -30;

    const mustache5 = mustache2.clone();
    mustache5.rotation.z = Math.PI;
    mustache5.position.x = -35;

    const mustache6 = mustache3.clone();
    mustache6.rotation.z = Math.PI;
    mustache6.position.x = -30;

    return [mustache1, mustache2, mustache3, mustache4, mustache5, mustache6]
  }

  private createSpots(): Array<THREE.Mesh> {
    const spotGeom = new THREE.BoxGeometry(4, 4, 4);

    const spot1 = new THREE.Mesh(spotGeom, this.redMat);
    spot1.position.x = 39;
    spot1.position.z = 150;

    const spot2 = spot1.clone();
    spot2.position.z = 160;
    spot2.position.y = -10;

    const spot3 = spot1.clone();
    spot3.position.z = 140;
    spot3.position.y = -15;

    const spot4 = spot1.clone();
    spot4.position.z = 150;
    spot4.position.y = -20;

    const spot5 = spot1.clone();
    spot5.position.x = -39;
    const spot6 = spot2.clone();
    spot6.position.x = -39;
    const spot7 = spot3.clone();
    spot7.position.x = -39;
    const spot8 = spot4.clone();
    spot8.position.x = -39;

    return [spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8]
  }

  private createEyes(): Array<THREE.Mesh> {
    const eyeGeom = new THREE.BoxGeometry(5, 30, 30);
    const leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    leftEye.position.x = 40;
    leftEye.position.z = 120;
    leftEye.position.y = 25;

    const rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
    rightEye.position.x = -40;
    rightEye.position.z = 120;
    rightEye.position.y = 25;

    return [leftEye, rightEye];
  }

  private createIrises(): Array<THREE.Mesh> {
    const irisGeom = new THREE.BoxGeometry(4, 10, 10);
    const leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
    leftIris.position.x = 42;
    leftIris.position.z = 120;
    leftIris.position.y = 25;

    const rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
    rightIris.position.x = -42;
    rightIris.position.z = 120;
    rightIris.position.y = 25;
    return [leftIris, rightIris];
  }

  private createMouth(): THREE.Mesh {
    const mouthGeom = new THREE.BoxGeometry(20, 20, 10);
    const mouth = new THREE.Mesh(mouthGeom, this.blackMat);
    mouth.position.z = 171;
    mouth.position.y = -30;
    mouth.scale.set(.5, .5, 1);
    return mouth;
  }

  private createSmile(): THREE.Mesh {
    const smileGeom = new THREE.TorusGeometry(12, 4, 2, 10, Math.PI);
    const smile = new THREE.Mesh(smileGeom, this.blackMat);
    smile.position.z = 173;
    smile.position.y = -15;
    smile.rotation.z = -Math.PI;
    return smile;
  }

  private createLips(): THREE.Mesh {
    const lipsGeom = new THREE.BoxGeometry(40, 15, 20);
    const lips = new THREE.Mesh(lipsGeom, this.yellowMat);
    lips.position.z = 165;
    lips.position.y = -45;

    return lips;
  }

  private createEars(): Array<THREE.Mesh> {
    const earGeom = new THREE.BoxGeometry(20, 20, 20);

    const rightEar = new THREE.Mesh(earGeom, this.yellowMat);
    rightEar.position.x = -50;
    rightEar.position.y = 50;
    rightEar.position.z = 105;

    const leftEar = new THREE.Mesh(earGeom, this.yellowMat);
    leftEar.position.x = 50;
    leftEar.position.y = 50;
    leftEar.position.z = 105;
    return [rightEar, leftEar];
  }

  private createNose(): THREE.Mesh {
    const noseGeom = new THREE.BoxGeometry(40, 40, 20);
    const nose = new THREE.Mesh(noseGeom, this.greyMat);
    nose.position.z = 170;
    nose.position.y = 25;

    return nose
  }

  private createHead(): THREE.Group {
    const head = new THREE.Group();

    this.mane = this.createMane();
    head.add(this.mane);

    head.add(this.createFace());

    [this.rightEar, this.leftEar] = this.createEars();
    head.add(this.rightEar, this.leftEar);

    [this.leftEye, this.rightEye] = this.createEyes();
    head.add(this.rightEye, this.leftEye);

    [this.leftIris, this.rightIris] = this.createIrises();
    head.add(this.leftIris, this.rightIris);

    head.add(this.createNose());

    this.mouth = this.createMouth();
    head.add(this.mouth);

    this.smile = this.createSmile()
    head.add(this.smile);

    this.lips = this.createLips();
    head.add(this.lips);

    head.add(...this.createSpots());

    this.mustaches = this.createMustaches();
    head.add(...this.mustaches);

    head.position.y = 60;
    return head;
  }

  private updateBodyVertices() {
    this.bodyVertices.forEach((vertice, i) => {
      const tvInit = this.bodyInitPositions[i];
      const tv = this.body.geometry.getAttribute('position');
      tv.setX(i, tvInit.x + this.head.position.x);
    })
  }

  private addShadows() {
    this.tGroup.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }
}
