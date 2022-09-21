import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { Project } from "src/app/Project";

@NgModule()
export class ProjectServices{
    projects:Project[] = [];
    constructor(private http:HttpClient){}

     async getProjectDetails(projectId:any):Promise<Project[]>{
        
         await this.http.get<Project[]>("https://gitlab.com/api/v4/projects/" + projectId +"/repository/commits/").toPromise().then((data)=>{
            data?.forEach(element => {
                this.projects.push(element);
                
            });
        })
        return this.projects;
    }

}