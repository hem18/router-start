import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServersService } from '../servers.service';
import { Route, Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, OnDestroy {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  paramSubs: Subscription;
  allowEdit: boolean = false;
  constructor(private serversService: ServersService, private route: ActivatedRoute) { }

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
  }

  ngOnDestroy() {
    this.paramSubs.unsubscribe();
  }

}
