import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GroupProject } from 'src/app/GroupsProjects';
import { Subgroups } from 'src/app/Subgroups';

@NgModule()
export class GroupProjectServices {
    projects!:GroupProject[];
    subgroups!:Subgroups[];

  constructor(private http: HttpClient) {}

  async getGroups(groupId: any,page:Number,perpage:Number):Promise<GroupProject[]> {
    await this.http.get<GroupProject[]>("https://gitlab.com/api/v4/groups/"+ groupId +"/projects?per_page="+perpage+"&page=" + page).toPromise().then((data)=>{
        if(data!=null){
        this.projects = data;
    }
    })
    return this.projects;
  }


  async getSubGroups(groupId: any,page:Number,perpage:Number):Promise<Subgroups[]>{
    
    await this.http.get<Subgroups[]>("https://gitlab.com/api/v4/groups/"+ groupId +"/subgroups?per_page="+perpage+"&page=" + page).toPromise().then((data)=>{
    
    if(data!=null){
      this.subgroups = data;
    }      
   })

    return this.subgroups;
  }
}
