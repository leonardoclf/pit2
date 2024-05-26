import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMenssage:any;
	data:any;

	
	
	ngAfterViewInit() { }

	constructor(private dashBoardService: DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService: SnackbarService) {
			this.ngxService.start();
			this.dashboardData();
	}

	dashboardData(){
		this.dashBoardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
		}, (error:any) =>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMenssage = error.error?.message
			} else {
				this.responseMenssage = GlobalConstants.genericError
			}
			this.snackbarService.openSnackBar(this.responseMenssage,GlobalConstants.error);
		})
	}

}
