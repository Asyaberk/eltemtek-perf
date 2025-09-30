import { SetMetadata } from '@nestjs/common';

// 'roles' keyini kullanacağız guard içinde böylece erişim açılacak
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
