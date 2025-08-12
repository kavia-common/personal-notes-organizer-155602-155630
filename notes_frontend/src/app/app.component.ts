import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component that hosts the router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /** Application title used in meta and potential display. */
  title = 'Personal Notes Organizer';
}
