import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { CanvasRoutingModule } from './canvas-routing.module';
import { CanvasComponent } from './canvas.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, CanvasRoutingModule, FormsModule],
  declarations: [CanvasComponent],
})
export class CanvasModule {}
