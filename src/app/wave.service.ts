import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject,Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WaveService {

  private dataArray$ = new BehaviorSubject<Uint8Array>(new Uint8Array());
  private bufferLength = 0;
  private audioCtx = new AudioContext()
  private analyser = this.audioCtx.createAnalyser();
  private rgbList= [];
  constructor(
    private http:HttpClient
  ) { }

  start(audioEle:HTMLAudioElement):void{
    this.analyser.fftSize = 256;
    const source = this.audioCtx.createMediaElementSource(audioEle);
    source.connect(this.analyser)
    this.analyser.connect(this.audioCtx.destination)
    // source
    this.bufferLength = this.analyser.frequencyBinCount;
    setInterval(()=>{
      let dataArray = new Uint8Array(this.bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
      this.dataArray$.next(dataArray);
    },10);
    audioEle.play()
  }

  draw(canvasEle:HTMLCanvasElement):void{
    let dataArr = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(dataArr);
    const bar_w = canvasEle.width/this.bufferLength;
    const canvasCtx = canvasEle.getContext("2d");
    this.rgb();
    canvasCtx.clearRect(0,0,canvasEle.width,canvasEle.height);
    for(let i = 0;i<this.bufferLength;i++){
      let bar_x = i*bar_w;
      let bar_h = (dataArr[i]/255)*canvasEle.height;
      let bar_y = canvasEle.height - bar_h;
      canvasCtx.fillStyle = this.rgbList[Math.floor(this.rgbList.length/this.bufferLength*i)][0];
      canvasCtx.fillRect(bar_x,bar_y,bar_w,bar_h);
    }
  }

  rgb(){
    let r=0,g=0,b=0;
    if(this.rgbList.length===0){
      r=255,g=0,b=0;
    }else{
      r=this.rgbList[1][1];
      g=this.rgbList[1][2];
      b=this.rgbList[1][3];
    }
    this.rgbList.length=0;
    for(let i = 0;i<255;i++){
      if(r>0 && b==0){
        r--;
        g++;
      }
      if(g>0 && r==0){
        g--;
        b++;
      }
      if(b>0&&g==0){
        r++;
        b--;
      }
      this.rgbList.push([`rgb(${r},${g},${b})`,r,g,b]);
    }
  }

  getAudio():Observable<Uint8Array>{
    return this.dataArray$.asObservable().pipe(filter(a=>a.some(item=>item!==0)));
  }

}
