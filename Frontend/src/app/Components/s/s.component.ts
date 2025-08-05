import {Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-s',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './s.component.html',
  styleUrl: './s.component.css',
})
export class SComponent {

  selected = 'option2';
  
 
}
