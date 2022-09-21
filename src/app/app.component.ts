import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from "src/app/Project";
import { ProjectServices } from 'src/Services/ProjectServices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'GitlabAPI';

  basicData: any;

  basicOptions: any;

  project:Project[] = [];
  committers = new Set<any>;
  showCommitters:boolean=false;
  selectedCommitters = new Set<any>;

  projectOrGroup: boolean = true;
  
  constructor(private projectService:ProjectServices) {}

  ngOnInit() {
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#FFA726',
          data: [28, 48, 40, 19, 86, 27, 90],
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


  change(projectId:any){
    console.log(projectId);
    
    
  }

  async getProjectDetails(projectId:any){
    this.project = await this.projectService.getProjectDetails(projectId);
    
    this.project.forEach(element => {
      this.committers.add(element.committer_name)
    });
    console.log(this.committers);
    if(this.committers.size!=0){
      this.showCommitters = true;
    }
  }



  changeRadioForProject(){
    this.projectOrGroup = true;
  }

  changeRadioForGroup(){
    this.projectOrGroup = false;
  }

  deneme(a:any){
    if(!this.selectedCommitters.has(a)){
      this.selectedCommitters.add(a);
    }else{
      this.selectedCommitters.delete(a);
    }
    console.log(this.selectedCommitters);
    
  }

}








