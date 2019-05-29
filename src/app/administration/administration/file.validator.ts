import { Observable, Observer } from "rxjs";
import { AbstractControl } from "@angular/forms";

export const fileType = (control : AbstractControl) : Promise<{[key : string] : any}> | Observable<{[key : string] : any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = Observable.create((observer : Observer<{[key : string] : any}>) => {
        fileReader.addEventListener("loaded",() =>{
            const arr = new Uint8Array().subarray(0,4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
        });
        fileReader.readAsArrayBuffer(file);

    });
    return frObs;
};
