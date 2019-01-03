import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServersService } from '../servers.service';
import { Route, Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CanDeactivateGuard, CanComponentDeactivate } from './can-deactivate-guard.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, OnDestroy, CanComponentDeactivate  {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  paramSubs: Subscription;
  allowEdit: boolean = false;
  changesSaved = false;

  constructor(private serversService: ServersService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.paramSubs = this.route.queryParams.subscribe(
      ( queryParams: Params ) => {
        this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      }
    );
    this.server = this.serversService.getServer(1);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.allowEdit) {
        return true;
      } 
      if ( ( this.serverName !== this.server.name || this.serverStatus !== this.server.status ) &&
            !this.changesSaved) {
              return confirm('Do you want to discard the changes?');
      } else {
        return true;
      }
  }

  ngOnDestroy() {
    this.paramSubs.unsubscribe();
  }

}
