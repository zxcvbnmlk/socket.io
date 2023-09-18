import {Title} from '@angular/platform-browser';
import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {menuItems} from '@app/_models/shell'
import {AuthenticationService, CredentialsService} from '@app/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  menuItems: menuItems[] = [
    {name: 'home', title: 'home', icon: 'home', link: '/home'},
    {name: 'search', title: 'search', icon: 'search', link: '/search'},
    {name: 'canvas', title: 'canvas', icon: 'edit', link: '/canvas'},
    // {name: 'solid', title: 'solid', icon: 'edit', link: '/solid'},
  ]

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], {replaceUrl: true}));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
