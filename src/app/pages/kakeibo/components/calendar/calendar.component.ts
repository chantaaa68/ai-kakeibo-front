import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailySummary } from '../../../../models/kakeibo.model';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  @Input() public year!: number;
  @Input() public month!: number;
  @Input() public dailySummaries: DailySummary[] = [];
  @Output() public dateSelected = new EventEmitter<Date>();
  @Output() public monthChanged = new EventEmitter<{ year: number; month: number }>();

  public weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // カレンダーの日付配列を取得
  public getCalendarDays(): (Date | null)[][] {
    const firstDay = new Date(this.year, this.month - 1, 1);
    const lastDay = new Date(this.year, this.month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // 月初の空白を埋める
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // 日付を埋める
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(this.year, this.month - 1, day));
    }

    // 月末の空白を埋める
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);

    return weeks;
  }

  // 指定日のサマリーを取得
  public getDailySummary(date: Date | null): DailySummary | undefined {
    if (!date) return undefined;

    return this.dailySummaries.find(summary => {
      // dayNoは日付の日部分
      return summary.dayNo === date.getDate();
    });
  }

  // サマリーから収入合計を計算
  public getIncome(summary: DailySummary): number {
    return summary.items
      .filter(item => item.inoutFlg === true)
      .reduce((sum, item) => sum + item.itemAmount, 0);
  }

  // サマリーから支出合計を計算
  public getExpense(summary: DailySummary): number {
    return summary.items
      .filter(item => item.inoutFlg === false)
      .reduce((sum, item) => sum + item.itemAmount, 0);
  }

  // 日付クリック時
  public onDateClick(date: Date | null): void {
    if (date) {
      this.dateSelected.emit(date);
    }
  }

  // 前月に移動
  public previousMonth(): void {
    let newMonth = this.month - 1;
    let newYear = this.year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    this.monthChanged.emit({ year: newYear, month: newMonth });
  }

  // 次月に移動
  public nextMonth(): void {
    let newMonth = this.month + 1;
    let newYear = this.year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }

    this.monthChanged.emit({ year: newYear, month: newMonth });
  }

  // 金額をフォーマット
  public formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP');
  }
}
