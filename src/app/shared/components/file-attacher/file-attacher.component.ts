import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-file-attacher',
  templateUrl: './file-attacher.component.html',
  styleUrls: ['./file-attacher.component.scss']
})
export class FileAttacherComponent implements OnInit {
  files: string [] = [];
  globalAttachedFiles: any = [];
  uploadForm!: FormGroup;

  @Output() getAttachedFiles = new EventEmitter<any>();
  @Output() errorMessage = new EventEmitter<any>();
  @Input() countValidator?: number;
  @Input() sizeValidator?: number;
  @Input() typeValidator?: any;
  @Input() uploaderType: any;
  @Input() disabled?: boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.uploadForm = this.fb.group({
      file: ['']
    })
  }

  deleteAttachedFile(inFile: any) {
    this.globalAttachedFiles = this.globalAttachedFiles.filter((file: any) => file !== inFile);
    this.getAttachedFiles.emit(this.globalAttachedFiles);
  }

  onFileChange(event: any) {
    if (this.countValidator) {
      // რაოდენობაზე ვალიდაცია
      if (
        this.globalAttachedFiles.length < this.countValidator &&
        this.globalAttachedFiles.length + event.target.files.length <=
        this.countValidator
      ) {
        // ფაილის თითო-თითო შემოწმება
        for (const element of event.target.files.length) {
          let file = element;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {file["documentContent"] = reader.result};

          // ფაილის ზომაზე ვალიდაცია
          if (this.sizeValidator) {
            if (file.size <= this.sizeValidator) {
              // ფაილის თაიფზე ვალიდაცია
              if (this.typeValidator) {
                let splt = file.name.split(".")
                let type = splt[splt.length - 1].toLowerCase();
                if (this.typeValidator.indexOf(type) > -1) {

                  this.globalAttachedFiles.push(file);
                  this.errorMessage.emit("")

                } else {
                  // თუ ფაილის თაიფზე ასხავს
                  let temp =
                    'ფაილი "' +
                    file.name.toString() +
                    '" არ უნდა იყოს "' + type + '" ფორმატის';
                  this.errorMessage.emit(temp);
                  event = null;
                  break;
                }
              } else {
                // თუ ტაიფზე ვალიდაცია არაა
                this.globalAttachedFiles.push(file);
                this.errorMessage.emit("")
              }
            } else {
              // თუ ზომის ვალიდაცია ასხავს
              let temp =
                "ატვირთული ფაილები აჭარბებს დასაშვებ ზომას [" +
                (this.sizeValidator / 1000000).toString() +
                "მბ]";
              this.errorMessage.emit(temp);
              event = null;
              break;
            }
          } else {
            // თუ ზომაზე ვალიდაცია არაა
            this.globalAttachedFiles.push(file);
            this.errorMessage.emit("")
          }
        }

        this.getAttachedFiles.emit(this.globalAttachedFiles);
        event = null;
      } else {
        // თუ რაოდენობა ასხავს
        this.errorMessage.emit(
          "შეუძლებელია " +
          this.countValidator.toString() +
          " ფაილზე მეტის ატვირთვა"
        );
        this.getAttachedFiles.emit();
      }
    } else {
      // ატვირთვა ვალიდაციის გარეშე
      for (const element of event.target.files.length) {
        this.globalAttachedFiles.push(element);
      }
      this.getAttachedFiles.emit(this.globalAttachedFiles);
      event = null;
    }
  }
}
