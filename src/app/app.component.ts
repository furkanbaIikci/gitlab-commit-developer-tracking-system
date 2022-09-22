import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Committers } from 'src/app/Committers';
import { CommittersServices } from 'src/Services/CommittersServices';
import { iif } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]

})
export class AppComponent {
  title = 'GitlabAPI';

  basicData: any;

  basicOptions: any;

  project!: Committers[];
  committers!: Set<String>;
  showCommitters: boolean = false;
  selectedCommitters = new Set<any>();
  
  projectName!:String;

  projectOrGroup: boolean = true;
  withDate: boolean = true;

  startDate!: Date ;
  endDate!: Date;

  committersCount!:Map<String,Number>;

  warnMessage!:any[];

  constructor(private committersService: CommittersServices, private messageService: MessageService) {}

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();

    this.committersCount = new Map<String,Number>();
    this.committers = new Set<String>();
    this.project = [];

  }

  change(projectId: any) {
    console.log(projectId);
  }

  async getProjectDetails(projectId: any) {
    this.projectName  =  await this.committersService.getCommittersName(projectId);    

    if(projectId ==""){      
      this.messageService.add({severity:'error', summary:'Committers ID', detail:'No project ID selected'});
      setTimeout(() => {
        this.messageService.clear();
      }, 1500);
    }else{

    await this.delete();
    this.project = await this.committersService.getCommittersDetails(projectId);
    console.log(this.project.length);

    this.project.forEach((element) => {
      this.committers.add(element.committer_name);
    });
    if (this.committers.size != 0) {
      this.showCommitters = true;
    }
    console.log(this.committers.size);
  }
  }

  async delete() {
    this.committers.clear();
  }

  changeRadioForProject() {
    this.projectOrGroup = true;
    this.project = [];
  }

  changeRadioForGroup() {
    this.projectOrGroup = false;
  }

  changeSelectedCommitters(a: any) {
    if (!this.selectedCommitters.has(a)) {
      this.selectedCommitters.add(a);
    } else {
      this.selectedCommitters.delete(a);
    }
  }

  changeWithoutDate() {
    this.withDate = false;
  }
  changeWithDate() {
    this.withDate = true;
  }

  changedStartDate(e: any) {
    this.startDate = new Date(e);
  }

  changedEndDate(e: any) {
    this.endDate = new Date(e);
  }

  async createChart() {
    if (this.withDate) {
      if (this.startDate !=null && this.endDate != null) {
        this.project = [];
        this.project = await this.committersService.getCommittersDetailsWithDates(this.startDate,this.endDate);
      }else{
        this.messageService.add({severity:'error', summary:'Date', detail:'No date selected'});
        setTimeout(() => {
          this.messageService.clear();
        }, 1500);
      }} 
      await this.createChartData();
      await this.drawChart();
      
      
  }

  async createChartData(){
    this.committersCount.clear();
    let count =0;
    this.selectedCommitters.forEach(element => {
      count = 0;
      this.project.forEach(elementCommitters => {
        if(elementCommitters.committer_name === element){
          count++;
        }
      });  
      this.committersCount.set(element,count)
    });   
    
  }
  
  async drawChart(){
    let labelData =Array.from(this.committersCount.keys());
    let datasetsData = Array.from(this.committersCount.values());


    let backgroundColor:string[] = [];
    let color;
    labelData.forEach(element => {
      color = (Math.floor(Math.random() * 16777216).toString(16));
      backgroundColor.push('#000000'.slice(0, -color.length) + color)
    });    
    
    this.basicData = {
      labels: labelData,
      datasets: [
        {
          label:this.projectName ,
          backgroundColor: backgroundColor,
          data: datasetsData,
        },
      ],
    };


    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: 'black',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'black',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)',
          },
        },
        y: {
          ticks: {
            color: 'black',
          },
          grid: {
            color: 'black',
          },
        },
      },
    };
  }

  
  

}
