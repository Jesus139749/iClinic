import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  async testDataBase(): Promise<string> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: 3
      }
    });

    if (user == null)
      throw new NotFoundException();

    return user.name;
  }
}
