import paper from "paper";

// This sets the download
export function downloadSVG() {
  let svgData: any = paper.project.exportSVG(); // Use any when stuff is not recognized
  svgData.outerHTML; // So now we can use outerHTML even if not recognized by typescript
  const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  const svgBlob = new Blob([preface, svgData.outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  const name = "hackustica.svg";
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  downloadLink.click();
}

// const button_download_png: HTMLElement = document.querySelector(
//   ".controls__download_PNG"
// );
// button_download_png.onclick = function () {
//   const imgData = canvas.toDataURL();
//   const name = "hoffman100.png";
//   const downloadLink = document.createElement("a");
//   downloadLink.href = imgData;
//   downloadLink.download = name;
//   downloadLink.click();
// };
