import React, { useContext, useEffect } from "react";
import { makeMap, transformFromLL, threeDModel } from "./MapFunctions";
import coords from "./result.json";
import { MapContext } from "../Context";
export const Map = () => {
  const { dispatch } = useContext(MapContext);
  useEffect(() => {
    // Load the mapbox map
    const map = makeMap();

    // const transform = transformFromLL(139.7800295, 35.6476516);
    // const transform2 = transformFromLL(139.7810295, 35.6476516);
    // const threeJSModel = threeDModel(transform, "model1");
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

      let fts = [];
      let lonlat = [];
      const places = Object.keys(coords);
      places.forEach(place => {
        coords[place].forEach(o => {
          const { file, extension, lon, lat } = o;
          const obj = {
            type: "Feature",
            properties: {
              place,
              file,
              extension
            },
            geometry: {
              type: "Point",
              coordinates: [lon, lat]
            }
          };
          fts.push(obj);
          lonlat.push([lon, lat]);
        });
      });

      console.log(fts);

      map.addImage("gradient", { width: width, height: width, data: data });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: fts
            // features: [
            //   {
            //     type: "Feature",
            //     properties: {
            //       place: "kyoto-botanical",
            //       file: "kyoto-botanical-god_tree1-2000",
            //       extension: "mp4"
            //     },
            //     geometry: {
            //       type: "Point",
            //       coordinates: [139.7800295, 35.6476516]
            //     }
            //   },
            //   {
            //     type: "Feature",
            //     properties: {
            //       place: "kyoto-tenryu_ramen",
            //       file: "kyoto-tenryu_ramen",
            //       extension: "jpg"
            //     },
            //     geometry: {
            //       type: "Point",
            //       coordinates: [139.7820295, 35.6476516],
            //       name: "meepo"
            //     }
            //   }
            // ]
          }
        },
        layout: {
          "icon-image": "gradient"
        }
      });
      // lonlat.forEach((ll, i) => {
      //   console.log(ll);
      //   const transform = transformFromLL(parseFloat(ll[0]), parseFloat(ll[1]));
      //   const threeJSModel = threeDModel(transform, "model" + i);
      //   map.addLayer(threeJSModel);
      // });
    });

    map.on("click", "points", function(e) {
      map.flyTo({ center: e.coordinates, zoom: 25 });
      console.log(e.features[0].properties.place);
      // threeJSModel.sphere.material.color.setHex(0xffffff);
      // console.log(threeJSModel.sphere.position);
      const { place, file, extension } = e.features[0].properties;
      console.log(place);
      dispatch({ type: "theater", place, file, extension });
      // document.getElementById("map").style.display = "none";
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
        ></div>
        <div id="map" />
      </div>
    </div>
  );
};
