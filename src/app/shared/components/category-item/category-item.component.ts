import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../models/kakeibo.model';

@Component({
  selector: 'app-category-item',
  imports: [CommonModule, MatIconModule],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss'
})
export class CategoryItemComponent {
  @Input() public category!: Category;
}
