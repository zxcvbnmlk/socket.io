import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { SolidRoutingModule } from './solid-routing.module';
import { SolidComponent } from './solid.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, SolidRoutingModule],
  declarations: [SolidComponent],
})
export class SolidModule {}
