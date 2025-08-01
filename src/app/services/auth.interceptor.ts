import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';


// functionnal interceptor that inject Authservice manually
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue;

  //if the user logged in and the token exist

  if(currentUser && currentUser.token){
    //we clone the request and set the authorization header with the Bearer token
    const authReq =  req.clone({
      setHeaders : {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
    //forward the cloned request with the token 
    return next(authReq);

  }
  //if no token forward the original req
  return next(req);
};
