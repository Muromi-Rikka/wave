import { Component, ElementRef, ViewChild } from '@angular/core';
import { WaveService } from './wave.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wavesurfer';

  @ViewChild("audioRef",{static:true}) audioEle:ElementRef<HTMLAudioElement>;
  @ViewChild("waveCanvas",{static:true}) waveCanvas:ElementRef<HTMLCanvasElement>;

  constructor(private waveService:WaveService){}

  ngOnInit(): void {
    this.waveService.getAudio().subscribe(data=>{
      this.waveService.draw(this.waveCanvas.nativeElement);
      // console.log(data);
    })
  }

  ngAfterViewInit(): void {
    this.waveCanvas.nativeElement.width = window.innerWidth;
    this.waveCanvas.nativeElement.height = window.innerHeight;
    this.waveService.start(this.audioEle.nativeElement);
  }
}
