import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.less']
})
export class CardTitleComponent implements OnInit {
  @Input() title: any;
  @Input() icon: any;
  @Input() description: any;
  @Input() link: any;
  constructor() { }

  ngOnInit(): void {
  }

}
