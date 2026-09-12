// FILE: apps/api-gateway/src/modules/auth/decorators/menu-key.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const MENU_KEY_METADATA = 'menu_key';

/** Declares which Core `menu_key` this controller/handler belongs to. */
export const MenuKey = (menuKey: string): MethodDecorator & ClassDecorator =>
  SetMetadata(MENU_KEY_METADATA, menuKey);
