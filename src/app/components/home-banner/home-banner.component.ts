import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.css'
})
export class HomeBannerComponent {

}
