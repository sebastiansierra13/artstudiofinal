import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { DividerModule } from 'primeng/divider';
import {MatDividerModule} from '@angular/material/divider';
import { FloatingButtonsComponent } from "../floating-buttons/floating-buttons.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component"
import { FooterComponent } from "../footer/footer.component"

@Component({
    selector: 'app-about-us',
    standalone: true,
    templateUrl: './about-us.component.html',
    styleUrl: './about-us.component.css',
    imports: [ButtonModule, SplitterModule, DividerModule, MatDividerModule, FloatingButtonsComponent,NavBarComponent,FooterComponent]
})
export class AboutUsComponent {

}
