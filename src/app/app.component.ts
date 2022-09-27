import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Committers } from 'src/app/Committers';
import { CommittersServices } from 'src/Services/CommittersServices';
import { iif } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { group } from '@angular/animations';
import { GroupProjectServices } from 'src/Services/GroupProjectServices';
import { GroupProject } from './GroupsProjects';
import { Subgroups } from './Subgroups';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'GitlabAPI';

  basicData: any;

  basicOptions: any;

  project!: Committers[];
  committers!: Set<String>;
  showCommitters: boolean = false;
  showGroupProjects: Boolean = false;
  showProjectForGroup: Boolean = false;
  selectedCommitters = new Set<any>();
  selectedProjects = new Set<any>();

  justOneTime: boolean = true;

  a!: MenuItem;

  groupProjects!: GroupProject[];
  subgroups!: Subgroups[];

  projectName!: String;

  projectOrGroup: boolean = true;
  withDate: boolean = true;

  startDate!: Date;
  endDate!: Date;
  showChartBool: Boolean = false;
  showSubgroups: Boolean = true;

  committersCount!: Map<String, Number>;

  groupProjectLength!: number;
  subgroupsGroupsLength!: number;

  groupsPage: number = 1;
  subgroupsPage: number = 1;

  warnMessage!: any[];

  globalGroupId!: number;

  items!: MenuItem[];
  subgroupsBreadcrumb!: Set<Number>;
  subgroupsNames!: String;


  constructor(
    private committersService: CommittersServices,
    private groupProjectService: GroupProjectServices,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();

    this.committersCount = new Map<String, Number>();
    this.committers = new Set<String>();
    this.project = [];
    this.groupProjectLength = 0;
    this.subgroupsGroupsLength = 0;

    this.subgroupsBreadcrumb = new Set<Number>();
    this.subgroupsNames = '';
  }

  change(projectId: any) {
    console.log(projectId);
  }

  async getProjectDetails(projectId: any) {
    if (projectId == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Project ID',
        detail: 'No project ID selected',
      });
      setTimeout(() => {
        this.messageService.clear();
      }, 1500);
    } else {
      this.projectName = await this.committersService.getProjectsName(
        projectId
      );
      await this.delete();
      this.project = await this.committersService.getCommittersDetails(
        projectId
      );

      this.project.forEach((element) => {
        
        this.committers.add(element.committer_name);
      });
      if (this.committers.size != 0) {
        this.showCommitters = true;
      }
    }
  }

  async getCommitters(groupId: any) {
    this.groupsPage = 1;
    console.log('caliisoyr');

    while (true) {
      this.groupProjects = await this.groupProjectService.getGroups(
        groupId,
        this.groupsPage,
        100
      );

      this.groupProjects.forEach(async (element) => {
        console.log('group porject element ', element.id);

        this.project = await this.committersService.getCommittersDetails(
          element.id
        );
        console.log(this.project);

        this.project.forEach((element) => {
          this.committers.add(element.committer_name);
        });
        console.log(this.committers.size);
      });

      if (
        this.groupProjects.length % 100 == 0 &&
        this.groupProjects.length != 0
      ) {
        this.groupsPage++;
      } else {
        this.showCommitters = true;

        break;
      }
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
      if (this.startDate != null && this.endDate != null) {
        this.project = [];
        this.project =
          await this.committersService.getCommittersDetailsWithDates(
            this.startDate,
            this.endDate
          );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Date',
          detail: 'No date selected',
        });
        setTimeout(() => {
          this.messageService.clear();
        }, 1500);
      }
    }
    await this.createChartData();
    await this.drawChart();
  }

  async createChartData() {
    this.committersCount.clear();
    let count = 0;
    this.selectedCommitters.forEach((element) => {
      count = 0;
      this.project.forEach((elementCommitters) => {
        if (elementCommitters.committer_name === element) {
          count++;
        }
      });
      this.committersCount.set(element, count);
    });
  }

  async drawChart() {
    let labelData = Array.from(this.committersCount.keys());
    let datasetsData = Array.from(this.committersCount.values());

    let backgroundColor: string[] = [];
    let color;
    labelData.forEach((element) => {
      color = Math.floor(Math.random() * 16777216).toString(16);
      backgroundColor.push('#000000'.slice(0, -color.length) + color);
    });

    this.basicData = {
      labels: labelData,
      datasets: [
        {
          label: this.projectName,
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
    this.showChartBool = true;
  }

  async getGroupProject(groupId: any, e?:any) {
    this.subgroups = [];
    this.groupProjects = [];
    this.subgroupsPage = 1;
    this.groupsPage = 1;
    this.subgroupsGroupsLength = 0;
    this.groupProjectLength = 0;
    this.committers.clear();
    
    if(e!=null){
      this.subgroupsBreadcrumb.clear();
    }

    if (groupId == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Group ID',
        detail: 'No Group ID selected',
      });

      setTimeout(() => {
        this.messageService.clear();
      }, 1500);
    } else {
      this.subgroupsBreadcrumb.add(groupId);
      this.globalGroupId = groupId;

      let projectsId = await this.groupProjectService.getGroups(groupId,1,10000);
      projectsId.forEach(async element => {
        let temp = await this.committersService.getCommittersDetails(element.id);
        temp.forEach(element => {
          this.committers.add(element.committer_name);
        });
      });
      try {
        while (true) {
          this.subgroups = await this.groupProjectService.getSubGroups(
            groupId,
            this.subgroupsPage,
            100
          );

          if (this.subgroups.length % 100 == 0 && this.subgroups.length != 0) {
            this.subgroupsPage++;
            this.subgroupsGroupsLength += this.subgroups.length;
          } else {
            this.subgroupsGroupsLength += this.subgroups.length;
            break;
          }
        }

        while (true) {
          this.groupProjects = await this.groupProjectService.getGroups(
            groupId,
            this.groupsPage,
            100
          );

          if (
            this.groupProjects.length % 100 == 0 &&
            this.groupProjectLength != 0
          ) {
            this.groupsPage++;
            this.groupProjectLength += this.groupProjects.length;
          } else {
            this.groupProjectLength += this.groupProjects.length;

            break;
          }
        }

        this.showGroupProjects = true;
        this.subgroupsPage = 1;
        this.groupsPage = 1;
        this.subgroups = await this.groupProjectService.getSubGroups(
          groupId,
          1,
          20
        );
        this.groupProjects = await this.groupProjectService.getGroups(
          groupId,
          1,
          20
        );
          this.showProjectForGroup = true;
      } catch (error) {
        this.showGroupProjects = false;
        this.subgroupsBreadcrumb.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Unexpected Error',
          detail: 'Please try again',
        });

        setTimeout(() => {
          this.messageService.clear();
        }, 1500);
      }
    }
  }

  async changeSelectedProjects(e: any) {
    if (!this.selectedProjects.has(e)) {
      this.selectedProjects.add(e);
    } else {
      this.selectedProjects.delete(e);
    }    
  }

  async getSubgroups(groupId: any) {
    this.getGroupProject(groupId);
    this.subgroups = await this.groupProjectService.getSubGroups(
      groupId,
      this.subgroupsPage,
      20
    );
    console.log(this.subgroups);

    this.getProjects(groupId);

    console.log('calis');
  }

  async getProjects(groupId: any) {
    this.groupProjects = await this.groupProjectService.getGroups(
      groupId,
      this.groupsPage,
      20
    );
  }

  denemee(e: any) {
    console.log(e);

    let subgroupsBreadcrumbArr = Array.from(this.subgroupsBreadcrumb);
    for (let index = this.subgroupsBreadcrumb.size - 1; index > 0; index--) {
      if (subgroupsBreadcrumbArr[index] != e) {
        subgroupsBreadcrumbArr.pop();
      } else {
        break;
      }
    }

    this.subgroupsBreadcrumb.clear();
    subgroupsBreadcrumbArr.forEach((element) => {
      this.subgroupsBreadcrumb.add(element);
    });
    this.groupProjects = [];
    this.getGroupProject(e);
  }

  paginate(e: any) {
    console.log(e.page + 1);
  }

  idToLabelForSubgroups(projectId: any) {
    this.subgroups.forEach((element) => {
      if (projectId === element.id) {
        this.subgroupsNames = element.name;
      }
      console.log(element.id);
      console.log(element.name);
    });
    return this.subgroupsNames;
  }

  async changedSubgroupPage(e: any) {
    this.subgroups = await this.groupProjectService.getSubGroups(
      this.globalGroupId,
      e,
      20
    );
    console.log(this.subgroups);
  }

  async changedGroupPage(e: any) {
    this.groupProjects = await this.groupProjectService.getGroups(
      this.globalGroupId,
      e,
      20
    );
    console.log(this.groupProjects);
  }
}
