import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { LinkModel } from '../../models/link.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  @ViewChild('addLinkTemplate') linkTemplate: TemplateRef<any>;

  currentLang: string;
  links: LinkModel[];
  isAdmin: boolean;
  linkModalRef: BsModalRef;
  linkModel: LinkModel;

  constructor(
    private linkService: LinkService,
    private translate: TranslateService,
    protected authService: AuthService,
    private modalService: BsModalService,
    private toast: ToastrService,
    private confirmation: ConfirmationDialogService
  ) {
    translate.onLangChange.subscribe(event => {
      this.afterInit();
    });
  }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#links-nav').addClass('active');
    this.linkModel = new LinkModel();
    this.links = [];
    this.linkService.getLinks().subscribe(
      data => this.links = data
    );
    this.isAdmin = this.authService.isAdminLogged();
    this.afterInit();
  }

  afterInit() {
    this.currentLang = this.translate.currentLang;
  }

  openLink(link: LinkModel) {
    if (this.isAdmin) {
      Object.assign(this.linkModel, link);
      this.addLink(this.linkTemplate, true);
    } else {
      window.open(link.link, '_blank');
    }
  }

  getLinkProperty(link: LinkModel, property: string) {
    const lang = this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1);
    return link[property + lang];
  }

  addLink(modal: TemplateRef<any>, edit: boolean = false) {
    if (!edit) {
      this.linkModel = new LinkModel();
    }
    this.linkModalRef = this.modalService.show(modal);
  }

  saveLink() {
    this.linkService.addLink(this.linkModel).subscribe(
      data => {},
      err => console.log(err),
      () => {
        this.linkModalRef.hide();
        this.toast.success('Link added!');
        this.ngOnInit();
      }
    );
  }

  deleteLink(link: LinkModel) {
    this.confirmation.confirm('Are you sure').subscribe(
      result => {
        if(result) {
          this.linkService.deleteLink(link).subscribe(
            data => {},
            err => console.log(err),
            () => {
              this.toast.success('Link deleted!');
              this.linkModalRef.hide();
              this.ngOnInit();
            }
          )
        }
      }
    )
  }

}
