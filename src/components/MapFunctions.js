import * as mapboxgl from "mapbox-gl";
import * as THREE from "three";

export const makeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidGVoLXJhcHRvciIsImEiOiJjamdmZDExMTYyaXVnMnhxZTN6ZDNncmxnIn0.PZyUBVM9BCLM65ozSvBb1A";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/teh-raptor/cjgff1y62000e2rq7wm80q9xa",
    center: [139.768, 35.669],
    zoom: 15,
    pitch: 45,
    bearing: -17.6,
    id: "crab"
  });

  return map;
};

// converts from WGS84 Longitude, Latitude into a unit vector anchor at the top left as needed for GL JS custom layers
export const fromLL = function(lon, lat) {
  // derived from https://gist.github.com/springmeyer/871897
  const extent = 20037508.34;

  const x = (lon * extent) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * extent) / 180;

  return [(x + extent) / (2 * extent), 1 - (y + extent) / (2 * extent)];
};

export const transformFromLL = (lon, lat) => {
  const translation = fromLL(lon, lat);
  const transform = {
    translateX: translation[0],
    translateY: translation[1],
    translateZ: 0,
    rotateX: Math.PI / 2,
    rotateY: 0,
    rotateZ: 0,
    scale: 1.41843220338983e-8
  };
  return transform;
};

export const threeDModel = (transform, id) => ({
  id,
  type: "custom",
  renderingMode: "3d",
  onAdd: function(map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    this.scene.add(directionalLight2);

    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      transparent: true,
      opacity: Math.random() + 0.2
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
    this.map = map;

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });

    this.renderer.autoClear = false;
  },
  render: function(gl, matrix) {
    // const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), transform.rotateX);
    // const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), transform.rotateY);
    // const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), transform.rotateZ);

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        transform.translateX,
        transform.translateY,
        transform.translateZ
      )
      .scale(
        new THREE.Vector3(transform.scale, -transform.scale, transform.scale)
      );
    // this.sphere.scale.y += Math.sin(Date.now() * Math.random());
    // this.sphere.scale.x += Math.sin(Date.now() * Math.random());
    // .multiply(rotationX)
    // .multiply(rotationY)
    // .multiply(rotationZ);

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }
});
