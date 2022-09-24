import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  templateUrl: './upload-foto.component.html',
  styleUrls: ['./upload-foto.component.scss']
})
export class UploadFotoComponent implements OnInit {
  uid: string | null = null;

  constructor(private route: ActivatedRoute, private _nav: NavigateService) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    if(!this.uid) this._nav.navigateTo('/');
   }

  ngOnInit(): void {
    
  }

}
