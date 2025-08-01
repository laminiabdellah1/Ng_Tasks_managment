import { Injectable } from '@angular/core';
import { Task, Priority, Status } from '../models/task.model';
import { catchError, of, tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'api/tasks'; //point to the spring boot backend

  //mock data for demo
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Complete Angular Tutorial',
      description: 'Learn the basics of Angular framework',
      dueDate: new Date('2023-06-30'),
      priority: Priority.HIGH,
      status: Status.IN_PROGRESS,
      assignedTo: 'john.doe',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-15')
    },
    {
      id: 2,
      title: 'Create Task Management App',
      description: 'Build a task management application using Angular',
      dueDate: new Date('2023-07-15'),
      priority: Priority.MEDIUM,
      status: Status.TODO,
      assignedTo: 'john.doe',
      createdAt: new Date('2023-05-16'),
      updatedAt: new Date('2023-05-16')
    },
    {
      id: 3,
      title: 'Learn Spring Boot',
      description: 'Study Spring Boot for backend development',
      dueDate: new Date('2023-08-01'),
      priority: Priority.MEDIUM,
      status: Status.TODO,
      assignedTo: 'jane.smith',
      createdAt: new Date('2023-05-17'),
      updatedAt: new Date('2023-05-17')
    }
  ];


  constructor(private http: HttpClient) { }

  // in real apps theses methodes will send HTTP requests to the backend API
  //for now we work with mock data 

  getTasks() : Observable<Task[]>{
    // in real app : return this.http.get<Task[]>(this.apiUrl)
    return of(this.tasks).pipe(
      tap(_ => console.log('fetched tasks')),
      catchError(this.handleError<Task[]>('getTasks',[]))
    );
  }

  getTask(id: number): Observable<Task | undefined>{
    //in real app we return like : this.http.get<Task>(`${this.apiUrl}/${id}`)
    const task = this.tasks.find(t => t.id === id);

    return of(task).pipe(
      tap(_ => console.log(`fetched task id=${id}`)),
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );

  }

  addTask(task: Task): Observable<Task>{
    //in real app : return this.http.post<Task>(this.apiUrl,task)

    task.id = this.getNextId();
    task.createdAt = new Date();
    task.updatedAt = new Date();

    this.tasks.push(task);

    return of(task).pipe(
      tap((task) => console.log(`added task with id id = ${task.id}`)),
      catchError(this.handleError<Task>('addTask'))
    );
  }

  updateTask(task: Task): Observable<Task>{
    //in real app : return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task)

    const index = this.tasks.findIndex(t => t.id === task.id);

    if(index !== -1){
      task.updatedAt= new Date();
      this.tasks[index] = task;

    }
    return of(task).pipe(
      tap(_ => console.log(`updated task id=${task.id}`)),
      catchError(this.handleError<Task>('updatedTask'))
    )
  }

  deleteTask(task: Task): Observable<Task | null>{
    //in real app : return this.http.delete<Task>(`${this.apiUrl}/${id}`)

    const index = this.tasks.findIndex(t=> t.id === task.id);
    let deletedTask = null;

    if(index !== -1){
      deletedTask = this.tasks[index];
      this.tasks.splice(index,1);
    }

    return of(deletedTask).pipe(
      tap(_ => console.log(`deleted task id =${task.id}`)),
      catchError(this.handleError<Task>(`deletedTask`))
    )
  }


  private getNextId(): number {
    return Math.max(...this.tasks.map(task => task.id), 0) + 1;
  }

  private handleError<T>(operation='operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(`${operation} failed ${error.message}`);

      // let the app running by returning an empty result 
      return of(result as T);
    }
  };


}
