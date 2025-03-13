
import { Component, OnInit, Input,Output,EventEmitter  } from '@angular/core';
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  @Input() valor: string="";
  
  @Output() onComplete = new EventEmitter<void>();
  

  constructor() { }

  ngOnInit(): void {
   

  }

}
