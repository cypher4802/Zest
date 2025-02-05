import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    this.loadTerrain();
    this.addLighting();
    this.terrain = null;
  }

  async loadTerrain() {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync("../assets/Nature.glb");
      this.terrain = gltf.scene;
      this.terrain.name = "terrain";
      this.terrain.traverse(child => {
        if (child.isMesh) {
          child.updateMatrixWorld();
        }
      });

      this.terrain.scale.set(50, 50, 50);
      this.terrain.position.y = 2.5;

      this.terrain.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.terrain);
    } catch (error) {
      console.error("Error loading terrain:", error);
    }
  }

  addLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  updateCamera(cube) {
    if (cube && cube.mesh) {
      this.camera.position.set(
        cube.mesh.position.x + 5,
        cube.mesh.position.y + 5,
        cube.mesh.position.z + 5
      );
      this.camera.lookAt(cube.mesh.position);
    }
  }

  render(cube) {
    this.updateCamera(cube);
    this.renderer.render(this.scene, this.camera);
  }
}

// Nature by 3Donimus [CC-BY] via Poly Pizza, shoutout for this amazing model :)
