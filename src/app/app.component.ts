import { Component, OnInit, inject, DestroyRef, signal, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal('0')
  clickCount$ = toObservable(this.clickCount)
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {

      if (timesExecuted > 3) {
        clearInterval(interval)
        subscriber.complete();
        return;
      }
      console.log("Emiting new value...")
      subscriber.next({ message: "new Value" })
      timesExecuted++;
    }, 2000)
  })
  interval$ = interval(1000)
  intervalSignal = toSignal(this.interval$, { initialValue: 0, manualCleanup: true })
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
    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log("COMPLETED")
    })

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
