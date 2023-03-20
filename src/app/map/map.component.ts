import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../services/marker.service';
import 'leaflet-draw';
import { Figuras } from '../enums/figuras.enum';
import { MapOptions } from '../enums/mapOptions.enum';

@Component({
  selector: 'LeafletMap',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() ViewMode: boolean = false;
  @Input() EditMode: boolean = false;
  @Input() FormulacionId: number = 0;
  @Input() TablaId: number = 0;
  @Output() mapDataEmitter = new EventEmitter;

  public lat: number = 18.477923;
  public long: number = -69.933491;
  private map: any;

  public errorColor: string = "#f35858";
  public primaryColor: string = "#f37f58";
  public figureType: Array<string> = ["polyline", "polygon", "rectangle", "circle", "marker", "circlemarker"]
  public mapDataCollection: Array<any> = [];

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
        rectangle: {
          showArea: false,
          shapeOptions: {
            color: this.primaryColor
          }
        },
        circle: {
          shapeOptions: {
            color: this.primaryColor
          }
        },
      },
      edit: {
        featureGroup: drawFeatures, //REQUIRED!!
        remove: true
      }
    };

    const drawControl = new L.Control.Draw(options);
    if (!this.ViewMode) this.map.addControl(drawControl);

    //! Creando figura en mapa
    this.map.on("draw:created", (e: any) => {
      const { layer, layerType } = e;
      const option = MapOptions.Created;
      drawFeatures.addLayer(layer);
      this.drawHandler(layer, layerType, option);
    });

    //! Editando figura en mapa
    this.map.on("draw:edited", (e: any) => {
      console.log("EVENTO EDITAR", e);
      const option = MapOptions.Edited;

      e.layers.eachLayer((layer: any) => {
        this.drawHandler(layer, layer.toGeoJSON().geometry.type.toLowerCase(), option)
      })
    });

    //! Borrando figura en mapa
    this.map.on("draw:deleted", (e: any) => {
      const { layers, layerType } = e;
      const option = MapOptions.Deleted;

      e.layers.eachLayer((layer: any) => {
        this.deleteDataFromCollection(layer._leaflet_id);
      })
    });

    tiles.addTo(this.map);
  }

  drawHandler(drawEventLayer: any, drawEventLayerType: any, option: string) {
    const { coordinates } = drawEventLayer.toGeoJSON().geometry;
    const figuraId = drawEventLayer._leaflet_id;
    const tipoGeometriaId = this.figureType.indexOf(drawEventLayerType);

    switch (option) {
      case "created":
        this.pushDataToCollection(this.mappedData(figuraId, tipoGeometriaId, coordinates));
        // TODO: Mapear todos los objetos & hacerle push al arreglo
        break;
      case "edited":
        this.editDataInCollection(figuraId, this.mappedData(figuraId, tipoGeometriaId, coordinates))
        // TODO: Identificar el id del objeto pusheado para sobreescribirlo
        break;
      case "deleted":
        //this.deleteDataFromCollection(figuraId)
        // TODO: Identificar el id del objeto pusheado para borrarlo de la colección del arreglo
        break;
      default:
        break;
    }
  }

  mappedData(figuraId: number, tipoGeometria: number, coordenadas: Array<any>) {
    return {
      id: this.TablaId,
      formulacionId: this.FormulacionId,
      figuraId: figuraId,
      tipoGeometriaId: tipoGeometria,
      coordenadas: coordenadas
    }
  }

  pushDataToCollection(data: any){
    this.mapDataCollection.push(data);
    this.mapDataEmitter.emit(this.mapDataCollection);
  }

  editDataInCollection(figuraId: number, newDraw: any){
    const index = this.mapDataCollection.findIndex(drawObject => drawObject.figuraId === figuraId);
    this.mapDataCollection[index] = newDraw;
    this.mapDataEmitter.emit(this.mapDataCollection);
  }

  deleteDataFromCollection(figuraId: number){
    const index = this.mapDataCollection.findIndex(drawObject => drawObject.figuraId === figuraId);
    if (index !== -1) {
      this.mapDataCollection.splice(index, 1);
    }

    this.mapDataEmitter.emit(this.mapDataCollection);
  }

  localDrawConfigurator() {
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
    L.drawLocal.draw.toolbar.finish.text = "Finalizar";
    L.drawLocal.draw.toolbar.finish.title = "Finaliza el trazado";
    L.drawLocal.draw.toolbar.undo.text = "Revertir punto trazado";
    L.drawLocal.draw.toolbar.undo.title = "Revertir el ultimo punto trazado punto";
  }

  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
    this.localDrawConfigurator()
    this.initMap();
    //this.markerService.makeCapitalMarkers(this.map);
  }
}
