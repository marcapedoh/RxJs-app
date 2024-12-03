import { Component, OnInit, inject, DestroyRef, signal, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal('0')
  clickCount$ = toObservable(this.clickCount)
  constructor() {
    /*effect(() => {
      console.log("clicked button ", this.clickCount());
    })*/
    toObservable(this.clickCount);
  }
  ngOnInit() {

    /* const subscription = interval(1000).pipe(
       map((val) => val)
     ).subscribe({
       next: (val) => console.log(val)
     });
 
     this.destroyRef.onDestroy(() => {
       subscription.unsubscribe()
     })*/

    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log('Clicked button ', val)
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }

  onClick() {
    this.clickCount.update(prevCount => prevCount + 1)
  }
}
