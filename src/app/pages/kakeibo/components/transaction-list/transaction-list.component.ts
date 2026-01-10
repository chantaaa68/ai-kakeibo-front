import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionType } from '../../../../models/kakeibo.model';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
  @Input() public transactions: Transaction[] = [];
  @Input() public selectedDate: Date | null = null;

  public TransactionType = TransactionType;

  // 金額をフォーマット
  public formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP');
  }

  // 日付をフォーマット
  public formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
}
