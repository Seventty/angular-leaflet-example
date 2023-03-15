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

    const editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    const options: any = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10
          }
        },
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#bada55'
          }
        },
        circle: true, // Turns off this drawing tool
        rectangle: {
          shapeOptions: {
            clickable: false
          }
        },

      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
      }
    };

    const drawControl = new L.Control.Draw({
      position: "topright"
    })
    this.map.addControl(drawControl);

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
