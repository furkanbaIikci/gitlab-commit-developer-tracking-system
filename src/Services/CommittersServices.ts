import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { Committers } from "src/app/Committers";
import { Project } from "src/app/Project";

@NgModule()
export class CommittersServices{
    projects:Committers[] = [];
    filteredCommitterss:Committers[] = [];
    projectName:String = ""!;
    constructor(private http:HttpClient){}


    async getProjectsName(projectId:any):Promise<String>{
        await this.http.get<Project>("https://gitlab.com/api/v4/projects/" + projectId +"/").toPromise().then((data)=>{
            if(data?.name!=null){
                this.projectName =  data.name;

            }
        })
        return this.projectName;
    }

     async getCommittersDetails(projectId:any):Promise<Committers[]>{
        this.projects= [];
         await this.http.get<Committers[]>("https://gitlab.com/api/v4/projects/" + projectId +"/repository/commits/?per_page=100000").toPromise().then((data)=>{
            
         if(data!=null){
            this.projects = data;
         }
        })
        return this.projects;
    }

    async getCommittersDetailsWithDates(startDate:any, endDate:any):Promise<Committers[]>{
        this.filteredCommitterss = [];
        this.projects.forEach(element => {
            let projectDate = new Date(element.committed_date.substring(0,10));            
            if(startDate<=projectDate && endDate>=projectDate){
                this.filteredCommitterss.push(element);   
            }
        });        
        return this.filteredCommitterss;
    }

}