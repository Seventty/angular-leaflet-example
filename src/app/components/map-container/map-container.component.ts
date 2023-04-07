import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'mapContainer',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {
  @Input() title: string = ''

  constructor(private modalService: NgbModal,) { }

  ngOnInit() {
  }

  mapData(data: any){
    console.log("Data from event emmiter", data)
  }

  uploadFiles(){
    console.log("Subir archivos")
  }

  openUploadFileMapModal(content: any) {
    this.modalService.open(content, { size: 'xl', centered: true });
  }

}
