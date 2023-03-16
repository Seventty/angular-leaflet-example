import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../services/marker.service';
import 'leaflet-draw';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'leaflet',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  public lat: number = 18.477923;
  public long: number = -69.933491;
  private map: any;

  public errorColor: string = "#f35858";
  public primaryColor: string = "#f37f58";

  private initMap(): void {

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://mepyd.gob.do/">Ministerio de Economica, Planificacion y Desarrollo</a>'
    });

    this.map = L.map('map', {
      center: [this.lat, this.long],
      zoom: 8,
      zoomControl: false,
    });

    L.control.zoom({
      position: "topright"
    }).addTo(this.map);

    const drawFeatures = new L.FeatureGroup();
    this.map.addLayer(drawFeatures);

    const options: any = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: this.primaryColor,
            weight: 10
          }
        },
        polygon: {
          allowIntersection: false,
          drawError: {
            color: this.errorColor,
            message: '<strong>Figura Erronea:</strong> ¡No puedo dibujar esta figura!'
          },
          shapeOptions: {
            color: this.primaryColor
          }
        },
        circle: true,
        rectangle: {
          shapeOptions: {
            clickable: true,
          }
        },

      },
      edit: {
        featureGroup: drawFeatures, //REQUIRED!!
        remove: false
      }
    };

    const drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    this.map.on("draw:created", (e: any) => {
      const type = e.layerType;
      const layer = e.layer;

      console.log("🚀 ~ file: map.component.ts:102 ~ MapComponent ~ this.map.on ~ e:", layer)
      drawFeatures.addLayer(layer);
    });

    this.map.on("draw:edited", function(e: any){
      const type = e.layerType;
      const layers = e.layer;

      layers.eachLayer(function(e: any){
        console.log(e)
      })
    })

    tiles.addTo(this.map);
  }

  constructor(private markerService: MarkerService) { }
  ngAfterViewInit(): void {
    this.localDrawConfigurator()
    this.initMap();
    //this.markerService.makeCapitalMarkers(this.map);
  }


  localDrawConfigurator(){
    L.drawLocal.draw.toolbar.buttons.polyline = 'Herramienta para dibujar una Linea';
    L.drawLocal.draw.toolbar.buttons.polygon = 'Herramienta para dibujar un Poligono';
    L.drawLocal.draw.toolbar.buttons.rectangle = 'Herramienta para dibujar un Rectangulo';
    L.drawLocal.draw.toolbar.buttons.circle = 'Herramienta para dibujar un Circulo';
    L.drawLocal.draw.toolbar.buttons.marker = 'Herramienta para dibujar un Punto de Referencia';
    L.drawLocal.draw.toolbar.buttons.circlemarker = 'Herramienta para dibujar un Marcador Circular';

    L.drawLocal.draw.handlers.polyline.tooltip.start = 'Haz click y arrastra para crear una Linea';
    L.drawLocal.draw.handlers.polygon.tooltip.start = 'Haz click y arrastra para crear un perimetro de Poligono';
    L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Haz click y arrastra para crear un perimetro de Rectangulo';
    L.drawLocal.draw.handlers.circle.tooltip.start = 'Haz click y arrastra para crear un radio de Circulo';
    L.drawLocal.draw.handlers.marker.tooltip.start = 'Haz click sobre cualquier lugar del mapa para poner un Punto de Referencia';
    L.drawLocal.draw.handlers.circlemarker.tooltip.start = 'Haz click y arrastra para crear un marcador Circular';
  }
}
