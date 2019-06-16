import React, { useEffect } from "react";
import { makeMap, transformFromLL, threeDModel } from "./MapFunctions";

export const Map = () => {
  useEffect(() => {
    // Load the mapbox map
    const map = makeMap();

    const transform = transformFromLL(139.768, 35.669);
    const transform2 = transformFromLL(139.769, 35.669);
    const threeJSModel = threeDModel(transform, "model1");
    // const threeJSModel2 = threeDModel(transform2, "model2");

    // const models = [];
    // for (let i = 0; i < 10; i++) {
    //   models.push(threeDModel(transform, "m" + i));
    // }

    map.on("style.load", function() {
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#ccc",
          "fill-extrusion-height": ["get", "height"]
        }
      });

      var width = 64; // The image will be 64 pixels square
      var bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
      var data = new Uint8Array(width * width * bytesPerPixel);

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < width; y++) {
          var offset = (y * width + x) * bytesPerPixel;
          data[offset + 0] = (y / width) * 255; // red
          data[offset + 1] = (x / width) * 255; // green
          data[offset + 2] = 128; // blue
          data[offset + 3] = 255; // alpha
        }
      }

      map.addImage("gradient", { width: width, height: width, data: data });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [139.768, 35.669]
                }
              }
            ]
          }
        },
        layout: {
          "icon-image": "gradient"
        }
      });

      map.addLayer(threeJSModel);
      //map.addLayer(threeJSModel2);
      //models.forEach(m => map.addLayer(m));
    });

    map.on("click", "points", function(e) {
      map.flyTo({ center: e.coordinates, zoom: 25 });
      threeJSModel.sphere.material.color.setHex(0xffffff);
      console.log(threeJSModel.sphere.position);
      document.getElementById("map").style.display = "none";
    });

    return () => map.remove();
  }, []);
  return (
    <div>
      <div>
        <div
          style={{ backgroundColor: "red", width: "1080px", height: "1080px" }}
          id="theater"
          onClick={() => {
            console.log("hello?");
            document.getElementById("map").style.display = "block";
          }}
        >
          SEXY MEEPO
        </div>
        <div id="map" />
      </div>
    </div>
  );
};
