import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import {tap, catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  //base url authentication API     
  private apiUrl = 'api/auth';

  //a behaviorSubject stores the current user and allows subscribing to changes
  private   currentUserSubject: BehaviorSubject<User | null>;

  //observable version of currentUserSubject, used by components to react to user changes
  private currentUser: Observable<User | null>;

  //fake DB
  private users: User[] = [
    {
      id: 1,
      username: 'abdel.lam',
      email:'alm@example.com',
      firstname:'abdel',
      lastname: 'lam'
    },
    {
      id:2,
      username: 'lam.abdel',
      email: 'lamabdel@gmail.com',
      firstname: 'lam',
      lastname: 'abdel'
    }
  ];

  constructor(private http: HttpClient, private router: Router) {

    //load the user from local storage(preserve login state after refresh)
    const storedUser = localStorage.getItem('currentUser');

    //initialize the behaviorSubject with the stored user or null
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);

    //expose the subject as an observable
    this.currentUser = this.currentUserSubject.asObservable();
  }


   //getter for the current user (last value of the behaviorSubject)
  public get currentUserValue(): User | null{
    return this.currentUserSubject.value;
  }
  
  login(loginRequest: LoginRequest): Observable<User | null>{

    //in real app we use HttpClient
    //like : this.http.post<User>(`${this.apiUrl}/login`, loginRequest)


    //look for a user with mathing username
    const user = this.users.find(u => u.username == loginRequest.username);

    //we simulate succeful login if user axists
    if(user){
      
      //we assign fake token (in real app , backend sends a real jwt)
      user.token = 'fake-jwt-token';

      //storing user info in localstorage to persist login
      localStorage.setItem('currentUser', JSON.stringify(user));

      //emit the user as the current user
      this.currentUserSubject.next(user);

      //we return the user wrapped in an observable
      return of(user);

    }

    //user not found ,we return null ad watch error
    return of(null).pipe(
      catchError(this.handleError<User>('login'))
    );
    
  }


  register(registerRequest: RegisterRequest): Observable<User>{

     //in real app we use HttpClient
    //like : this.http.post<User>(`${this.apiUrl}/register`, registerRequest)

    //create new user object
    const newUser: User ={
      id: this.getNextId(),
      username: registerRequest.username,
      email: registerRequest.email,
      firstname: registerRequest.firstname,
      lastname: registerRequest.lastname
    };

    //add the new user to the mock users list
    this.users.push(newUser);

    //return the new user as an observable and log it
    return of(newUser).pipe(
      tap(_ => console.log(`registred user: ${newUser.username}`)),
      catchError(this.handleError<User>('register'))
    );
  }


  logout(): void {

    //clear user data from localStorage
    localStorage.removeItem('currentUser');

    //update the BeahviorSubject to null (no user logged in)
    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }


  //getting the next user ID by finding the highest ID and adding 1
  private getNextId(): number {
    return Math.max(...this.users.map(user => user.id),0) + 1;
  }


  //check if a user is logged in
  isLoggedIn(): boolean{
    return !!this.currentUserValue; //true if not null
  }

  //generic error hadler for observables
  private handleError<T>(operation = 'operation', result?: T){
      return (error: any): Observable<T> => {
        console.log(`${operation} failed: ${error.message}`);

        //return a fallback value so the app keeps running
        return of(result as T);
      };
  }


}
