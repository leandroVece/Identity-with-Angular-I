import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../services/TokenServices';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  http: any;

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica si la solicitud necesita un token de autorización
    //if (request.headers.has('Authorization')) {
    const token = this.tokenService.getToken();

    if (token) {
      // Clona la solicitud original y agrega el token de autorización
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token.tokenAcces.token}`)
      });

      // Envía la solicitud con el token adjunto
      return next.handle(authReq);
    }
    //}

    // Si no se necesita un token de autorización, sigue adelante con la solicitud original
    return next.handle(request);
  }

  // refreshAccessToken(): Observable<any> {
  //   return this.http.get(`${environment.Api_url}/Authentication/refresh-token`).pipe(
  //     tap((response: any) => {
  //       // Guardar el nuevo token en el servicio de tokens
  //       this.tokenService.saveToken(response.access_token);
  //     })
  //   );
  // }

}
