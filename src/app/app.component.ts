import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ImageUploadComponent} from "./components/image-upload/image-upload.component";
import {FooterComponent} from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageUploadComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Yurii Klymenko test task';
}
