import paper from "paper";
import gifshot from "gifshot";
import { draw } from "./index";
//
import { get } from "svelte/store";
import { PatternStore } from "../stores";

// This function creates a download link and clicks it
export function download(url: string, name: string): void {
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = name;
  downloadLink.click();
}

// SVG Download
export function downloadSVG() {
  let svgData: any = paper.project.exportSVG(); // Use any when stuff is not recognized
  svgData.outerHTML; // So now we can use outerHTML even if not recognized by typescript
  const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  const svgBlob = new Blob([preface, svgData.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  const name = "hackustica.svg";
  //
  download(svgUrl, name);
}

export function downloadPNG() {
  const canvas = document.querySelector("canvas");
  const imgData = canvas.toDataURL();
  const name = "hackustica.png";
  download(imgData, name);
}

export function downloadGIF() {
  // Getting store for gif data
  const config = get(PatternStore);

  // This array will store the created images
  const imgs: Array<string> = [];
  // Here we create the images
  for (let i = 0; i < config.gif.duration * config.gif.frameRate; i++) {
    // Drawing a frame
    draw();
    // Getting reference to canvas
    const canvas = document.querySelector("canvas");
    // Saving image
    const imgData = canvas.toDataURL();
    imgs.push(imgData);
  }

  // And here we create the gif
  gifshot.createGIF(
    {
      images: imgs,
      frameDuration: 1 / config.gif.frameRate,
      gifWidth: document.querySelector("canvas").width,
      gifHeight: document.querySelector("canvas").height,
    },
    function (obj) {
      if (!obj.error) {
        var image = obj.image;
        download(image, "hackustica.gif");
      }
    }
  );
}
