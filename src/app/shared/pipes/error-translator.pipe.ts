import {Injectable, Pipe, PipeTransform} from "@angular/core";

export interface Error {
  msg: string;
  msgToShow: string;
}

@Pipe({
  name: 'errorTranslator'
})
@Injectable({
  providedIn: 'root'
})
export class ErrorTranslatorPipe implements PipeTransform {
  private Errors: Array<Error> = [
    {msg: "SEND_LOCK", msgToShow: "გაგზავნა შეზღუდულია, სანამ ძველი კოდი აქტიურია"},
    {msg: "OPERATION_LIMIT_EXHAUSTED", msgToShow: "ოპერაციის მცდელობის ლიმიტი ამოიწურა, მომხმარებელი  დროებით დაბლოკილია"},
    {msg: "OPERATION_LIMIT_PER_OTP_EXHAUSTED", msgToShow: "ერთ კოდზე ოპერაციის დადასტურების ლიმიტი ამოიწურა, გააგზავნეთ ახალი კოდი"},
    {msg: "INVALID_OTP", msgToShow: "კოდი არასწორია"},
    {msg: "OPERATION_NOT_ACTIVE", msgToShow: "ოპერაცია არ არის აქტიური"},
    {msg: "OPERATION_NOTFOUND", msgToShow: "ოპერაცია ვერ მოიძებნა"},
    {msg: "CHALLENGES_NOTFOUND", msgToShow: "Otp ვერ მოიძებნა, გთხოვთ გააგზავნოთ ახალი"},
    {msg: "OTP_COULD_NOT_SEND", msgToShow: "Otp კოდის გაგზავნა ვერ მოხერხდა"},
    {msg: "UNBLOCK_ERROR", msgToShow: "განბლოკვის შეცდომა"},
    {msg: "RESET_ERROR", msgToShow: "პაროლის გენერაციის შეცდომა"},
    {msg: "UNKNOWN", msgToShow: "უცნობი შეცდომა"},
  ];

  transform(msg: string): string {
    let msgToShow: string = '';
    for (const error of this.Errors) {
      if (error.msg === msg) {
        msgToShow = error.msgToShow;
        break;
      }
    }
    if (msgToShow) {
      return msgToShow;
    } else {
      return 'მოხდა შეცდომა'
    }
  }
}
