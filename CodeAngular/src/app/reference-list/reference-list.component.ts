import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reference-list',
  templateUrl: './reference-list.component.html',
  styleUrls: ['./reference-list.component.css']
})
export class ReferenceListComponent implements OnInit {

  showRetail = false;
  showCatering = false;

  constructor()
  {
  }

  ngOnInit() 
  {
  }

  toggleRetail()
  {
    this.showRetail = !this.showRetail;
  }

  toggleCatering()
  {
    this.showCatering = !this.showCatering;
  }
}
