import { Component, OnInit, HostListener, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { ReservationService } from '../../services/reservation.service';
import { ReservationType, ReservationModel } from 'src/models/reservation.model';
import { FullCalendar } from 'primeng/fullcalendar';
import { ConfigService } from '../../services/config/config.service';
import interactionPlugin from '@fullcalendar/interaction';
import { Reservation } from '../../models/reservation.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';
import { AuthService } from '../../services/guard/auth.service';
import { _ } from '../../services/translation.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  @ViewChild('fc') calendar: FullCalendar;
  @ViewChild('editEventTemplate') modalRef: ElementRef;
  @ViewChild('monthTemplate') monthTemplate: TemplateRef<any>;

  isAdmin: boolean;

  selectedYear: number;
  selectedMonth: number;
  nextFiveYears: number[] = [];

  reservations: Reservation[];
  events: any[] = [];
  options: any;

  reservationType = ReservationType;
  public reservationTypeKeys;

  public editModalRef: BsModalRef;
  reservationModel: Reservation;

  legends = [
    {
      name: _('Occupation complète'),
      colors: [this.configService.getValueByKey('entireVillaColor')]
    },
    {
      name: _('Occupation partielle'),
      colors: [this.configService.getValueByKey('upstairsColor'), this.configService.getValueByKey('downstairsColor')]
    }
  ]

  constructor(
    private reservationService: ReservationService,
    protected configService: ConfigService,
    private modalService: BsModalService,
    private toast: ToastrService,
    private confirmationService: ConfirmationDialogService,
    protected authService: AuthService
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    if (width > 580) {
      this.calendar.getCalendar().changeView('dayGridMonth');
    } else {
      //this.calendar.getCalendar().changeView('listMonth');
    }
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#disponibilities-nav').addClass('active');
    this.isAdmin = this.authService.isAdminLogged();
    this.reservationTypeKeys = Object.keys(this.reservationType);
    this.reservationTypeKeys = this.reservationTypeKeys.slice(0, this.reservationTypeKeys.length / 2);

    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = new Date().getMonth();
    
    for (let i = 0; i < 5; i++) {
      this.nextFiveYears.push(this.selectedYear + i);
    }

    this.options = {
      plugins: [dayGridPlugin, listPlugin, interactionPlugin],
      defaultDate: new Date(),
      displayEventTime: false,
      contentHeight: 650,
      header: {
          left: 'prev',
          center: 'title',
          right: 'next'
      },
      dateClick: (e) =>  {
        if (!this.isAdmin) {
          return;
        }
        this.reservationModel = new Reservation();
        this.reservationModel.from = e.date;
        this.reservationModel.isNew = true;
        this.eventModal();
      },
      eventClick: (e) => {
        if (!this.isAdmin) {
          return;
        }
        this.reservationModel = new Reservation();
        const reservation = this.reservations.find(x => {
          return x.id === e.event.id;
        });
        if (!reservation) {
          this.toast.warning('Cannot find the event!');
          return;
        }
        Object.assign(this.reservationModel, reservation);
        this.reservationModel.from = new Date(reservation.from);
        this.reservationModel.to = new Date(reservation.to);
        this.reservationModel.isNew = false;
        this.eventModal();
      }
    };

    if ($(window).width() > 580) {
      this.options['defaultView'] = 'dayGridMonth';
    } else {
      //this.options['defaultView'] = 'listMonth';
    }

    this.reservationService.getReservations().subscribe(
      data => {
        this.reservations = data;
        data.forEach(r => {
          this.events = [...this.events, {
            'id': r.id,
            'title': r.name,
            'start': r.from,
            'end': r.to,
            'color': this.configService.getValueByKey(ReservationType[r.type].charAt(0).toLowerCase()
                                                      + ReservationType[r.type].slice(1)
                                                      + 'Color')
          }];
        });
      }
    );
  }

  eventModal() {
    this.editModalRef = this.modalService.show(this.modalRef);
  }

  saveReservation() {
    const model = new ReservationModel();
    Object.assign(model, this.reservationModel);
    model.from = new Date(this.reservationModel.from).toLocaleString('en-US');
    model.to = new Date(this.reservationModel.to).toLocaleString('en-US');

    if (this.reservationModel.isNew) {
      this.reservationService.addReservation(model).subscribe(
        data => this.toast.success('Reservation created!'),
        err => console.log(err),
        () => {
          this.editModalRef.hide();
          this.events = [];
          this.ngOnInit();
        }
      );
    } else {
      this.reservationService.updateReservation(model).subscribe(
        data => this.toast.success('Reservation created!'),
        err => console.log(err),
        () => {
          this.editModalRef.hide();
          this.events = [];
          this.ngOnInit();
        }
      );
    }
  }

  deleteReservation() {
    this.confirmationService.confirm('Are you sure to delete this event?').subscribe(result => {
      if (result) {
        this.reservationService.deleteReservation(this.reservationModel).subscribe(
          data => this.toast.success('Reservation deleted!'),
          err => console.log(err),
          () => {
            this.editModalRef.hide();
            this.events = [];
            this.ngOnInit();
          }
        );
      }
    });
  }

  onMonthSelect() {
    this.calendar.getCalendar().gotoDate(new Date(this.selectedYear, this.selectedMonth));
  }
}
