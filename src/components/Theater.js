import React, { useEffect, useContext, Fragment } from "react";
import videoURL from "../tokyo-teamlab_ball2-2000.mp4";
import { MapContext } from "../Context";
import { ReturnToMap } from "./ReturnToMap";
import vidData from "./result.json";
import dog from "./dog2.mp4";
const THREE = window.THREE;
export const Theater = () => {
  const { state } = useContext(MapContext);
  const { place, file, extension } = state;
  useEffect(() => {
    let camera, scene, renderer, controls, video;
    let myReq;
    init();
    animate();
    function init() {
      let container, mesh;

      container = document.getElementById("container");

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1110
      );
      camera.position.z = 0.01;
      //camera.target = new THREE.Vector3(0, 0, 0)

      scene = new THREE.Scene();

      const geo = new THREE.SphereBufferGeometry(500, 60, 40);
      geo.scale(-1, 1, 1);

      const baseURL = "http://tokyo-360s.storage.googleapis.com";
      // const place = "kyoto-kamo_river";
      // const file = "kyoto-kamo_river-grandma_biker";
      // const extension = "mp4";
      const gcpURL = `${baseURL}/${place}/${file}.${extension}`;

      let texture;
      if (extension === "mp4") {
        video = document.createElement("video");
        video.id = "vid";
        video.crossOrigin = "anonymous";
        video.width = 2000;
        video.height = 1000;
        video.loop = true;
        console.log(gcpURL);
        video.src = gcpURL;
        //        video.src = dog;
        video.setAttribute("webkit-playsinline", "webkit-playsinline");
        video.play();
        texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBEFormat;
        texture.mapping = THREE.SphericalReflectionMapping;
      } else {
        texture = new THREE.TextureLoader().load(gcpURL);
      }

      const material = new THREE.MeshBasicMaterial({ map: texture });

      mesh = new THREE.Mesh(geo, material);

      scene.add(mesh);

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      container.appendChild(renderer.domElement);
    }

    function animate() {
      myReq = requestAnimationFrame(animate);
      update();
    }

    function update() {
      console.log("update");
      renderer.render(scene, camera);
      controls.update();
    }

    return () => {
      try {
        video.src = "";
      } catch (e) {
        console.log(e);
      }
      window.cancelAnimationFrame(myReq);
    };
  });

  return (
    <Fragment>
      <ReturnToMap />
      <div id="container" />
    </Fragment>
  );
};
