import React, { useEffect } from "react"
import videoURL from "../tokyo-teamlab_ball2-2000.mp4"
const THREE = window.THREE
export const Theater = () => {
  useEffect(() => {
    let camera, scene, renderer, controls
    let myReq
    init()
    animate()
    function init() {
      let container, mesh

      container = document.getElementById("container")

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1110
      )
      camera.position.z = 0.01
      //camera.target = new THREE.Vector3(0, 0, 0)

      scene = new THREE.Scene()

      const geo = new THREE.SphereBufferGeometry(500, 60, 40)
      geo.scale(-1, 1, 1)

      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.width = 2000
      video.height = 1000
      video.loop = true
      video.src = videoURL

      video.setAttribute("webkit-playsinline", "webkit-playsinline")
      video.play()

      const texture = new THREE.VideoTexture(video)
      const material = new THREE.MeshBasicMaterial({ map: texture })

      mesh = new THREE.Mesh(geo, material)

      scene.add(mesh)

      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      controls = new THREE.OrbitControls(camera, renderer.domElement)
      container.appendChild(renderer.domElement)
    }

    function animate() {
      myReq = requestAnimationFrame(animate)
      update()
    }

    function update() {
      renderer.render(scene, camera)
      controls.update()
    }

    return () => window.cancelAnimationFrame(myReq)
  })

  return <div id="container" />
}
