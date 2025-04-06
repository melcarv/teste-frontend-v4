import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { equipmentName: string; history: string[] }) {}
}
