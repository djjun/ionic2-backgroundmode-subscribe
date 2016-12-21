import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, BackgroundMode, LocalNotifications, Vibration } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})

@Injectable()
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private http: Http) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();  

      // Starting BackgroundMode
      BackgroundMode.enable();      

      // Start vars that will be used in the implementation
      // By convention, use $ at the end to identify Observables
      let hasActivate$ = BackgroundMode.onactivate(); // Create a Observable var to BackgroundMode as Activate
      let hasDeactivate$ = BackgroundMode.ondeactivate(); // Create a Observable var to BackgroundMode as Deactivate

      // If BackgroundMode has Activate
      hasActivate$.subscribe(
        () => {
          this.http
            .get('https://sheetsu.com/apis/v1.0/d70e23a85323') // Get data 
            .map(response => response.json())
            .subscribe(

              // Response execute after 2 seconds
              response => setTimeout(
                            () => {
                                    // Using LocalNotifications to display and test your function
                                    LocalNotifications.schedule({
                                        id: 1,
                                        title: 'Local Notification Test',
                                        text: 'Hi ' + response[0].nome,
                                        sound: null
                                    });

                                    // Using Vibration to alert and test your function
                                    Vibration.vibrate([0, 100, 1000, 300, 200, 100, 500, 200, 100]);

                                  }, 2000
              ),
              err => alert('ERROR ' + err)
            );
        },
        err => alert(err)
      ); 

      // If BackgroundMode has Deactivate
      hasDeactivate$.subscribe(
        () => {

          // Cancel vibration
          Vibration.vibrate(0);
        },
        err => alert(err)
      ); 
       
    }); 
  }
}
