import { Component, OnInit, TemplateRef } from '@angular/core';
import { GoldComment } from '../../models/goldComment';
import { GoldenBookService } from '../../services/goldenBook.service';
import { AuthService } from '../../services/guard/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { _ } from '../../services/translation.service';
import { ConfirmationDialogComponent } from '../utils/confirmation/confirmation-dialog.component';
import { ConfirmationDialogService } from '../utils/confirmation/ConfirmationDialog.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-golden-book',
  templateUrl: './golden-book.component.html',
  styleUrls: ['./golden-book.component.css']
})
export class GoldenBookComponent implements OnInit {
  comments: GoldComment[] = [];
  commentModel: GoldComment;
  commentModalRef: BsModalRef;
  isAdmin: boolean;
  evaluationAverage: number;
  numberOfEvaluation: number;

  constructor(
    private commentService: GoldenBookService,
    protected authService: AuthService,
    private modalService: BsModalService,
    private toast: ToastrService,
    private confirmationService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    $('.active').removeClass('active');
    $('#book-nav').addClass('active');

    this.isAdmin = this.authService.isAdminLogged();

    forkJoin(this.commentService.getComments(), this.commentService.getCommentsEvaluationAverage()).subscribe(
      ([comments, average]) => {
        this.evaluationAverage = average;
        this.comments = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.numberOfEvaluation = this.comments.length;
      }
    );
  }

  commentModal(modal: TemplateRef<any>) {
    this.commentModel = new GoldComment();
    this.commentModalRef = this.modalService.show(modal);
  }

  answerCommentModal(comment: GoldComment, modal: TemplateRef<any>) {
    this.commentModel = new GoldComment();
    Object.assign(this.commentModel, comment);
    this.commentModalRef = this.modalService.show(modal);
  }

  saveComment() {
    if (this.commentModel.id) {
      this.commentService.addComment(this.commentModel).subscribe(
        () => {},
        err => console.log(err),
        () => {
          this.commentModalRef.hide();
          this.toast.success(_('Comment created!'));
          this.ngOnInit();
        }
      );
    } else {
      this.commentService.updateComment(this.commentModel).subscribe(
        () => {},
        err => console.log(err),
        () => {
          this.commentModalRef.hide();
          this.toast.success(_('Answer updated!'));
          this.ngOnInit();
        }
      );
    }
  }

  deleteCommentAnswer(comment: GoldComment) {
    this.confirmationService.confirm('Are you sure?').subscribe(
      result => {
        if (result) {
          this.commentModel = new GoldComment();
          Object.assign(this.commentModel, comment);
          this.commentModel.answer = null;
          this.commentService.updateComment(this.commentModel).subscribe(
            () => {},
            err => console.log(err),
            () => {
              this.toast.success(_('Answer deleted!'));
              this.ngOnInit();
            }
          );
        }
      }
    );
  }

  deleteComment(comment: GoldComment) {
    this.confirmationService.confirm("Are you sure?").subscribe(
      result => {
        if (result) {
          this.commentService.deleteComment(comment).subscribe(
            () => {},
            err => console.log(err),
            () => {
              this.toast.success('Comment deleted!');
              this.ngOnInit();
            }
          );
        }
      }
    );
  }

}
