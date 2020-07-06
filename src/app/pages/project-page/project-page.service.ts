import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectPageService {
  constructor() { }
  subjectMapStatus: Subject<boolean> = new Subject<boolean>();
  showPopoverSubject: Subject<boolean> = new Subject<boolean>();
  showIframeSubject: Subject<string> = new Subject<string>();
}
