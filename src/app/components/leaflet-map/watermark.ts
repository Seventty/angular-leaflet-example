import { Control, ControlOptions, DomUtil } from 'leaflet';

export class Watermark extends Control {
  constructor(options: ControlOptions) {
    super(options);
  }

  override onAdd(map: L.Map): HTMLElement {
    const img = DomUtil.create('img');

    img.src = '../../assets/LOGO.png';
    img.style.width = '200px';

    return img;
  }

  override onRemove(map: L.Map): void {
    // Nothing to do here
  }
}
