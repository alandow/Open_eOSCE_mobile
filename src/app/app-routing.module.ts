import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";


import { LoginComponent } from "./components/login/login.component";
import { ConfigComponent } from "./components/config/config.component";
import { ExamlistComponent } from "./components/exam/examlist/examlist.component";
import { ExamComponent } from "./components/exam/exam/exam.component";
/*
import { ExamComponent } from "./components/exam/exam/exam.component"; */

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
      },
      {
        path: 'config',
        component: ConfigComponent,
        data: { title: 'Config' }
      },
        {
        path: 'examlist',
        component: ExamlistComponent,
        data: { title: 'Exam list' }
      },
     {
        path: 'exam/:id',
        component: ExamComponent,
        data: { title: 'Exam Detail' }
      },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
